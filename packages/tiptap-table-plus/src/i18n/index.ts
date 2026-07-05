export type { TablePlusTranslations } from './types';

import { enUS } from './en-US';
import type { TablePlusTranslations } from './types';
import { zhCN } from './zh-CN';

export { enUS, zhCN };

/**
 * 根据 locale 键获取内置翻译
 */
export function getBuiltinTranslations(
  locale: 'zh-CN' | 'en-US',
): TablePlusTranslations {
  return locale === 'en-US' ? enUS : zhCN;
}
