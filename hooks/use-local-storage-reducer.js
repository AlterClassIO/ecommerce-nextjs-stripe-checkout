import { useEffect, useReducer, useRef } from 'react';
import { isClient } from '@/lib/utils';

const useLocalStorageReducer = (key = '', reducer, initialValue = null) => {
  const [state, dispatch] = useReducer(reducer, initialValue, () => {
    try {
      if (isClient) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    // Update local storage with new state
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Unable to store new value for ${key} in localStorage.`);
    }
  }, [state]);

  return [state, dispatch];
};

export default useLocalStorageReducer;
