// src/utils/cardUtils.ts

export function validateLuhn(number: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function generateLuhnNumber(prefix: string, length: number): string {
  let number = prefix.replace(/\D/g, '');
  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10);
  }
  for (let check = 0; check < 10; check++) {
    const candidate = number + check;
    if (validateLuhn(candidate)) return candidate;
  }
  return number + '0';
}

export function generateCards(
  bin: string,
  month: string,
  year: string,
  cvvMode: 'random' | 'fixed',
  cvvFixed: string,
  quantity: number
) {
  const cards = [];
  for (let i = 0; i < quantity; i++) {
    const number = generateLuhnNumber(bin, 16);
    const cvv = cvvMode === 'random'
      ? Math.floor(100 + Math.random() * 900).toString()
      : cvvFixed;
    const holder = 'CARD HOLDER';
    cards.push({ number, month, year, cvv, holder });
  }
  return cards;
}