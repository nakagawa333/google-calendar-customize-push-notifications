import { useEffect, useRef } from "react";

type Props = {
    onIntersect:any
    isActiveObserver:any
    isSelected:any
}

export const ScrollComponent = (props:Props) => {
    const { onIntersect,isActiveObserver,isSelected } = props;
    const ref = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries, observer) => {
        if(0.99 <= entries[0].intersectionRatio && isSelected.current === false) {
            onIntersect()
          }
        },
        {
          threshold: 0.99,
        }
      );

      if(ref.current){
        observer.observe(ref.current);
      }

      return () => {
        observer.disconnect();
      }
 
    }, [isActiveObserver,onIntersect]);
  
    return (
      <>
        {isActiveObserver ? (
          <div className="flex justify-center m-2.5" aria-label="読み込み中" ref={ref}>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : null}
      </>
    );
  };