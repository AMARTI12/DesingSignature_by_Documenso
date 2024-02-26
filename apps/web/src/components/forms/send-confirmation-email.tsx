'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const ZSendConfirmationEmailFormSchema = z.object({
  email: z.string().email().min(1),
});

export type TSendConfirmationEmailFormSchema = z.infer<typeof ZSendConfirmationEmailFormSchema>;

export type SendConfirmationEmailFormProps = {
  className?: string;
};

export const SendConfirmationEmailForm = ({ className }: SendConfirmationEmailFormProps) => {
  const { toast } = useToast();

  const form = useForm<TSendConfirmationEmailFormSchema>({
    values: {
      email: '',
    },
    resolver: zodResolver(ZSendConfirmationEmailFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: sendConfirmationEmail } = trpc.profile.sendConfirmationEmail.useMutation();

  const onFormSubmit = async ({ email }: TSendConfirmationEmailFormSchema) => {
    try {
      await sendConfirmationEmail({ email });

      toast({
        title: 'Correo de Confirmación Mandado',
        description:
          'Se ha enviado un correo electrónico de confirmación y debería llegar a su bandeja de entrada en breve.',
        duration: 5000,
      });

      form.reset();
    } catch (err) {
      toast({
        title: 'Se produjo un error al enviar su correo electrónico de confirmación.',
        description: 'Inténtelo de nuevo y asegúrese de ingresar la dirección de correo electrónico correcta.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('mt-6 flex w-full flex-col gap-y-4', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormMessage />

          <Button size="lg" type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Enviar Email de Confirmación
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
