import { memo, useEffect, useRef } from "react";

// eslint-disable-next-line react/display-name
export const ScrollObserver = memo((props:any) => {
  const { onIntersect, isActiveObserver } = props;
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        if (1 <= entries[0].intersectionRatio) {
          observer.disconnect();
          onIntersect();
        }
      },
      {
        threshold: 1,
      }
    );

    if(ref.current){
        observer.observe(ref.current);
    }
  }, [onIntersect]);

  return (
    <>
      {isActiveObserver ? (
        <div className="flex justify-center m-2.5" aria-label="読み込み中" ref={ref}>
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : null}
    </>
  );
});