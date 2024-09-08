import { DependencyList, useEffect, useState } from 'react';
import { ResponseError } from '../api/generated';

export interface ApiState<T> {
  isLoading: boolean;
  data?: T;
  error?: ResponseError;
};

export const useApi = <T,>(apiCallback: () => Promise<T>, dependencies: DependencyList = []) => {
  const initialState = { isLoading: true };
  const [state, setState] = useState<ApiState<T>>(initialState);

  useEffect(() => {
    apiCallback().then((data: T) => {
      setState({ isLoading: false, data });
    }).catch((error: ResponseError) => {
      setState({ isLoading: false, error });
    });
    // React complains about apiCallback missing from dependency array, but it isn't needed.
    // In fact, it causes the effect hook to be triggered in an endless loop. We don't want that.
    // eslint-disable-next-line
  }, dependencies);

  return state;
};
