import { useState } from 'react';

import { Loader } from 'lucide-react';

import type { ButtonProps } from '../button';
import { Button } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

export type SendDocumentActionDialogProps = ButtonProps & {
  loading?: boolean;
};

export const SendDocumentActionDialog = ({
  loading,
  className,
  ...props
}: SendDocumentActionDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className={className}>
          {loading && <Loader className="text-documenso mr-2 h-5 w-5 animate-spin" />}
          Enviar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Enviar Documento</DialogTitle>
          <DialogDescription className="text-center text-base">
          Está a punto de enviar este documento a los destinatarios. Estás seguro de que quieres continuar?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex items-center gap-x-4">
          <Button
            className="dark:bg-muted dark:hover:bg-muted/80 dark:focus-visible:ring-muted/80 flex-1 border-none bg-black/5 hover:bg-black/10 focus-visible:ring-black/10"
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          {/* We would use DialogAction here but it interrupts the submit action */}
          <Button className={className} {...props}>
            {loading && <Loader className="mr-2 h-5 w-5 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
