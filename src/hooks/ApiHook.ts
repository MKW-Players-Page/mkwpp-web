import { DependencyList, useEffect, useState } from "react";
import { ResponseError } from "../api/generated";

export interface ApiState<T> {
  isLoading: boolean;
  data?: T;
  error?: ResponseError;
}

/** Allows for stalling requests if a variable is an undesired value */
export interface WaitDependencyList {
  variable: any;
  defaultValue: any;
}

export const useApi = <T>(
  apiCallback: () => Promise<T>,
  dependencies: DependencyList = [],
  requestType = "",
  waitFor: WaitDependencyList[] = [],
  requestTypeWait: boolean = true,
) => {
  const initialState = { isLoading: true };
  const [state, setState] = useState<ApiState<T>>(initialState);
  const setPromises = useState<Array<[Promise<any>, number, string]>>([])[1];
  // const [promises, setPromises] = useState<Array<[Promise<any>, number, string]>>([]);

  useEffect(() => {
    setState({ isLoading: true });
    for (const { variable, defaultValue } of waitFor) if (variable === defaultValue) return;

    const promiseDate = +new Date();
    setPromises((prev) => [
      ...prev,
      [
        apiCallback()
          .finally(async () => {
            // Wait for any previous request of the same kind
            if (requestTypeWait) {
              const previousRequest = prev.reverse().find((r) => r[2] === requestType);
              if (previousRequest !== undefined) await previousRequest[0];
            }

            // Remove this one
            setPromises((prev) =>
              prev.filter((promiseWithDate) => promiseWithDate[1] !== promiseDate),
            );
          })
          // Set data or error accordingly
          .then(
            async (data: T) => {
              setState({ isLoading: false, data });
            },
            async (error: ResponseError) => {
              setState({ isLoading: false, error });
            },
          ),
        promiseDate,
        requestType,
      ],
    ]);

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
  requestType = "",
  waitFor: WaitDependencyList[] = [],
  requestTypeWait: boolean = true,
) => {
  const initialState = Array.from({ length: callCount }, (_, __) => ({
    isLoading: true,
  }));
  const [state, setState] = useState<Array<ApiState<T>>>(initialState);
  const setPromises = useState<Array<[Promise<any>, number, string]>>([])[1];

  useEffect(() => {
    for (const { variable, defaultValue } of waitFor) if (variable === defaultValue) return;
    for (let i = 0; i < callCount; ++i) {
      if (i >= paramArray.length) {
        return;
      }

      setState((prev) => [
        ...prev.slice(0, i),
        { ...prev[i], isLoading: true },
        ...prev.slice(i + 1),
      ]);

      const promiseDate = +new Date();
      setPromises((prev) => [
        ...prev,
        [
          apiCallback(paramArray[i])
            .finally(async () => {
              if (requestTypeWait) {
                // Wait for any previous request of the same kind
                const previousRequest = prev.reverse().find((r) => r[2] === requestType);
                if (previousRequest !== undefined) await previousRequest[0];
              }

              // Remove this one
              setPromises((prev) =>
                prev.filter((promiseWithDate) => promiseWithDate[1] !== promiseDate),
              );
            })
            // Set data or error accordingly
            .then(
              (data: T) => {
                setState((prev) => [
                  ...prev.slice(0, i),
                  { isLoading: false, data },
                  ...prev.slice(i + 1),
                ]);
              },
              (error: ResponseError) => {
                setState((prev) => [
                  ...prev.slice(0, i),
                  { isLoading: false, error },
                  ...prev.slice(i + 1),
                ]);
              },
            ),
          promiseDate,
          requestType,
        ],
      ]);
    }
    // eslint-disable-next-line
  }, dependencies);

  return state;
};
