import { RefObject, useEffect } from 'react';

type Handler = () => void;

export function useClickOutside<T extends HTMLElement | null>(ref: RefObject<T>, handler: Handler) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}
