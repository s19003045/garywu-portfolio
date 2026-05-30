import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, isGmailConfigured } from '@/lib/gmail';
import { verifyToken, looksLikeSpam, isDuplicate } from '@/lib/anti-spam';
import { siteConfig } from '@/lib/site';

export const runtime = 'nodejs';

/** Simple in-memory rate limiter (per server instance). */
const RATE_LIMIT = 5; // requests
const WINDOW_MS = 60 * 60 * 1000; // per hour
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  // Feature flag — contact form is disabled site-wide.
  if (!siteConfig.features.contactForm) {
    return NextResponse.json(
      { error: 'Contact form is currently disabled.' },
      { status: 403 }
    );
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let payload: {
    name?: string;
    email?: string;
    message?: string;
    company?: string; // honeypot
    token?: string; // signed timing token
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, message, company, token } = payload;

  // Layer 1a — Honeypot: real users never fill this hidden field.
  if (company) {
    return NextResponse.json({ ok: true }); // silently accept, drop
  }

  // Validation
  if (!name?.trim() || name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name.' }, { status: 400 });
  }
  if (!email?.trim() || !isValidEmail(email) || email.length > 200) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!message?.trim() || message.trim().length < 10 || message.length > 5000) {
    return NextResponse.json({ error: 'Invalid message.' }, { status: 400 });
  }

  // Layer 1b — Timing token: blocks too-fast submissions & replays.
  const tokenCheck = verifyToken(token);
  if (!tokenCheck.ok) {
    console.warn('[contact] token rejected:', tokenCheck.reason);
    return NextResponse.json({ ok: true }); // silently drop — don't tip off bots
  }

  // Layer 2 — Content heuristics.
  const spam = looksLikeSpam(name.trim(), message.trim());
  if (spam.spam) {
    console.warn('[contact] spam heuristic:', spam.reason);
    return NextResponse.json({ ok: true }); // silently drop
  }

  // Layer 3 — Duplicate suppression.
  if (isDuplicate(email.trim(), message.trim())) {
    return NextResponse.json({ ok: true }); // already received, drop quietly
  }

  // If email backend isn't configured yet, fail gracefully with a clear signal.
  if (!isGmailConfigured()) {
    console.warn('[contact] Gmail not configured — message not sent:', {
      name,
      email,
    });
    return NextResponse.json(
      { error: 'Email service is not configured yet.' },
      { status: 503 }
    );
  }

  try {
    await sendContactEmail({
      fromName: `${name.trim()} (via garywudev)`,
      replyTo: email.trim(),
      subject: `New contact message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
