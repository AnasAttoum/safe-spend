import { useEffect, useState } from "react";

export function useCountDown(startSeconds: number, active: boolean) {
  const [countDown, setcountDown] = useState(startSeconds);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (active) {
      setcountDown(startSeconds); // reset to full when activated
      timer = setInterval(() => {
        setcountDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setcountDown(startSeconds); // reset when inactive
    }

    return () => clearInterval(timer);
  }, [active, startSeconds]);

  return countDown;
}
