import { useEffect, useState } from "react";

export const useColumnCount = (columnBreakPoints: {
  [key: number]: number;
}) => {
  const getColumnCount = () => {
    const sortedBreakpoints = Object.keys(columnBreakPoints)
      .map(Number)
      .sort((a, b) => a - b);

    let count = 1;

    for (const breakpoint of sortedBreakpoints) {
      if (window.innerWidth >= breakpoint) {
        count = columnBreakPoints[breakpoint];
      } else {
        break;
      }
    }

    return count;
  };

  const [columnCount, setColumnCount] = useState(getColumnCount);

  useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [columnBreakPoints]);

  return columnCount;
};
