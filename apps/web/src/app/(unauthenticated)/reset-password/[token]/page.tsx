import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getResetTokenValidity } from '@documenso/lib/server-only/user/get-reset-token-validity';

import { ResetPasswordForm } from '~/components/forms/reset-password';

type ResetPasswordPageProps = {
  params: {
    token: string;
  };
};

export default async function ResetPasswordPage({ params: { token } }: ResetPasswordPageProps) {
  const isValid = await getResetTokenValidity({ token });

  if (!isValid) {
    redirect('/reset-password');
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl font-semibold">Resetear Contraseña</h1>

      <p className="text-muted-foreground mt-2 text-sm">Por favor elige tu nueva contraseña </p>

      <ResetPasswordForm token={token} className="mt-4" />

      <p className="text-muted-foreground mt-6 text-center text-sm">
      No tienes una cuenta?{' '}
        <Link href="/signup" className="text-primary duration-200 hover:opacity-70">
          Registrarse
        </Link>
      </p>
    </div>
  );
}
