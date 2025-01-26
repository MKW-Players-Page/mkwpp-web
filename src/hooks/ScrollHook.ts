import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (
  paddingLength: number,
  maxLength: number,
  dependencies: any[],
  preElement: number = 0,
): [number, number, React.MutableRefObject<null>] => {
  const [firstElementNum, setFirstElementNum] = useState(preElement);
  const [lastElementNum, setLastElementNum] = useState(preElement);
  const sliceStart = Math.max(0, firstElementNum - paddingLength);
  const sliceEnd = Math.min(maxLength, lastElementNum + paddingLength);
  const tbodyElement = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((e) => {
      const clientHeightCheck = document.documentElement.clientHeight / 2;
      const functionR = async function (row: IntersectionObserverEntry) {
        const elemNth =
          Array.from(row.target.parentNode?.children ?? []).indexOf(row.target) + sliceStart;
        if (row.isIntersecting) {
          if (row.boundingClientRect.top < clientHeightCheck) {
            setFirstElementNum(elemNth);
          } else {
            setLastElementNum(elemNth);
          }
        } else {
          if (row.boundingClientRect.top > clientHeightCheck) {
            if (elemNth < lastElementNum) setLastElementNum(elemNth);
          } else {
            if (elemNth > firstElementNum) setFirstElementNum(elemNth);
          }
        }
      };
      const half = Math.floor(e.length / 2);
      for (let i = e.length - 1; i > half; i--) functionR(e[i]);
      for (let i = 0; i < half; i++) functionR(e[i]);
    });

    if (tbodyElement.current !== null)
      Array.from((tbodyElement.current as any).children).map((r) =>
        observer.observe(r as HTMLTableRowElement),
      );

    return () => observer.disconnect();
  }, [
    firstElementNum,
    setFirstElementNum,
    lastElementNum,
    setLastElementNum,
    tbodyElement,
    sliceStart,
    // eslint-disable-next-line
    ...dependencies,
  ]);

  return [sliceStart, sliceEnd, tbodyElement];
};
