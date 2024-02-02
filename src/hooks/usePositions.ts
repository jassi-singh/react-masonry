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
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const checkAllImagesLoaded = (
    boxesRefs: MutableRefObject<HTMLDivElement[]>
  ) => {
    const allImages = boxesRefs.current.flatMap((box) =>
      box ? Array.from(box.querySelectorAll("img")) : []
    );
    const totalImages = allImages.length;
    let loadedImages = 0;

    allImages.forEach((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        loadedImages++;
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            setAllImagesLoaded(true);
          }
        };
        // Handle case where image fails to load
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            setAllImagesLoaded(true);
          }
        };
      }
    });

    // In case all images are already loaded by the time this function runs
    if (loadedImages === totalImages) {
      setAllImagesLoaded(true);
    }
  };

  useEffect(() => {
    setAllImagesLoaded(false);
    checkAllImagesLoaded(boxesRefs);

    if (!columnWidth || !allImagesLoaded) return;
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
  }, [columnWidth, padding, boxesRefs, columnCount, children, allImagesLoaded]);

  return { positions, opacity, containerHeight };
};
