import { Link, Section, Text } from '../components';

export type TemplateFooterProps = {
  isDocument?: boolean;
};

export const TemplateFooter = ({ isDocument = true }: TemplateFooterProps) => {
  return (
    <Section>
      {isDocument && (
        <Text className="my-4 text-base text-slate-400">
          Este documento fue enviado utilizando{' '}
          <Link className="text-[#7AC455]" href="https://www.excellentiam.co/">
            Design Signature.
          </Link>
        </Text>
      )}

      <Text className="my-8 text-sm text-slate-400">
        Excellentiam
        <br />
        Designed By FAMM
      </Text>
    </Section>
  );
};

export default TemplateFooter;
