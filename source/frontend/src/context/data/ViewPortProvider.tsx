import type { RefObject } from "react";
import { useEffect, useMemo, useState } from "react";

export function useIsInViewport(ref: RefObject<HTMLDivElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry?.isIntersecting || false),
      ),
    [],
  );
  useEffect(() => {
    ref?.current && observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);
  return isIntersecting;
}
