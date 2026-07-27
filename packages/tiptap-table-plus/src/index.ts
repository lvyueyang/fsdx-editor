import './styles/table.scss';

export { enUS, getBuiltinTranslations, zhCN } from './i18n';
export type { TablePlusTranslations } from './i18n/types';
export type {
  MenuItem,
  MenuList,
  MenuSeparator,
  SubMenuItem,
} from './menu/items';
export type {
  TablePlusLocale,
  TablePlusStorage,
  TablePlusTheme,
} from './storage';
export type { TablePlusOptions } from './table-plus';
export {
  getTablePlusLocale,
  getTablePlusTheme,
  getTablePlusTranslations,
  TablePlus,
} from './table-plus';
