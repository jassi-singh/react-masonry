import { MutableRefObject, ReactNode, useEffect, useState } from "react";

interface Position {
  top: number;
  left: number;
}

const getBoxHeights = (boxesRefs: MutableRefObject<HTMLDivElement[]>) =>
  boxesRefs.current.map((box) => box?.getBoundingClientRect().height ?? 0);

export const usePositions = (
  boxesRefs: MutableRefObject<HTMLDivElement[]>,
  columnWidth: number | null,
  padding: number,
  columnCount: number,
  children: ReactNode
) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [opacity, setOpacity] = useState<0 | 1>(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const checkAllImagesLoaded = (
    boxesRefs: MutableRefObject<HTMLDivElement[]>
  ) => {
    return new Promise<void>((resolve) => {
      const allImages = boxesRefs.current.flatMap((box) =>
        box ? Array.from(box.querySelectorAll("img")) : []
      );

      if (allImages.length === 0) {
        resolve();
        return;
      }

      const imageLoadPromises = allImages.map((img) => {
        return new Promise<void>((imageResolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            imageResolve();
          } else {
            img.onload = () => imageResolve();
            img.onerror = () => imageResolve();
          }
        });
      });

      Promise.all(imageLoadPromises).then(() => {
        resolve();
      });
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      checkAllImagesLoaded(boxesRefs).then(() => {
        if (!columnWidth) return;
        const positions: Position[] = [];
        const boxHeights = getBoxHeights(boxesRefs);
        const columnsHeights: number[] = new Array(columnCount).fill(0);

        boxHeights.forEach((height) => {
          const shortestColumnIndex = columnsHeights.findIndex(
            (h) => h == Math.min(...columnsHeights)
          );

          const top = columnsHeights[shortestColumnIndex];
          const left = (columnWidth + padding) * shortestColumnIndex;
          columnsHeights[shortestColumnIndex] += height + padding;
          positions.push({ top, left });
        });

        setPositions(positions);
        setOpacity(1);
        setContainerHeight(Math.max(...columnsHeights));
      });
    });

    boxesRefs.current.map((box) => {
      if (box) resizeObserver.observe(box);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [columnWidth, columnCount, children]);

  return { positions, opacity, containerHeight };
};
