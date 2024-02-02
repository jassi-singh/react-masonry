import React, {
  Children,
  FunctionComponent,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  useRef,
} from "react";
import { useWrapperWidth } from "../hooks/useWrapperWidth";
import { useColumnWidth } from "../hooks/useColumnWidth";
import { usePositions } from "../hooks/usePositions";
import { useColumnCount } from "../hooks/useColumnCount";

interface MasonryProps {
  padding: number;
  columnBreakPoints: { [key: number]: number };
}

const Masonry: FunctionComponent<PropsWithChildren<MasonryProps>> = ({
  padding,
  columnBreakPoints,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxesRefs = useRef<HTMLDivElement[]>([]);

  const wrapperWidth = useWrapperWidth(wrapperRef);
  const columnCount = useColumnCount(columnBreakPoints);
  const colWidth = useColumnWidth(wrapperWidth, columnCount, padding);
  const { positions, opacity, containerHeight } = usePositions(
    boxesRefs,
    colWidth,
    padding,
    columnCount,
    children
  );

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", height: containerHeight, opacity }}
    >
      {Children.map(children, (child, idx) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child, {
          ...child.props,
          ref: (ref: HTMLDivElement) => (boxesRefs.current[idx] = ref),
          style: {
            ...child.props.styles,
            position: "absolute",
            width: colWidth,
            left: positions[idx]?.left,
            top: positions[idx]?.top,
          },
        });
      })}
    </div>
  );
};

export default Masonry;
