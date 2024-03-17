import { Bird, CheckCircle2 } from 'lucide-react';
import { match } from 'ts-pattern';

import { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';

export type EmptyDocumentProps = { status: ExtendedDocumentStatus };

export const EmptyDocumentState = ({ status }: EmptyDocumentProps) => {
  const {
    title,
    message,
    icon: Icon,
  } = match(status)
    .with(ExtendedDocumentStatus.COMPLETED, () => ({
      title: 'Nada que hacer',
      message:
        'Aún no hay documentos completos. Los documentos que haya creado o recibido aparecerán aquí una vez completados.',
      icon: CheckCircle2,
    }))
    .with(ExtendedDocumentStatus.DRAFT, () => ({
      title: 'No hay borradores activos',
      message:
        'No hay borradores activos en este momento. Puede cargar un documento para comenzar a redactar.',
      icon: CheckCircle2,
    }))
    .with(ExtendedDocumentStatus.ALL, () => ({
      title: "Todo esta vacío",
      message:
        'Aún no ha creado ni recibido ningún documento. Para crear un documento, cargue uno.',
      icon: Bird,
    }))
    .otherwise(() => ({
      title: 'Nada que hacer',
      message:
        'Todos los documentos han sido procesados. Cualquier documento nuevo que se envíe o reciba se mostrará aquí.',
      icon: CheckCircle2,
    }));

  return (
    <div className="text-muted-foreground/60 flex h-60 flex-col items-center justify-center gap-y-4">
      <Icon className="h-12 w-12" strokeWidth={1.5} />

      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 max-w-[60ch]">{message}</p>
      </div>
    </div>
  );
};
