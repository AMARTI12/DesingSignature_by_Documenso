import type { Metadata } from 'next';
import Link from 'next/link';

import { ForgotPasswordForm } from '~/components/forms/forgot-password';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Olvidaste tu contraseña?</h1>

      <p className="text-muted-foreground mt-2 text-sm">
      ¡No te preocupes, sucede! Ingrese su correo electrónico y le enviaremos un enlace especial para restablecer su contraseña.
      </p>

      <ForgotPasswordForm className="mt-4" />

      <p className="text-muted-foreground mt-6 text-center text-sm">
      ¿Recordaste tu contraseña?{' '}
        <Link href="/signin" className="text-primary duration-200 hover:opacity-70">
          Ingresar ahora
        </Link>
      </p>
    </div>
  );
}
