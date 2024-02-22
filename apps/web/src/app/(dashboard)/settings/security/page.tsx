import type { Metadata } from 'next';
import Link from 'next/link';

import { IDENTITY_PROVIDER_NAME } from '@documenso/lib/constants/auth';
import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';
import { Alert, AlertDescription, AlertTitle } from '@documenso/ui/primitives/alert';
import { Button } from '@documenso/ui/primitives/button';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';
import { AuthenticatorApp } from '~/components/forms/2fa/authenticator-app';
import { RecoveryCodes } from '~/components/forms/2fa/recovery-codes';
import { PasswordForm } from '~/components/forms/password';

export const metadata: Metadata = {
  title: 'Security',
};

export default async function SecuritySettingsPage() {
  const { user } = await getRequiredServerComponentSession();

  return (
    <div>
      <SettingsHeader
        title="Seguridad"
        subtitle="Aquí puede administrar su contraseña y configuración de seguridad."
      />

      {user.identityProvider === 'DOCUMENSO' ? (
        <div>
          <PasswordForm user={user} />

          <hr className="border-border/50 mt-6" />

          <Alert
            className="mt-6 flex flex-col justify-between p-6 sm:flex-row sm:items-center"
            variant="neutral"
          >
            <div className="mb-4 sm:mb-0">
              <AlertTitle>Autenticación de dos factores</AlertTitle>

              <AlertDescription className="mr-4">
              Cree contraseñas de un solo uso que sirvan como método de autenticación secundario
               para confirmar su identidad cuando se le solicite durante el proceso de inicio de sesión.
              </AlertDescription>
            </div>

            <AuthenticatorApp isTwoFactorEnabled={user.twoFactorEnabled} />
          </Alert>

          {user.twoFactorEnabled && (
            <Alert
              className="mt-6 flex flex-col justify-between p-6 sm:flex-row sm:items-center"
              variant="neutral"
            >
              <div className="mb-4 sm:mb-0">
                <AlertTitle>Códigos de recuperación</AlertTitle>

                <AlertDescription className="mr-4">
                Los códigos de recuperación de autenticación de dos factores se utilizan para acceder
                 a su cuenta en caso de que pierda el acceso a su aplicación de autenticación.
                </AlertDescription>
              </div>

              <RecoveryCodes isTwoFactorEnabled={user.twoFactorEnabled} />
            </Alert>
          )}
        </div>
      ) : (
        <Alert className="p-6" variant="neutral">
          <AlertTitle>
          Su cuenta es administrada por {IDENTITY_PROVIDER_NAME[user.identityProvider]}
          </AlertTitle>

          <AlertDescription>
          Para actualizar su contraseña, habilitar la autenticación de dos factores y administrar otras configuraciones de seguridad, 
          vaya a las configuraciones de seguridad de {IDENTITY_PROVIDER_NAME[user.identityProvider]}
          </AlertDescription>
        </Alert>
      )}

      <Alert
        className="mt-6 flex flex-col justify-between p-6 sm:flex-row sm:items-center"
        variant="neutral"
      >
        <div className="mb-4 mr-4 sm:mb-0">
          <AlertTitle>Actividad reciente</AlertTitle>

          <AlertDescription className="mr-2">
          Vea toda la actividad de seguridad reciente relacionada con su cuenta.
          </AlertDescription>
        </div>

        <Button asChild>
          <Link href="/settings/security/activity">Ver actividad</Link>
        </Button>
      </Alert>
    </div>
  );
}
