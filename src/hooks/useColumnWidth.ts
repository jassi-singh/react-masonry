import { useEffect, useState } from "react";

export const useColumnWidth = (
  wrapperWidth: number | null,
  columnCount: number,
  padding: number
) => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!wrapperWidth) return;

    const width = (wrapperWidth - (columnCount - 1) * padding) / columnCount;

    setWidth(width);
  }, [wrapperWidth, columnCount, padding]);

  return width;
};
