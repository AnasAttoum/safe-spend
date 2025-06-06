import { useEffect, useState } from "react";

export default function CheckUpdate() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // cycles from 0 to 3
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <small className="text-gray-400">
      Checking for update{".".repeat(dotCount)}
    </small>
  );
}
