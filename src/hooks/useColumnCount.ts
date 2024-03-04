import { useEffect, useState } from "react";
import { useWindowWidth } from "./useWindowWidth";

export const useColumnCount = (columnBreakPoints: {
  [key: number]: number;
}) => {
  const windowWidth = useWindowWidth();
  const [columnCount, setColumnCount] = useState(1);

  useEffect(() => {
    const sortedBreakpoints = Object.keys(columnBreakPoints)
      .map(Number)
      .sort((a, b) => a - b);

    let count = 1;

    for (const breakpoint of sortedBreakpoints) {
      if (windowWidth >= breakpoint) {
        count = columnBreakPoints[breakpoint];
      } else {
        break;
      }
    }

    setColumnCount(count);
  }, [columnBreakPoints, windowWidth]);

  return columnCount;
};
