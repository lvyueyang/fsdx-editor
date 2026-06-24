export { ACTIVITIES } from './activities';
export { ANIMALS } from './animals';
export { FOOD } from './food';
export { GESTURES } from './gestures';
export { OBJECTS } from './objects';
export { SMILEYS } from './smileys';
export { SYMBOLS } from './symbols';
export { TRAVEL } from './travel';
export type { EmojiCategory } from './types';

import { ACTIVITIES } from './activities';
import { ANIMALS } from './animals';
import { FOOD } from './food';
import { GESTURES } from './gestures';
import { OBJECTS } from './objects';
import { SMILEYS } from './smileys';
import { SYMBOLS } from './symbols';
import { TRAVEL } from './travel';
import type { EmojiCategory } from './types';

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  SMILEYS,
  GESTURES,
  ANIMALS,
  FOOD,
  ACTIVITIES,
  TRAVEL,
  OBJECTS,
  SYMBOLS,
];
