import crypto from 'node:crypto';

/**
 * Dependency-free anti-spam layer for the contact form.
 *
 * Layers (in addition to the honeypot + rate limit in the route):
 *  1. Signed timing token — blocks submissions faster than a human could fill the form
 *     and rejects stale/replayed tokens.
 *  2. Content heuristics — too many links / spam keywords / gibberish.
 *  3. Duplicate suppression — same content re-sent within a short window.
 */

const SECRET =
  process.env.CONTACT_TOKEN_SECRET ?? 'dev-only-fallback-change-in-production';

const MIN_FILL_MS = 3_000; // < 3s ⇒ almost certainly a bot
const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1000; // 2h ⇒ stale / replay

// ─── 1. Signed timing token ──────────────────────────────────

function sign(value: string): string {
  return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

/** Mint a token embedding the issue time, signed so it can't be forged. */
export function mintToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifyToken(token: string | undefined): {
  ok: boolean;
  reason?: string;
} {
  if (!token || !token.includes('.')) return { ok: false, reason: 'missing token' };
  const [issuedAt, sig] = token.split('.');
  if (!issuedAt || !sig) return { ok: false, reason: 'malformed token' };

  const expected = sign(issuedAt);
  // Constant-time compare
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return { ok: false, reason: 'bad signature' };
  }

  const age = Date.now() - Number(issuedAt);
  if (Number.isNaN(age)) return { ok: false, reason: 'bad timestamp' };
  if (age < MIN_FILL_MS) return { ok: false, reason: 'submitted too fast' };
  if (age > MAX_TOKEN_AGE_MS) return { ok: false, reason: 'token expired' };

  return { ok: true };
}

// ─── 2. Content heuristics ───────────────────────────────────

const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'porn', 'sex',
  'crypto pump', 'forex', 'binary option',
  'seo service', 'backlink', 'guest post', 'rank your',
  'make money', 'earn money', 'work from home', 'bitcoin doubl',
  'loan offer', 'cheap meds', 'free gift', 'click here now',
  'telegram', 'whatsapp +', 'нhref', '[url=',
];

const URL_RE = /https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|ru|cn|top|xyz|info|biz)\b/gi;

export function looksLikeSpam(name: string, message: string): {
  spam: boolean;
  reason?: string;
} {
  const haystack = `${name}\n${message}`.toLowerCase();

  // Too many links
  const links = message.match(URL_RE) ?? [];
  if (links.length > 2) return { spam: true, reason: 'too many links' };

  // BBCode / HTML anchor injection
  if (/\[url[=\]]|<a\s+href|\[link/i.test(message)) {
    return { spam: true, reason: 'markup injection' };
  }

  // Spam keywords
  for (const kw of SPAM_KEYWORDS) {
    if (haystack.includes(kw)) return { spam: true, reason: `keyword: ${kw}` };
  }

  // Long run of identical characters (e.g. "aaaaaaaaaa")
  if (/(.)\1{15,}/.test(message)) return { spam: true, reason: 'char flooding' };

  // Mostly non-letter gibberish in a long message
  if (message.length > 40) {
    const letters = (message.match(/[\p{L}]/gu) ?? []).length;
    if (letters / message.length < 0.3) {
      return { spam: true, reason: 'low text ratio' };
    }
  }

  return { spam: false };
}

// ─── 3. Duplicate suppression ────────────────────────────────

const DEDUPE_WINDOW_MS = 10 * 60 * 1000; // 10 min
const recent = new Map<string, number>();

export function isDuplicate(email: string, message: string): boolean {
  const key = crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}|${message.trim()}`)
    .digest('hex');

  const now = Date.now();
  // Opportunistic cleanup
  for (const [k, t] of recent) {
    if (now - t > DEDUPE_WINDOW_MS) recent.delete(k);
  }

  const prev = recent.get(key);
  if (prev && now - prev < DEDUPE_WINDOW_MS) return true;
  recent.set(key, now);
  return false;
}
