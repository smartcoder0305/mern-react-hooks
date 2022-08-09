// import React, { useRef, useEffect } from "react";

// import "./Map.css";

// const Map = (props) => {
//   const mapRef = useRef();

//   const { center, zoom } = props;

//   useEffect(() => {
//     const map = new window.google.maps.Map(mapRef.current, {
//       center: center,
//       zoom: zoom,
//     });

//     new window.google.maps.Marker({ position: center, map: map });
//   }, [center, zoom]);

//   return (
//     <div
//       ref={mapRef}
//       className={`map ${props.className}`}
//       style={props.style}
//     ></div>
//   );
// };

// export default Map;

import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MarkerClusterer from "@googlemaps/markerclustererplus";

import "./Map.css";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

function Map(props) {
  return (
    <div className="map">
      <Wrapper apiKey={process.env.REACT_APP_GOOGLE_API_KEY} render={render}>
          <MyMapComponent {...props} />
      </Wrapper>
      <div id="map" className={`map ${props.className ?? ""}`}></div>
    </div>
  )
}

const MyMapComponent = (props) => {
  const { center, zoom } = props;
  const locations = [
    center,
  ];
  const map = new window.google.maps.Map(document.getElementById("map"), {
    center,
    zoom
  });

  const markers = locations.map((location, i) => {
    return new window.google.maps.Marker({
      position: location,
      label: "P"
    });
  });

  new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
  });

  return null;
}

export default Map;