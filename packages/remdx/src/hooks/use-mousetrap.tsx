import Mousetrap, { ExtendedKeyboardEvent } from 'mousetrap';
import { useEffect } from 'react';

export default function useMousetrap(
  keybinds: Record<string, (e?: ExtendedKeyboardEvent) => void>,
): void {
  useEffect(() => {
    for (const combo in keybinds) {
      const callback = keybinds[combo];
      if (typeof callback !== 'function') {
        throw new TypeError(
          `Expected type 'function' in useMousetrap for combo '${combo}', but got ${typeof callback}`,
        );
      }
      Mousetrap.bind(combo, callback);
    }
    return () => {
      for (const combo in keybinds) {
        Mousetrap.unbind(combo);
      }
    };
  }, [keybinds]);
}
