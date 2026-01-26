import "./App.css";
import React, { useMemo, useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import { motion } from "framer-motion";
import { Piece } from "./pieces/Piece.jsx";
import { SidePiece } from "./pieces/SidePiece.jsx";
import { ZoneBackgroundDebug } from "./pieces/ZoneBackgroundDebug.jsx";
import { mapGenerator, calculateTowerPositions } from "./game/mapGenerator.js";
import {
  BP_SHIFT_VERTICAL,
  BP_SHIFT_HORIZONTAL,
  BP_SHIFT_HORIZONTAL_TRINCA,
} from "./pieces/constants.js";
import { calculateLeft, calculateTop } from "./helpers";
import { Menu } from "./ui/Menu.jsx";
import { AboutMe } from "./ui/AboutMe.jsx";
import { difficultiesConfig } from "./pieces/difficulties.js";
import { Drawer } from "./ui/Drawer/Drawer.jsx";
import { showDebugHelpers } from "./pieces/constants.js";

import sentinel from "./imagens/Sentinel.png";
import tower1 from "./imagens/Tower1.png";
import tower2 from "./imagens/Tower2.png";
import tower3 from "./imagens/Tower3.png";

function App() {
  const [mapState, setMapState] = useState({
    scale: 0.07,
    translation: { x: 0, y: 0 },
  });
  const [difficulty, setDifficulty] = useState(1);
  const [configs, setConfigs] = useState(difficultiesConfig);
  const [isEditingConfig] = useState(false);

  const [boardPieces, setBoardPieces] = useState(() =>
    mapGenerator(configs[difficulty]),
  );

  const [shiftedTowerPositions, setShiftedTowerPositions] = useState(() =>
    calculateTowerPositions(configs[difficulty]),
  );

  const isDesktop = window.innerWidth > 768;

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    // Reset config for the new difficulty to default values
    setConfigs({
      ...configs,
      [newDifficulty]: difficultiesConfig[newDifficulty],
    });
  };

  const renderBoardPieces = () => {
    return boardPieces.map((boardPiece, index, arr) => (
      <motion.div
        key={`${boardPiece.imgUrl}_${index}`}
        animate={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
        initial={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <Piece
          imgUrl={boardPiece.imgUrl}
          alt={`Board Piece ${index}`}
          l={boardPiece.l}
          c={boardPiece.c}
          cores={boardPiece.cores}
          blockades={boardPiece.blockades}
          isDesktop={isDesktop}
          arr={arr}
          isExit={boardPiece.isExit}
        />
      </motion.div>
    ));
  };

  const renderZoneBackgrounds = () => {
    if (!showDebugHelpers) return null;

    return boardPieces.map((boardPiece, index, arr) => {
      if (boardPiece.isExit) return null;

      return (
        <motion.div
          key={`zone_bg_${index}`}
          animate={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
          initial={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
          style={{ zIndex: 0 }}
        >
          <ZoneBackgroundDebug
            l={boardPiece.l}
            c={boardPiece.c}
            size={boardPiece.size}
            isDesktop={isDesktop}
            previousBoardPiece={arr.find((bp) => bp.l === boardPiece.l - 1)}
          />
        </motion.div>
      );
    });
  };

  const renderTowersAndSentinels = () => {
    const sidePieces = [
      { imgUrl: sentinel, alt: "Sentinel", l: 0 },
      { imgUrl: tower1, alt: "Tower 1", l: shiftedTowerPositions[0] },
      { imgUrl: tower2, alt: "Tower 2", l: shiftedTowerPositions[1] },
      { imgUrl: tower3, alt: "Tower 3", l: shiftedTowerPositions[2] },
    ];

    return sidePieces.map((piece, index) => (
      <motion.div
        key={`${piece.alt}_${index}`}
        animate={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
        initial={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
      >
        <SidePiece
          imgUrl={piece.imgUrl}
          alt={piece.alt}
          l={piece.l}
          isDesktop={isDesktop}
          boardPieces={boardPieces}
        />
      </motion.div>
    ));
  };

  const renderAlignmentLines = () => {
    const linePositions = [0, ...shiftedTowerPositions].filter((value) =>
      Number.isFinite(value),
    );
    const lineHeight = 20;

    return linePositions.map((lineValue, index) => {
      const top =
        calculateTop(lineValue - 1, isDesktop, BP_SHIFT_VERTICAL) +
        BP_SHIFT_VERTICAL / 2 -
        lineHeight / 2;

      return (
        <motion.div
          key={`alignment_line_${index}_${lineValue}`}
          animate={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
          initial={{ x: isDesktop ? 2000 : 600, scale: isDesktop ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              position: "absolute",
              left: "-50000px",
              top: `${top}px`,
              width: "100000px",
              height: `${lineHeight}px`,
              background: "rgba(194, 4, 4, 0.67)",
              zIndex: 0,
            }}
          />
        </motion.div>
      );
    });
  };

  const ConfigRendererComponent = isDesktop ? Menu : Drawer;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapInteractionCSS
        value={mapState}
        onChange={(value) => setMapState(value)}
      >
        {renderAlignmentLines()}
        {renderZoneBackgrounds()}
        {renderBoardPieces()}
        {renderTowersAndSentinels()}
      </MapInteractionCSS>
      <ConfigRendererComponent
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onGenerate={() => {
          console.log("Generating new map with configs:", configs[difficulty]);
          setBoardPieces([]);
          setBoardPieces(mapGenerator(configs[difficulty]));
          setShiftedTowerPositions([]);
          setShiftedTowerPositions(
            calculateTowerPositions(configs[difficulty]),
          );
        }}
        isEditingConfig={isEditingConfig}
      >
        <AboutMe />
      </ConfigRendererComponent>
    </div>
  );
}

export default App;
