import React, { useState, useEffect } from 'react';
import './App.css';

// Importing JSON files
import themes from './resources/themes.json';
import structures from './resources/structures.json';
import twists from './resources/twists.json';

function App() {
  const [themeList, setThemeList] = useState(themes);
  const [structureList, setStructureList] = useState(structures);
  const [twistList, setTwistList] = useState(twists);
  const [themeIndex, setThemeIndex] = useState(0);
  const [structureIndex, setStructureIndex] = useState(0);
  const [twistIndex, setTwistIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [twistEnabled, setTwistEnabled] = useState(false);

  useEffect(() => {
    let themeInterval, structureInterval, twistInterval;

    if (isSpinning) {
      if (themeList.length > 0) {
        themeInterval = setInterval(() => {
          setThemeIndex(Math.floor(Math.random() * themeList.length));
        }, 100);
      }
      if (structureList.length > 0) {
        structureInterval = setInterval(() => {
          setStructureIndex(Math.floor(Math.random() * structureList.length));
        }, 150);
      }
      if (twistEnabled && twistList.length > 0) {
        twistInterval = setInterval(() => {
          setTwistIndex(Math.floor(Math.random() * twistList.length));
        }, 200);
      }
    }

    return () => {
      clearInterval(themeInterval);
      clearInterval(structureInterval);
      clearInterval(twistInterval);
    };
  }, [isSpinning, themeList, structureList, twistEnabled, twistList]);

  const handleSpin = () => {
    setIsSpinning(true);
    setIsStopped(false);

    setTimeout(() => {
      // Select the final values from each list
      const newThemeIndex = themeList.length > 0 ? themeIndex : -1;
      const newStructureIndex = structureList.length > 0 ? structureIndex : -1;
      const newTwistIndex = twistEnabled && twistList.length > 0 ? twistIndex : -1;

      // Filter the selected options out of their respective lists
      setThemeList((prevList) =>
        prevList.filter((_, index) => index !== newThemeIndex)
      );
      setStructureList((prevList) =>
        prevList.filter((_, index) => index !== newStructureIndex)
      );
      if (twistEnabled) {
        setTwistList((prevList) =>
          prevList.filter((_, index) => index !== newTwistIndex)
        );
      }

      // Stop spinning
      setIsSpinning(false);
      setIsStopped(true);
    }, 3000);  // Simulate spinning for 3 seconds
  };

  return (
    <div className="container">
      <h1>Minecraft Build Slot Machine</h1>
      <div className="slotMachine">
        <div className="slot">
          <div className={isSpinning ? "spinning" : ""}>
            {themeList.length > 0 ? themeList[themeIndex] : "No Themes Left"}
          </div>
        </div>
        <div className="slot">
          <div className={isSpinning ? "spinning" : ""}>
            {structureList.length > 0 ? structureList[structureIndex] : "No Structures Left"}
          </div>
        </div>
        {twistEnabled && (
          <div className="slot">
            <div className={isSpinning ? "spinning" : ""}>
              {twistList.length > 0 ? twistList[twistIndex] : "No Twists Left"}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSpin}
        disabled={
          isSpinning || themeList.length === 0 || structureList.length === 0 || (twistEnabled && twistList.length === 0)
        }
      >
        {isSpinning ? "Spinning..." : "Spin!"}
      </button>

      <div className="checkbox-container">
        <label>
          <input
            type="checkbox"
            checked={twistEnabled}
            onChange={(e) => setTwistEnabled(e.target.checked)}
          />
          Enable Twists
        </label>
      </div>

      {isStopped && (
        <div className="result">
          <h2>
            {themeList.length > 0 ? themeList[themeIndex] : "No Themes Left"}{" "}
            {structureList.length > 0 ? structureList[structureIndex] : "No Structures Left"}
          </h2>
          {twistEnabled && twistList.length > 0 && (
            <p>Twist: {twistList[twistIndex]}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
