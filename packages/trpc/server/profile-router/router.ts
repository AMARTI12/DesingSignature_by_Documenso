import { TRPCError } from '@trpc/server';

import { findUserSecurityAuditLogs } from '@documenso/lib/server-only/user/find-user-security-audit-logs';
import { forgotPassword } from '@documenso/lib/server-only/user/forgot-password';
import { getUserById } from '@documenso/lib/server-only/user/get-user-by-id';
import { resetPassword } from '@documenso/lib/server-only/user/reset-password';
import { sendConfirmationToken } from '@documenso/lib/server-only/user/send-confirmation-token';
import { updatePassword } from '@documenso/lib/server-only/user/update-password';
import { updateProfile } from '@documenso/lib/server-only/user/update-profile';
import { extractNextApiRequestMetadata } from '@documenso/lib/universal/extract-request-metadata';

import { adminProcedure, authenticatedProcedure, procedure, router } from '../trpc';
import {
  ZConfirmEmailMutationSchema,
  ZFindUserSecurityAuditLogsSchema,
  ZForgotPasswordFormSchema,
  ZResetPasswordFormSchema,
  ZRetrieveUserByIdQuerySchema,
  ZUpdatePasswordMutationSchema,
  ZUpdateProfileMutationSchema,
} from './schema';

export const profileRouter = router({
  findUserSecurityAuditLogs: authenticatedProcedure
    .input(ZFindUserSecurityAuditLogsSchema)
    .query(async ({ input, ctx }) => {
      try {
        return await findUserSecurityAuditLogs({
          userId: ctx.user.id,
          ...input,
        });
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No pudimos encontrar registros de auditoría de seguridad de los usuarios. Inténtalo de nuevo.',
        });
      }
    }),

  getUser: adminProcedure.input(ZRetrieveUserByIdQuerySchema).query(async ({ input }) => {
    try {
      const { id } = input;

      return await getUserById({ id });
    } catch (err) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No pudimos recuperar la cuenta especificada. Inténtalo de nuevo.',
      });
    }
  }),

  updateProfile: authenticatedProcedure
    .input(ZUpdateProfileMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, signature } = input;

        return await updateProfile({
          userId: ctx.user.id,
          name,
          signature,
          requestMetadata: extractNextApiRequestMetadata(ctx.req),
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'No pudimos actualizar su perfil. Revise la información que proporcionó y vuelva a intentarlo.',
        });
      }
    }),

  updatePassword: authenticatedProcedure
    .input(ZUpdatePasswordMutationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { password, currentPassword } = input;

        return await updatePassword({
          userId: ctx.user.id,
          password,
          currentPassword,
          requestMetadata: extractNextApiRequestMetadata(ctx.req),
        });
      } catch (err) {
        let message =
          'No pudimos actualizar su perfil. Revise la información que proporcionó y vuelva a intentarlo.';

        if (err instanceof Error) {
          message = err.message;
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message,
        });
      }
    }),

  forgotPassword: procedure.input(ZForgotPasswordFormSchema).mutation(async ({ input }) => {
    try {
      const { email } = input;

      return await forgotPassword({
        email,
      });
    } catch (err) {
      console.error(err);
    }
  }),

  resetPassword: procedure.input(ZResetPasswordFormSchema).mutation(async ({ input, ctx }) => {
    try {
      const { password, token } = input;

      return await resetPassword({
        token,
        password,
        requestMetadata: extractNextApiRequestMetadata(ctx.req),
      });
    } catch (err) {
      let message = 'No pudimos restablecer su contraseña. Inténtalo de nuevo.';

      if (err instanceof Error) {
        message = err.message;
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message,
      });
    }
  }),

  sendConfirmationEmail: procedure
    .input(ZConfirmEmailMutationSchema)
    .mutation(async ({ input }) => {
      try {
        const { email } = input;

        return await sendConfirmationToken({ email });
      } catch (err) {
        let message = 'No pudimos enviar un correo electrónico de confirmación. Inténtalo de nuevo.';

        if (err instanceof Error) {
          message = err.message;
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message,
        });
      }
    }),
});
