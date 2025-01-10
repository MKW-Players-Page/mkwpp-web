import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (
  paddingLength: number,
  maxLength: number,
  dependencies: any[],
): [number, number, React.MutableRefObject<null>] => {
  const [firstElementNum, setFirstElementNum] = useState(0);
  const [lastElementNum, setLastElementNum] = useState(0);
  const sliceStart = Math.max(0, firstElementNum - paddingLength);
  const sliceEnd = Math.min(maxLength, lastElementNum + paddingLength);
  const tbodyElement = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((e) => {
      const clientHeightCheck = document.documentElement.clientHeight / 2;
      e.forEach(function (row) {
        const elemNth =
          Array.from(row.target.parentNode?.children ?? []).indexOf(row.target) + sliceStart;
        if (row.isIntersecting) {
          if (row.boundingClientRect.top < clientHeightCheck) {
            setFirstElementNum(elemNth);
          } else {
            setLastElementNum(elemNth);
          }
        } else {
          if (row.boundingClientRect.top < clientHeightCheck) {
            if (elemNth === firstElementNum + 1) setFirstElementNum(elemNth);
          } else {
            if (elemNth === lastElementNum - 1) setLastElementNum(elemNth);
          }
        }
      });
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
