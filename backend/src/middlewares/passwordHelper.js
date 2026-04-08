import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { env } from '../config/env.js';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijkmnopqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '@#$%&*!?';

const pickRandomChar = (source) => {
  const index = crypto.randomInt(0, source.length);
  return source[index];
};

const shuffleChars = (chars) => {
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(0, i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
};

export const generateRandomPassword = (length = 10) => {
  if (length < 4) {
    throw new Error('Password length must be at least 4 characters');
  }

  const requiredChars = [
    pickRandomChar(UPPERCASE),
    pickRandomChar(LOWERCASE),
    pickRandomChar(DIGITS),
    pickRandomChar(SYMBOLS)
  ];

  const allChars = `${UPPERCASE}${LOWERCASE}${DIGITS}${SYMBOLS}`;
  const passwordChars = [...requiredChars];

  for (let i = requiredChars.length; i < length; i += 1) {
    passwordChars.push(pickRandomChar(allChars));
  }

  return shuffleChars(passwordChars).join('');
};

export const hashPassword = async (plainPassword) => {
  const saltRounds = env.security?.bcryptSaltRounds || 12;
  return bcrypt.hash(plainPassword, saltRounds);
};
