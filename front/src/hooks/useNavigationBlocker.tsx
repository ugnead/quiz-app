import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigationBlocker = (shouldBlock: boolean, categoryId: string | null, message: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  const blockNavigation = useCallback((event: PopStateEvent) => {
    if (shouldBlock) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setIsBlocked(true);
      const nextPath = categoryId ? `/subcategories/${categoryId}` : '';
      setNextLocation(nextPath);
      window.history.pushState({ modalOpened: true }, "");
    }
  }, [shouldBlock, categoryId]);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (shouldBlock) {
      event.preventDefault();
      event.returnValue = '';
    }
  }, [shouldBlock]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', blockNavigation);

    window.history.pushState({ modalOpened: false }, "");

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', blockNavigation);
    };
  }, [blockNavigation, handleBeforeUnload, shouldBlock]);

  const confirmNavigation = () => {
    setIsBlocked(false);
    if (nextLocation) {
      navigate(nextLocation);
    }
  };

  const cancelNavigation = () => {
    setIsBlocked(false);
    setNextLocation(null);
    window.history.pushState(null, "", location.pathname);
  };

  return { isBlocked, confirmNavigation, cancelNavigation, message };
};
