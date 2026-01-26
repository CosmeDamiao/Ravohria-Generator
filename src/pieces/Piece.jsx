import React, { useMemo } from "react";
import {
  BP_SHIFT_VERTICAL,
  BP_SHIFT_HORIZONTAL_TRINCA,
  showDebugHelpers,
} from "./constants";
import { Core } from "./Core";
import { Blockade } from "./Blockade";
import { ExitPiece } from "./ExitPiece";
import { OverflowedCoresDebug } from "./OverflowedCoresDebug";
import { calculateTop, calculateLeft } from "../helpers";

export const Piece = ({
  imgUrl,
  alt,
  l,
  c,
  cores,
  blockades,
  isDesktop,
  arr,
  isExit,
}) => {
  const previousBoardPiece = arr.find((bp) => bp.l === l - 1);

  const left = useMemo(() => {
    return calculateLeft(
      previousBoardPiece,
      l,
      c,
      isDesktop,
      BP_SHIFT_HORIZONTAL_TRINCA
    );
  }, [previousBoardPiece, l, c, isDesktop]);

  const top = useMemo(() => {
    return calculateTop(l, isDesktop, BP_SHIFT_VERTICAL);
  }, [isDesktop, l]);

  if (isExit) {
    return (
      <ExitPiece
        imgUrl={imgUrl}
        alt={alt}
        l={l}
        c={c}
        isDesktop={isDesktop}
        previousBoardPiece={previousBoardPiece}
      />
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          zIndex: 1,
        }}
      >
        {showDebugHelpers && <OverflowedCoresDebug cores={cores} />}
        {cores &&
          Array.from(cores.entries()).map(([key, core]) => (
            <Core key={key} imgUrl={core.imgUrl} index={key} />
          ))}
        {blockades &&
          blockades.map((position) => (
            <Blockade
              key={`blockade_${l}_${position}`}
              position={position}
              l={l}
            />
          ))}
        <img src={imgUrl} alt={alt} />
      </div>
    </>
  );
};
