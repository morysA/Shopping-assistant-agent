import SettingsClient from '@/components/settings-client';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your AI negotiation preferences and strategies.
        </p>
      </div>
      <SettingsClient />
    </div>
  );
}
