import React from "react";
import { CORE_SHIFT_VERTICAL, CORE_SHIFT_HORIZONTAL } from "./constants";

export const Core = ({ imgUrl, index }) => {
  return (
    <div
      key={`core_${imgUrl}_${index}`}
      style={{
        position: "absolute",
        top: `${CORE_SHIFT_VERTICAL}px`,
        right: `${index * CORE_SHIFT_HORIZONTAL}px`,
      }}
    >
      <img src={imgUrl} alt={`core_${imgUrl}_${index}_alt`} />
    </div>
  );
};
