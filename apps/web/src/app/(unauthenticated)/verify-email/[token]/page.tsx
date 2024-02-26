import Link from 'next/link';

import { AlertTriangle, CheckCircle2, XCircle, XOctagon } from 'lucide-react';

import { verifyEmail } from '@documenso/lib/server-only/user/verify-email';
import { Button } from '@documenso/ui/primitives/button';

export type PageProps = {
  params: {
    token: string;
  };
};

export default async function VerifyEmailPage({ params: { token } }: PageProps) {
  if (!token) {
    return (
      <div className="w-full">
        <div className="mb-4 text-red-300">
          <XOctagon />
        </div>

        <h2 className="text-4xl font-semibold">No se proporcionó ningún token</h2>
        <p className="text-muted-foreground mt-2 text-base">
        Parece que no se proporcionó ningún token. Por favor revisa tu correo electrónico y vuelve a intentarlo.
        </p>
      </div>
    );
  }

  const verified = await verifyEmail({ token });

  if (verified === null) {
    return (
      <div className="flex w-full items-start">
        <div className="mr-4 mt-1 hidden md:block">
          <AlertTriangle className="h-10 w-10 text-yellow-500" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-bold md:text-4xl">Algo salió mal</h2>

          <p className="text-muted-foreground mt-4">
          No pudimos verificar su correo electrónico. Si su correo electrónico aún no está verificado, inténtelo de nuevo.
          </p>

          <Button className="mt-4" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex w-full items-start">
        <div className="mr-4 mt-1 hidden md:block">
          <XCircle className="text-destructive h-10 w-10" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-bold md:text-4xl">¡Tu token ha caducado!</h2>

          <p className="text-muted-foreground mt-4">
          Parece que el token proporcionado ha caducado. Acabamos de enviarte otro token, revisa tu correo electrónico e inténtalo nuevamente.
          </p>

          <Button className="mt-4" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start">
      <div className="mr-4 mt-1 hidden md:block">
        <CheckCircle2 className="h-10 w-10 text-green-500" strokeWidth={2} />
      </div>

      <div>
        <h2 className="text-2xl font-bold md:text-4xl">Email Confirmado!</h2>

        <p className="text-muted-foreground mt-4">
        ¡Tu correo electrónico ha sido confirmado exitosamente! Ahora puede utilizar todas las funciones de Design Signature.
        </p>

        <Button className="mt-4" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
