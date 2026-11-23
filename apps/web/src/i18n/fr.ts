// Every UI string lives here. French only, plain words.
export const fr = {
  app: {
    name: 'Snip',
    tagline: 'Gestion d’atelier de couture',
  },
  common: {
    loading: 'Chargement…',
    networkError: 'Pas de connexion. Ce que vous avez saisi est gardé.',
    retry: 'Réessayer',
  },
} as const;

export type Fr = typeof fr;
