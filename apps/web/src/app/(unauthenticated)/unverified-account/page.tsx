import { Mails } from 'lucide-react';

import { SendConfirmationEmailForm } from '~/components/forms/send-confirmation-email';

export default function UnverifiedAccount() {
  return (
    <div className="flex w-full items-start">
      <div className="mr-4 mt-1 hidden md:block">
        <Mails className="text-primary h-10 w-10" strokeWidth={2} />
      </div>
      <div className="">
        <h2 className="text-2xl font-bold md:text-4xl">Confirmar correo electrónico</h2>

        <p className="text-muted-foreground mt-4">
          Para obtener acceso a su cuenta, confirme su dirección de correo electrónico haciendo clic
          en el enlace de confirmación desde su bandeja de entrada.
        </p>

        <p className="text-muted-foreground mt-4">
          Si no encuentra el enlace de confirmación en su bandeja de entrada, puede solicitar uno
          nuevo a continuación.
        </p>

        <SendConfirmationEmailForm />
      </div>
    </div>
  );
}
