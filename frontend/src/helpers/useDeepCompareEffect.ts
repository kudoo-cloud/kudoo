import isEqual from 'lodash/isEqual';
import { useEffect, useRef } from 'react';

function deepCompareEquals(a, b) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default (callback, dependencies) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};
