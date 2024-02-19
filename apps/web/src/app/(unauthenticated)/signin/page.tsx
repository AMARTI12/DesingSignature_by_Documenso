import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { env } from 'next-runtime-env';

import { IS_GOOGLE_SSO_ENABLED } from '@documenso/lib/constants/auth';
import { decryptSecondaryData } from '@documenso/lib/server-only/crypto/decrypt';

import { SignInForm } from '~/components/forms/signin';

export const metadata: Metadata = {
  title: 'Sign In',
};

type SignInPageProps = {
  searchParams: {
    email?: string;
  };
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  const NEXT_PUBLIC_DISABLE_SIGNUP = env('NEXT_PUBLIC_DISABLE_SIGNUP');

  const rawEmail = typeof searchParams.email === 'string' ? searchParams.email : undefined;
  const email = rawEmail ? decryptSecondaryData(rawEmail) : null;

  if (!email && rawEmail) {
    redirect('/signin');
  }

  return (
    <div>
      <h1 className="text-4xl font-semibold">Ingresa con tu cuenta</h1>

      <p className="text-muted-foreground/60 mt-2 text-sm">
        Bienvenido, que bueno tenerte de nuevo.
      </p>

      <SignInForm
        className="mt-4"
        initialEmail={email || undefined}
        isGoogleSSOEnabled={IS_GOOGLE_SSO_ENABLED}
      />

      {NEXT_PUBLIC_DISABLE_SIGNUP !== 'true' && (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="text-primary duration-200 hover:opacity-70">
            Registrate
          </Link>
        </p>
      )}

      <p className="mt-2.5 text-center">
        <Link
          href="/forgot-password"
          className="text-muted-foreground text-sm duration-200 hover:opacity-70"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </div>
  );
}
