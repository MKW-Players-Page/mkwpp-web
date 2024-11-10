import { DependencyList, useEffect, useState } from "react";
import { ResponseError } from "../api/generated";

export interface ApiState<T> {
  isLoading: boolean;
  data?: T;
  error?: ResponseError;
  timestamp: Date;
}

export const useApi = <T>(
  apiCallback: () => Promise<T>,
  dependencies: DependencyList = [],
  timestamp: Date = new Date(),
) => {
  const initialState = { isLoading: true, timestamp };
  const [state, setState] = useState<ApiState<T>>(initialState);

  useEffect(() => {
    apiCallback()
      .then((data: T) => {
        setState({ isLoading: false, data, timestamp });
      })
      .catch((error: ResponseError) => {
        setState({ isLoading: false, error, timestamp });
      });
    // React complains about apiCallback missing from dependency array, but it isn't needed.
    // In fact, it causes the effect hook to be triggered in an endless loop. We don't want that.
    // eslint-disable-next-line
  }, dependencies);

  return state;
};

export const useApiArray = <T, R>(
  apiCallback: (params: R) => Promise<T>,
  callCount: number,
  paramArray: R[],
  dependencies: DependencyList = [],
  timestamp: Date = new Date(),
) => {
  const initialState = Array.from({ length: callCount }, (_, __) => ({
    isLoading: true,
    timestamp,
  }));
  const [state, setState] = useState<Array<ApiState<T>>>(initialState);

  useEffect(() => {
    for (let i = 0; i < callCount; ++i) {
      if (i >= paramArray.length) {
        return;
      }

      setState((prev) => [
        ...prev.slice(0, i),
        { ...prev[i], isLoading: true },
        ...prev.slice(i + 1),
      ]);

      apiCallback(paramArray[i])
        .then((data: T) => {
          setState((prev) => [
            ...prev.slice(0, i),
            { isLoading: false, data, timestamp },
            ...prev.slice(i + 1),
          ]);
        })
        .catch((error: ResponseError) => {
          setState((prev) => [
            ...prev.slice(0, i),
            { isLoading: false, error, timestamp },
            ...prev.slice(i + 1),
          ]);
        });
    }
    // eslint-disable-next-line
  }, dependencies);

  return state;
};
