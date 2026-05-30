'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ConnectForm({ token }: { token: string }) {
  const t = useTranslations('connect');
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', company: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email required';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Minimum 10 characters';
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError(null);
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error ?? 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setServerError('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[var(--bg-subtle)] border border-[var(--accent-dim)] rounded-lg p-8 text-center">
        <span className="block text-2xl mb-3 text-[var(--accent)]">✓</span>
        <p className="font-heading font-semibold text-[var(--fg)] mb-2">{t('send')}</p>
        <p className="text-xs font-mono text-[var(--fg-muted)]">Gary Wu 將盡快回覆您。</p>
      </div>
    );
  }

  const fields = [
    { id: 'name', label: t('name_label'), type: 'text', placeholder: t('name_placeholder'), autoComplete: 'name' },
    { id: 'email', label: t('email_label'), type: 'email', placeholder: t('email_placeholder'), autoComplete: 'email' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from users, traps bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      {fields.map(({ id, label, type, placeholder, autoComplete }) => (
        <div key={id}>
          <label htmlFor={`contact-${id}`} className="block text-xs font-mono text-[var(--fg-muted)] mb-1.5">{label}</label>
          <input
            id={`contact-${id}`}
            type={type}
            autoComplete={autoComplete}
            value={formData[id]}
            onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
            placeholder={placeholder}
            aria-describedby={errors[id] ? `contact-${id}-error` : undefined}
            aria-invalid={!!errors[id]}
            className="w-full px-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded text-sm font-mono text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors aria-[invalid=true]:border-red-400"
          />
          {errors[id] && <p id={`contact-${id}-error`} role="alert" className="text-xs font-mono text-red-400 mt-1">{errors[id]}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="contact-message" className="block text-xs font-mono text-[var(--fg-muted)] mb-1.5">{t('message_label')}</label>
        <textarea
          id="contact-message"
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder={t('message_placeholder')}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={!!errors.message}
          className="w-full px-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded text-sm font-mono text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none aria-[invalid=true]:border-red-400"
        />
        {errors.message && <p id="contact-message-error" role="alert" className="text-xs font-mono text-red-400 mt-1">{errors.message}</p>}
      </div>

      {status === 'error' && serverError && (
        <p role="alert" className="text-xs font-mono text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-2.5 bg-[var(--accent)] text-[var(--bg)] text-sm font-heading font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? '...' : t('send')}
      </button>
    </form>
  );
}
