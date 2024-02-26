import type { Metadata } from 'next';

import { UserSecurityActivityDataTable } from './user-security-activity-data-table';

export const metadata: Metadata = {
  title: 'Security activity',
};

export default function SettingsSecurityActivityPage() {
  return (
    <div>
      <h3 className="text-2xl font-semibold">Actividad de seguridad</h3>

      <p className="text-muted-foreground mt-2 text-sm">
      Vea toda la actividad de seguridad reciente relacionada con su cuenta.
      </p>

      <hr className="my-4" />

      <UserSecurityActivityDataTable />
    </div>
  );
}
