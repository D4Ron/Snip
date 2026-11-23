// Shared formatters. Never format amounts or dates by hand in a screen.

const NBSP = ' ';

/** Integer FCFA amount → "27 000 FCFA". Amounts are always integers (bigint in the DB). */
export function formatFcfa(amount: number | bigint): string {
  const value = typeof amount === 'bigint' ? amount : BigInt(Math.trunc(amount));
  if (typeof amount === 'number' && !Number.isInteger(amount)) {
    throw new RangeError('FCFA amounts must be integers');
  }
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${negative ? '−' : ''}${grouped}${NBSP}FCFA`;
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Lome',
});

/** Date → "17 mai 2027" (Lomé time). */
export function formatDate(date: Date | string): string {
  return dateFormatter.format(typeof date === 'string' ? new Date(date) : date);
}
