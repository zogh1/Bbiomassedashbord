import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const COST_PER_KM = 1.5;
const COST_PER_TONNE = 5;

const MapboxExample = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const customMarker = useRef(null); 
  const [biomassData, setBiomassData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBiomassPoints, setSelectedBiomassPoints] = useState([]);
  const [resetTimeout, setResetTimeout] = useState(null);
  const [customStartPoint, setCustomStartPoint] = useState(null);
  const [useCustomStartPoint, setUseCustomStartPoint] = useState(false);
  const [customPointDisplay, setCustomPointDisplay] = useState(null); 
  const [is3DView, setIs3DView] = useState(false);


  useEffect(() => {
    const fetchBiomassData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/biomass");
        setBiomassData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de biomasse:", error);
      }
    };

    fetchBiomassData();
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoid2Fzc3NtIiwiYSI6ImNtMTZjdWtnejBoZmwyanM4ajJ1ZDIxMGQifQ.H39Pzonhx3EriqOaKjsrNw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [5.1623805, 48.7712673],
      zoom: 6,
      pitch: 60,
      bearing: -17.6,
    });

    mapRef.current = map;

    map.on("load", () => {
      const geojsonData = {
        type: "FeatureCollection",
        features: biomassData.map((point) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(point.Longitude), parseFloat(point.Latitude)],
          },
          properties: {
            location: point.Localisation || "Unknown",
            details: Array.isArray(point.Details) ? point.Details : [],
          },
        })),
      };

      map.addSource("biomass", {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: "biomass-points",
        type: "circle",
        source: "biomass",
        paint: {
          "circle-color": "#4CAF50",
          "circle-opacity": 0.6,
          "circle-radius": 10,
        },
      });

      map.addLayer({
        id: "biomass-labels",
        type: "symbol",
        source: "biomass",
        layout: {
          "text-field": ["get", "location"],
          "text-size": 12,
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#FFFFFF",
          "text-halo-width": 1,
        },
      });

      map.on("click", "biomass-points", async (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        if (isSelectionMode) {
          setSelectedBiomassPoints((prevPoints) => {
            const alreadySelected = prevPoints.some(
              (point) => point.coordinates[0] === coordinates[0] && point.coordinates[1] === coordinates[1]
            );

            if (alreadySelected) {
              return prevPoints.filter(
                (point) => point.coordinates[0] !== coordinates[0] || point.coordinates[1] !== coordinates[1]
              );
            } else {
              if (prevPoints.length < 2) {
                fetchBiomassDetails(properties.location, coordinates);
                return prevPoints;
              } else {
                alert("Vous avez déjà sélectionné deux points. Réinitialisez pour sélectionner à nouveau.");
                return prevPoints;
              }
            }
          });
        } else {
          displayBiomassDetailsPopup(properties.location, coordinates);
        }
      });

      map.on("click", (e) => {
        if (useCustomStartPoint) {
          const { lng, lat } = e.lngLat;
          setCustomStartPoint([lng, lat]);
          setCustomPointDisplay({ lng, lat });

          if (customMarker.current) {
            customMarker.current.remove();
          }


          customMarker.current = new mapboxgl.Marker({ color: "#FF5733" })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

          mapRef.current.flyTo({ center: [lng, lat], zoom: 10 });

          // Create and display a circle with a radius of 50 km
          const circle = turf.circle([lng, lat], 50, { steps: 64, units: "kilometers" });

          if (mapRef.current.getSource("custom-start-circle")) {
            mapRef.current.getSource("custom-start-circle").setData(circle);
          } else {
            mapRef.current.addSource("custom-start-circle", {
              type: "geojson",
              data: circle,
            });

            mapRef.current.addLayer({
              id: "custom-start-circle-layer",
              type: "fill",
              source: "custom-start-circle",
              paint: {
                "fill-color": "rgba(255, 87, 51, 0.2)",
                "fill-outline-color": "rgba(255, 87, 51, 1)",
              },
            });
          }
        }
      });

      map.on("mouseenter", "biomass-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "biomass-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      map.remove();
    };
  }, [biomassData, isSelectionMode, useCustomStartPoint]); 



  const fetchBiomassDetails = async (location, coordinates) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/biomass/types-by-location?location=${encodeURIComponent(location)}`);
      const biomassDetails = response.data;

      setSelectedBiomassPoints((prevPoints) => [
        ...prevPoints,
        {
          coordinates,
          location,
          details: biomassDetails,
        },
      ]);
    } catch (error) {
      console.error("Error fetching biomass data by location:", error);
    }
  };

  const displayBiomassDetailsPopup = async (location, coordinates) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/biomass/types-by-location?location=${encodeURIComponent(location)}`);
      const biomassDetails = response.data;
  
      const totalQuantity = biomassDetails.reduce((total, biomass) => {
        return total + (parseFloat(biomass["Quantité de Biomasse (tonnes)"]) || 0);
      }, 0);
  
      // Create an HTML string for the popup content
      let detailsHtml = `<div style="max-height: 300px; overflow-y: auto;">
        <strong>Total Quantité de Biomasse: ${totalQuantity.toFixed(2)} tonnes</strong><br/>`;
  
      biomassDetails.forEach(biomass => {
        detailsHtml += `
          <div style="border-bottom: 1px solid #ddd; padding: 5px;">
            <strong>${biomass["Type Précis de Biomasse"] || "undefined"}</strong><br/>
            Quantité: ${biomass["Quantité de Biomasse (tonnes)"] || "undefined"} tonnes<br/>
            Saison: ${biomass["Disponibilité Saisonnière"] || "undefined"}
          </div>`;
      });
  
      detailsHtml += `</div>`;
  
      new mapboxgl.Popup().setLngLat(coordinates).setHTML(detailsHtml).addTo(mapRef.current);
    } catch (error) {
      console.error("Error fetching biomass data by location:", error);
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>${location}</strong><br/>Failed to load data`)
        .addTo(mapRef.current);
    }
  };
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const lngLat = [longitude, latitude];
          setCurrentLocation(lngLat); // Update the state with current location

          new mapboxgl.Marker({ color: "blue" })
            .setLngLat(lngLat)
            .addTo(mapRef.current);

          const circle = turf.circle(lngLat, 50, { steps: 64, units: "kilometers" });

          if (mapRef.current.getSource("radius-circle")) {
            mapRef.current.getSource("radius-circle").setData(circle);
          } else {
            mapRef.current.addSource("radius-circle", {
              type: "geojson",
              data: circle,
            });

            mapRef.current.addLayer({
              id: "radius-circle-layer",
              type: "fill",
              source: "radius-circle",
              paint: {
                "fill-color": "rgba(0, 0, 255, 0.2)",
                "fill-outline-color": "blue",
              },
            });
          }

          mapRef.current.flyTo({ center: lngLat });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error.message);
          alert("Impossible de récupérer votre position. Veuillez activer les services de localisation.");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  };

  const calculateMostUsefulPoint = async () => {
    const startPoint = customStartPoint ? customStartPoint : currentLocation;
    if (selectedBiomassPoints.length !== 2 || !startPoint) {
      alert("Veuillez sélectionner exactement deux points et activer votre position.");
      return;
    }

    const [point1, point2] = selectedBiomassPoints;

    const details1 = Array.isArray(point1.details) ? point1.details : [];
    const details2 = Array.isArray(point2.details) ? point2.details : [];

    const calculateTotalQuantity = (details) => {
      return details.reduce((total, biomass) => {
        const quantityKey = Object.keys(biomass).find(
          (key) =>
            key.toLowerCase().includes("quantité") &&
            key.toLowerCase().includes("tonnes")
        );
        const quantity = quantityKey ? parseFloat(biomass[quantityKey]) : 0;
        return total + (isNaN(quantity) ? 0 : quantity);
      }, 0);
    };

    const totalQuantity1 = calculateTotalQuantity(details1);
    const totalQuantity2 = calculateTotalQuantity(details2);

    try {
      const response1 = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint[0]},${startPoint[1]};${point1.coordinates[0]},${point1.coordinates[1]}?geometries=geojson&access_token=pk.eyJ1Ijoid2Fzc3NtIiwiYSI6ImNtMTZjdWtnejBoZmwyanM4ajJ1ZDIxMGQifQ.H39Pzonhx3EriqOaKjsrNw`
      );
      const data1 = await response1.json();
      const distance1 = data1.routes[0].distance / 1000; // Convert meters to kilometers

      const response2 = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint[0]},${startPoint[1]};${point2.coordinates[0]},${point2.coordinates[1]}?geometries=geojson&access_token=pk.eyJ1Ijoid2Fzc3NtIiwiYSI6ImNtMTZjdWtnejBoZmwyanM4ajJ1ZDIxMGQifQ.H39Pzonhx3EriqOaKjsrNw`
      );
      const data2 = await response2.json();
      const distance2 = data2.routes[0].distance / 1000;

      const transportCost1 = distance1 * COST_PER_KM + totalQuantity1 * COST_PER_TONNE;
      const transportCost2 = distance2 * COST_PER_KM + totalQuantity2 * COST_PER_TONNE;

      const score1 = totalQuantity1 / (transportCost1 || 1);
      const score2 = totalQuantity2 / (transportCost2 || 1);

      let bestPoint;
      let bestRoute;

      if (score1 === 0 && score2 === 0) {
        bestPoint = distance1 <= distance2 ? point1 : point2;
        bestRoute = distance1 <= distance2 ? data1.routes[0].geometry : data2.routes[0].geometry;
      } else {
        bestPoint = score1 >= score2 ? point1 : point2;
        bestRoute = score1 >= score2 ? data1.routes[0].geometry : data2.routes[0].geometry;
      }

      new mapboxgl.Popup()
        .setLngLat(bestPoint.coordinates)
        .setHTML(
          `<strong>Point le plus utile</strong><br/>Localisation: ${bestPoint.location}<br/>Quantité totale: ${bestPoint === point1 ? totalQuantity1 : totalQuantity2} tonnes<br/>Distance: ${bestPoint === point1 ? distance1 : distance2} kilomètres<br/>Coût de Transport: ${bestPoint === point1 ? transportCost1.toFixed(2) : transportCost2.toFixed(2)} €<br/>Score ajusté: ${Math.max(score1, score2).toFixed(2)}`
        )
        .addTo(mapRef.current);

      if (mapRef.current.getSource("route")) {
        mapRef.current.getSource("route").setData(bestRoute);
      } else {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: bestRoute,
        });

        mapRef.current.addLayer({
          id: "route-layer",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ff0000",
            "line-width": 4,
          },
        });
      }

      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
      const timeout = setTimeout(() => {
        resetSelection();
      }, 60000);
      setResetTimeout(timeout);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'itinéraire:", error);
    }
  };

  const resetSelection = () => {
    setSelectedBiomassPoints([]);
    setIsSelectionMode(false);
    setCustomStartPoint(null);
    setCustomPointDisplay(null);
    setCurrentLocation(null);
    setUseCustomStartPoint(false); // Reset to use current location
  
    if (mapRef.current) {
      // Remove route layer if it exists
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeLayer("route-layer");
        mapRef.current.removeSource("route");
      }
  
      // Remove custom start point marker and circle if they exist
      if (customMarker.current) {
        customMarker.current.remove();
        customMarker.current = null; // Reset custom marker
      }
    
      // Remove custom start circle if it exists
      if (mapRef.current.getSource("custom-start-circle")) {
        mapRef.current.removeLayer("custom-start-circle-layer");
        mapRef.current.removeSource("custom-start-circle");
      }
    
      // Remove radius circle for current location if it exists
      if (mapRef.current.getSource("radius-circle")) {
        mapRef.current.removeLayer("radius-circle-layer");
        mapRef.current.removeSource("radius-circle");
      }
    }
  
    if (resetTimeout) {
      clearTimeout(resetTimeout);
      setResetTimeout(null);
    }
  };
  
  const toggleSelectionMode = () => {
    setIsSelectionMode((prevState) => !prevState);
  };
  const toggle3DView = () => {
    if (mapRef.current) {
      if (is3DView) {
        // Switch back to 2D view
        mapRef.current.setPitch(0);
        mapRef.current.setBearing(0);
  
        // Remove 3D buildings layer if it exists
        if (mapRef.current.getLayer("3d-buildings")) {
          mapRef.current.removeLayer("3d-buildings");
        }
      } else {
        // Switch to 3D view
        mapRef.current.setPitch(60);
        mapRef.current.setBearing(-17.6);
  
        // Add the 3D buildings layer only if it doesn't exist
        if (!mapRef.current.getLayer("3d-buildings")) {
          mapRef.current.addLayer({
            id: "3d-buildings",
            source: "composite", 
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.6,
            },
          });
        }
      }
  
      // Toggle the 3D view state
      setIs3DView(!is3DView);
    }
  };
  

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          zIndex: 1,
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "6px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          onClick={getCurrentLocation}
          style={{
            background: "linear-gradient(135deg, #6DBE45 0%, #47802D 100%)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
          }}
        >
          🌍 Show Location
        </button>

        <button
          onClick={() => setUseCustomStartPoint(!useCustomStartPoint)}
          style={{
            background: useCustomStartPoint
              ? "linear-gradient(135deg, #FFAD5B 0%, #D07F35 100%)"
              : "linear-gradient(135deg, #A4E786 0%, #6AB24A 100%)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
          }}
        >
          {useCustomStartPoint ? "🚩 Use Custom Start Point" : "🌍 Use Current Location"}
        </button>

        <button
          onClick={toggleSelectionMode}
          style={{
            background: isSelectionMode
              ? "linear-gradient(135deg, #A4E786 0%, #6AB24A 100%)"
              : "linear-gradient(135deg, #A1DBB2 0%, #5BAF7D 100%)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
          }}
        >
          {isSelectionMode ? "🟢 Selection ON" : "🔵 Selection OFF"}
        </button>

        <button
          onClick={calculateMostUsefulPoint}
          style={{
            background: "linear-gradient(135deg, #87BC65 0%, #4B823A 100%)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
          }}
        >
          🌿 Calculate Most Useful Point
        </button>

        <button
          onClick={resetSelection}
          style={{
            background: "linear-gradient(135deg, #FFAD5B 0%, #D07F35 100%)",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
          }}
        >
          ♻️ Reset
        </button>
        <button
  onClick={toggle3DView}
  style={{
    background: is3DView
      ? "linear-gradient(135deg, #FFC107 0%, #FF9800 100%)"
      : "linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s, box-shadow 0.2s",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.4)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.2)";
  }}
>
  {is3DView ? "🔄 Switch to 2D" : "🔄 Switch to 3D"}
</button>

      </div>

      {/* Custom Point Display */}
      {customPointDisplay && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 2,
          }}
        >
          <strong>Custom Point Selected:</strong><br />
          Longitude: {customPointDisplay.lng.toFixed(6)}<br />
          Latitude: {customPointDisplay.lat.toFixed(6)}
        </div>
      )}

      <div
        style={{ height: "100vh", width: "100%" }}
        ref={mapContainerRef}
        className="map-container"
      />
    </>
  );
};


export default MapboxExample;
