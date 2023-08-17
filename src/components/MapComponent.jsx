import React, { useRef, useEffect, useState } from "react";

function MapComponent({ center, zoom, children }) {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      );
    }
  }, [ref, map, center, zoom, children]);

  return (
    <div ref={ref} id="map" style={{ width: "50vw", height: "50vh" }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { map });
        }
      })}
    </div>
  );
}

export default MapComponent;
