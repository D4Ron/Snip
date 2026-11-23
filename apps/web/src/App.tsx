import { fr } from '@/i18n/fr';

export function App() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-bold">{fr.app.name}</h1>
      <p className="mt-2 text-base">{fr.app.tagline}</p>
    </main>
  );
}
