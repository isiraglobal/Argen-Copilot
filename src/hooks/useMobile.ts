import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();

    const listener = () => checkMobile();
    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [breakpoint]);

  return isMobile;
}
