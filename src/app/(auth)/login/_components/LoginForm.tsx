'use client'

import { useActionState, useTransition } from 'react'
import { signInWithMagicLink, signInWithGoogle, type AuthActionState } from '@/actions/auth'

const initialState: AuthActionState = {}

export default function LoginForm({ urlError }: { urlError?: string }) {
  const [state, formAction, isPending] = useActionState(signInWithMagicLink, initialState)
  const [googlePending, startGoogleTransition] = useTransition()

  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      await signInWithGoogle()
    })
  }

  if (state.success) {
    return (
      <>
        <div className="ns-form-wrap">
          <div className="ns-form">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                style={{ margin: '0 auto 16px', display: 'block' }}
                aria-hidden="true"
              >
                <rect x="6" y="12" width="36" height="26" rx="4" stroke="#2F4C3A" strokeWidth="1.5" fill="none" />
                <path d="M6 18 L24 28 L42 18" stroke="#2F4C3A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <h1 className="ns-form__title" style={{ textAlign: 'center' }}>
              Check your inbox.
            </h1>
            <p className="ns-form__sub" style={{ textAlign: 'center', maxWidth: '100%' }}>
              We sent a magic link to <strong>{state.email}</strong>. Click it to
              sign in — it expires after one use.
            </p>
            <p className="ns-form__note">
              Didn&rsquo;t get it? Check your spam folder, or{' '}
              <button
                type="button"
                className="ns-link"
                onClick={() => window.location.reload()}
              >
                try again
              </button>
              .
            </p>
          </div>
        </div>
        <div className="ns-trust">
          <TrustItems />
        </div>
      </>
    )
  }

  const errorMessage = urlError === 'oauth_failed'
    ? 'Google sign-in failed. Please try again.'
    : urlError === 'callback_failed'
      ? 'Sign-in failed. Please request a new link.'
      : urlError
        ? 'That link has expired. Please request a new one.'
        : state.error

  return (
    <>
      <div className="ns-form-wrap">
        <form className="ns-form" action={formAction}>
          <h1 className="ns-form__title">You&rsquo;re almost in.</h1>
          <p className="ns-form__sub">
            No passwords. We&rsquo;ll send a magic link to your email.
          </p>

          {errorMessage && (
            <div className="ns-form__error" role="alert">
              {errorMessage}
            </div>
          )}

          <label className="ns-form__label" htmlFor="ns-email">
            Email address
          </label>
          <div className="ns-form__field">
            <input
              id="ns-email"
              name="email"
              className="ns-form__input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            className="ns-btn ns-btn--primary ns-btn--full ns-form__cta"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              'Sending…'
            ) : (
              <>
                Send magic link <ArrowIcon />
              </>
            )}
          </button>

          <p className="ns-form__note">We&rsquo;ll never share your email. Ever.</p>

          <div className="ns-form__divider">
            <span>or</span>
          </div>

          <button
            className="ns-btn ns-btn--secondary ns-btn--full"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googlePending || isPending}
          >
            <GoogleIcon />
            {googlePending ? 'Redirecting…' : 'Continue with Google'}
          </button>

          <p className="ns-form__legal">
            By continuing, you agree to our{' '}
            <a href="/privacy" className="ns-link ns-link--quiet">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>

      <div className="ns-trust">
        <TrustItems />
      </div>
    </>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3 7 H 11 M8 4 L 11 7 L 8 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M15.2 8.18c0-.56-.05-1.1-.14-1.62H8v3.07h4.04a3.46 3.46 0 0 1-1.5 2.27v1.88h2.42c1.42-1.3 2.24-3.23 2.24-5.6z"
        fill="#4285F4"
      />
      <path
        d="M8 15.5c2.03 0 3.73-.67 4.97-1.82l-2.42-1.88c-.67.45-1.53.72-2.55.72-1.96 0-3.62-1.32-4.21-3.1H1.3v1.93A7.5 7.5 0 0 0 8 15.5z"
        fill="#34A853"
      />
      <path
        d="M3.79 9.42A4.5 4.5 0 0 1 3.55 8c0-.5.09-.98.24-1.42V4.65H1.3A7.5 7.5 0 0 0 .5 8c0 1.21.29 2.36.8 3.35l2.49-1.93z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.48c1.1 0 2.09.38 2.87 1.12l2.14-2.14A7.5 7.5 0 0 0 8 .5 7.5 7.5 0 0 0 1.3 4.65l2.49 1.93C4.38 4.8 6.04 3.48 8 3.48z"
        fill="#EA4335"
      />
    </svg>
  )
}

function TrustItems() {
  return (
    <>
      <div className="ns-trust__item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1 L 12 3 V7 Q12 11 7 13 Q2 11 2 7 V3 Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M5 7 L 6.5 8.5 L 9 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Encrypted end-to-end</span>
      </div>
      <div className="ns-trust__item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M4 7.5 L 6 9 L 10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Delete your account anytime</span>
      </div>
      <div className="ns-trust__item">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M7 4.5 V7 L 9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span>3-minute setup, then you&rsquo;re in</span>
      </div>
    </>
  )
}
