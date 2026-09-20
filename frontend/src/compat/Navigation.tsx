'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext<{
  pathname: string;
  push: (href: string) => void;
  replace: (href: string) => void;
} | null>(null);

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    return {
      push: (href: string) => {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
      replace: (href: string) => {
        window.history.replaceState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
      back: () => window.history.back(),
      prefetch: () => {},
    };
  }
  return {
    push: ctx.push,
    replace: ctx.replace,
    back: () => window.history.back(),
    prefetch: () => {},
  };
}

export function usePathname() {
  const ctx = useContext(RouterContext);
  return ctx ? ctx.pathname : window.location.pathname;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const push = (href: string) => {
    window.history.pushState(null, '', href);
    setPathname(href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const replace = (href: string) => {
    window.history.replaceState(null, '', href);
    setPathname(href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <RouterContext.Provider value={{ pathname, push, replace }}>
      {children}
    </RouterContext.Provider>
  );
}
