import { RefObject, useState } from 'react';

import { useEventListener } from './useEventListener';

/* Hook para cambiar el contenido del HTML según se hace hover encima de el
 para usarlo hay que asignar la referencia al elemento
 y puede usarse como useHover ? '' : ''
 funciona con cualquier tipo de elemento */
function useHover<T extends HTMLElement = HTMLElement>(elementRef: RefObject<T>): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}

export { useHover };
