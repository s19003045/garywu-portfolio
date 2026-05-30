/**
 * Minimal Gmail API sender using OAuth2 refresh token.
 * Avoids the heavy `googleapis` dependency — talks to the REST API via fetch.
 *
 * Required environment variables (see .env.example):
 *   GMAIL_CLIENT_ID
 *   GMAIL_CLIENT_SECRET
 *   GMAIL_REFRESH_TOKEN
 *   GMAIL_SENDER        — the Gmail address that owns the OAuth credentials
 *   CONTACT_RECIPIENT   — where contact messages are delivered
 */

interface SendArgs {
  fromName: string;
  replyTo: string;
  subject: string;
  text: string;
}

async function getAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID ?? '',
    client_secret: process.env.GMAIL_CLIENT_SECRET ?? '',
    refresh_token: process.env.GMAIL_REFRESH_TOKEN ?? '',
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`OAuth token exchange failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No access_token returned');
  return data.access_token;
}

/** Encode a string to base64url (RFC 4648) as required by the Gmail API. */
function toBase64Url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Encode a UTF-8 header value per RFC 2047 so non-ASCII names render correctly. */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value).toString('base64')}?=`;
}

export async function sendContactEmail(args: SendArgs): Promise<void> {
  const sender = process.env.GMAIL_SENDER;
  const recipient = process.env.CONTACT_RECIPIENT;
  if (!sender || !recipient) {
    throw new Error('GMAIL_SENDER / CONTACT_RECIPIENT not configured');
  }

  const accessToken = await getAccessToken();

  const headers = [
    `From: ${encodeHeader(args.fromName)} <${sender}>`,
    `To: ${recipient}`,
    `Reply-To: ${args.replyTo}`,
    `Subject: ${encodeHeader(args.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
  ].join('\r\n');

  const body = Buffer.from(args.text).toString('base64');
  const raw = toBase64Url(`${headers}\r\n\r\n${body}`);

  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gmail send failed: ${res.status} ${detail}`);
  }
}

/** True only when all required Gmail env vars are present. */
export function isGmailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN &&
      process.env.GMAIL_SENDER &&
      process.env.CONTACT_RECIPIENT
  );
}
