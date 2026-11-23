import { describe, expect, it } from 'vitest';
import { formatDate, formatFcfa } from './format';

const nb = (s: string) => s.replace(/ /g, ' ');

describe('formatFcfa', () => {
  it('groups thousands with a space', () => {
    expect(formatFcfa(27000)).toBe(nb('27 000 FCFA'));
    expect(formatFcfa(120000)).toBe(nb('120 000 FCFA'));
    expect(formatFcfa(2500)).toBe(nb('2 500 FCFA'));
    expect(formatFcfa(0)).toBe(nb('0 FCFA'));
  });
  it('accepts bigint', () => {
    expect(formatFcfa(1234567n)).toBe(nb('1 234 567 FCFA'));
  });
  it('rejects non-integers', () => {
    expect(() => formatFcfa(10.5)).toThrow(RangeError);
  });
});

describe('formatDate', () => {
  it('formats in French', () => {
    expect(formatDate('2027-05-17T12:00:00Z')).toBe('17 mai 2027');
  });
});
