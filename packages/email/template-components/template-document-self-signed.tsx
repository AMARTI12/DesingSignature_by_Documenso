import { env } from 'next-runtime-env';

import { Button, Column, Img, Link, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentSelfSignedProps {
  documentName: string;
  assetBaseUrl: string;
}

export const TemplateDocumentSelfSigned = ({
  documentName,
  assetBaseUrl,
}: TemplateDocumentSelfSignedProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  const signInUrl = `${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signin`;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Section>
          <Column align="center">
            <Text className="text-base font-semibold text-[#7AC455]">
              <Img
                src={getAssetUrl('/static/completed.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              Completado
            </Text>
          </Column>
        </Section>

        <Text className="text-primary mb-0 mt-6 text-center text-lg font-semibold">
          Usted ha firmado el documento “{documentName}”
        </Text>

        <Text className="mx-auto mb-6 mt-1 max-w-[80%] text-center text-base text-slate-400">
          Ingrese Aquí{' '}
          <Link
            href={signInUrl}
            target="_blank"
            className="text-documenso-700 hover:text-documenso-600 whitespace-nowrap"
          >
          </Link>{' '}
          para acceder a sus documentos firmados en cualquier momento.
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            href={signInUrl}
            className="mr-4 rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
          >
            <Img
              src={getAssetUrl('/static/user-plus.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            Ingresar
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentSelfSigned;
