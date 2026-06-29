import { createContext, type RefObject, useContext } from 'react';
import type { EditorOptions } from '../types';

export const EditorOptionsContext = createContext<EditorOptions | undefined>(
  undefined,
);

export function useEditorOptions(): EditorOptions | undefined {
  return useContext(EditorOptionsContext);
}

export const PortalContainerContext = createContext<
  RefObject<HTMLElement | null> | undefined
>(undefined);

export function usePortalContainer():
  | RefObject<HTMLElement | null>
  | undefined {
  return useContext(PortalContainerContext);
}
