'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppError } from '@documenso/lib/errors/app-error';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import type { Toast } from '@documenso/ui/primitives/use-toast';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type DeleteTeamDialogProps = {
  teamId: number;
  teamName: string;
  trigger?: React.ReactNode;
};

export const DeleteTeamDialog = ({ trigger, teamId, teamName }: DeleteTeamDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const deleteMessage = `delete ${teamName}`;

  const ZDeleteTeamFormSchema = z.object({
    teamName: z.literal(deleteMessage, {
      errorMap: () => ({ message: `debes ingresar '${deleteMessage}' para proceder` }),
    }),
  });

  const form = useForm({
    resolver: zodResolver(ZDeleteTeamFormSchema),
    defaultValues: {
      teamName: '',
    },
  });

  const { mutateAsync: deleteTeam } = trpc.team.deleteTeam.useMutation();

  const onFormSubmit = async () => {
    try {
      await deleteTeam({ teamId });

      toast({
        title: 'Correcto',
        description: 'Su equipo ha sido eliminado exitosamente.',
        duration: 5000,
      });

      setOpen(false);

      router.push('/settings/teams');
    } catch (err) {
      const error = AppError.parseError(err);

      let toastError: Toast = {
        title: 'Un error desconocido ocurrió',
        variant: 'destructive',
        duration: 10000,
        description:
          'Encontramos un error desconocido al intentar eliminar este equipo. Por favor, inténtelo de nuevo más tarde.',
      };

      if (error.code === 'resource_missing') {
        toastError = {
          title: 'No se puede eliminar el equipo',
          variant: 'destructive',
          duration: 15000,
          description:
            'Algo salió mal al actualizar la suscripción de facturación del equipo; comuníquese con el soporte.',
        };
      }

      toast(toastError);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(value) => !form.formState.isSubmitting && setOpen(value)}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="destructive">Eliminar equipo</Button>}
      </DialogTrigger>

      <DialogContent position="center">
        <DialogHeader>
          <DialogTitle>Eliminar equipo</DialogTitle>

          <DialogDescription className="mt-4">
          ¿Está seguro? Esto es irreversible.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)}>
            <fieldset
              className="flex h-full flex-col space-y-4"
              disabled={form.formState.isSubmitting}
            >
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                    Confirmar escribiendo <span className="text-destructive">{deleteMessage}</span>
                    </FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>

                <Button type="submit" variant="destructive" loading={form.formState.isSubmitting}>
                  Eliminar
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
