import { createElement } from 'react';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { ForgotPasswordTemplate } from '@documenso/email/templates/forgot-password';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';

export interface SendForgotPasswordOptions {
  userId: number;
}

export const sendForgotPassword = async ({ userId }: SendForgotPasswordOptions) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      PasswordResetToken: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const token = user.PasswordResetToken[0].token;
  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
  const resetPasswordLink = `${NEXT_PUBLIC_WEBAPP_URL()}/reset-password/${token}`;

  const template = createElement(ForgotPasswordTemplate, {
    assetBaseUrl,
    resetPasswordLink,
  });

  return await mailer.sendMail({
    to: {
      address: user.email,
      name: user.name || '',
    },
    from: {
      name: process.env.NEXT_PRIVATE_SMTP_FROM_NAME || 'Documenso',
      address: process.env.NEXT_PRIVATE_SMTP_FROM_ADDRESS || 'noreply@documenso.com',
    },
    subject: '¿Has olvidado tu contraseña?',
    html: render(template),
    text: render(template, { plainText: true }),
  });
};
