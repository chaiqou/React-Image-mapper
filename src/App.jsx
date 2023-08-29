import React, { useState, useRef, useEffect } from "react";
import Two from "two.js";

const App = () => {
  const [areas, setAreas] = useState([]);
  const imageContainerRef = useRef(null);

  let two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true,
  });

  useEffect(() => {
    two.appendTo(imageContainerRef.current);
    console.log(two);

    return () => {
      two.clear();
    };
  }, []);

  return (
    <>
      <div ref={imageContainerRef}></div>
      <img src="/src/assets/apartment.png" />
    </>
  );
};

export default App;
