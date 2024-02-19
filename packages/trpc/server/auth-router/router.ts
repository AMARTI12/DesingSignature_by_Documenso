import { TRPCError } from '@trpc/server';
import { env } from 'next-runtime-env';

import { ErrorCode } from '@documenso/lib/next-auth/error-codes';
import { compareSync } from '@documenso/lib/server-only/auth/hash';
import { createUser } from '@documenso/lib/server-only/user/create-user';
import { sendConfirmationToken } from '@documenso/lib/server-only/user/send-confirmation-token';

import { authenticatedProcedure, procedure, router } from '../trpc';
import { ZSignUpMutationSchema, ZVerifyPasswordMutationSchema } from './schema';

const NEXT_PUBLIC_DISABLE_SIGNUP = () => env('NEXT_PUBLIC_DISABLE_SIGNUP');

export const authRouter = router({
  signup: procedure.input(ZSignUpMutationSchema).mutation(async ({ input }) => {
    try {
      if (NEXT_PUBLIC_DISABLE_SIGNUP() === 'true') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Los registros están deshabilitados.',
        });
      }

      const { name, email, password, signature } = input;

      const user = await createUser({ name, email, password, signature });

      await sendConfirmationToken({ email: user.email });

      return user;
    } catch (err) {
      let message =
        'No pudimos crear su cuenta. Revise la información que proporcionó y vuelva a intentarlo.';

      if (err instanceof Error && err.message === 'El usuario ya existe') {
        message = 'El usuario con este correo electrónico ya existe. Por favor utilice una dirección de correo electrónico diferente.';
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message,
      });
    }
  }),

  verifyPassword: authenticatedProcedure
    .input(ZVerifyPasswordMutationSchema)
    .mutation(({ ctx, input }) => {
      const user = ctx.user;

      const { password } = input;

      if (!user.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ErrorCode.INCORRECT_PASSWORD,
        });
      }

      const valid = compareSync(password, user.password);

      return valid;
    }),
});
