import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import MapComponent from "./MapComponent";
import LoadingComponent from "./LoadingComponent";

export default function ModifyAddressForm({ initialAddress, onSave }) {
  const API_KEY = "AIzaSyClyM0t39WQ8SI37pIZycGy2o02d57byxs"; // replace "YOUR_API_KEY" with your actual API key
  const [apartment, setApartment] = useState(initialAddress.apartment);
  const [floor, setFloor] = useState(initialAddress.floor);
  const [street, setStreet] = useState(initialAddress.street);
  const [number, setNumber] = useState(initialAddress.number);
  const [city, setCity] = useState(initialAddress.city);
  const [postalCode, setPostalCode] = useState(initialAddress.postalCode);
  const [state, setState] = useState(initialAddress.state);
  // Define the two new states:
  const [coordinates, setCoordinates] = useState({
    lat: initialAddress.mapLocation._lat,
    lng: initialAddress.mapLocation._long,
  });
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [mapStatus, setMapStatus] = useState(Status.LOADING);

  useEffect(() => {
    console.log(initialAddress);
  }, []);

  useEffect(() => {
    if (street && number && city && state) {
      setLoadingAddress(true);
      getCoordinates()
        .then((coords) => {
          setCoordinates(coords);
          setLoadingAddress(false);
        })
        .catch((err) => {
          console.error("Error fetching address coordinates:", err);
          setLoadingAddress(false);
        });
    }
  }, [street, number, city, state]);

  useEffect(() => {
    if (mapStatus === Status.SUCCESS) {
      setLoadingAddress(true);
      getCoordinates()
        .then((coords) => {
          setCoordinates(coords);
          setLoadingAddress(false);
        })
        .catch((err) => {
          console.error("Error fetching address coordinates:", err);
          setLoadingAddress(false);
        });
    }
  }, [mapStatus]);

  const Marker = (options) => {
    const [marker, setMarker] = React.useState();

    React.useEffect(() => {
      if (!marker) {
        const newMarker = new google.maps.Marker({
          ...options,
          draggable: true, // Make the marker draggable
        });

        // Add an event listener to the marker for the dragend event
        newMarker.addListener("dragend", (e) => {
          const newCoordinates = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };

          // Update the state with the new coordinates
          setCoordinates(newCoordinates);
        });

        setMarker(newMarker);
      }

      // remove marker from map on unmount
      return () => {
        if (marker) {
          marker.setMap(null);
        }
      };
    }, [marker, options]);

    React.useEffect(() => {
      if (marker) {
        marker.setOptions(options);
      }
    }, [marker, options]);

    return null;
  };

  const render = (status) => {
    setMapStatus(status);
    switch (status) {
      case Status.LOADING:
        return <div>Loading...</div>;
      case Status.FAILURE:
        return <div>Error loading Google Maps</div>;
      case Status.SUCCESS:
        if (loadingAddress) {
          return (
            <div
              style={{ width: "50vw", height: "50vh", position: "relative" }}
            >
              <LoadingComponent text={" mapa"} />
            </div>
          );
        } else if (coordinates) {
          return (
            <MapComponent center={coordinates} zoom={17}>
              <Marker position={coordinates} />
            </MapComponent>
          );
        } else {
          return <div>Error fetching address coordinates</div>;
        }
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { lat, lng } = coordinates;
    const updatedAddress = {
      ...initialAddress,
      apartment,
      floor,
      street,
      number,
      city,
      postalCode,
      state,
      mapLocation: {
        _lat: lat,
        _long: lng,
      },
      latitude: lat,
      longitude: lng,
    };
    onSave(updatedAddress);
  };

  const getCoordinates = () => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { address: `${street} ${number}, ${city}, ${state}` },
        (results, status) => {
          if (
            status === "OK" &&
            results &&
            results[0] &&
            results[0].geometry &&
            results[0].geometry.location
          ) {
            const coordinates = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            };
            resolve(coordinates);
          } else {
            reject(new Error("Geocode was not successful: " + status));
          }
        }
      );
    });
  };

  return (
    <Container>
      <Form
        as={Row}
        className="d-flex justify-content-center align-items-center flex-column text-center"
      >
        <div className="text-center d-flex justify-content-evenly align-items-center flex-row">
          <Form.Group
            controlId="apartment"
            as={Col}
            style={{ marginRight: "10px" }}
          >
            <Form.Label className="text-center">Departamento</Form.Label>
            <Form.Control
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="text-center"
            />
          </Form.Group>

          <Form.Group controlId="floor" as={Col} style={{ marginLeft: "10px" }}>
            <Form.Label className="text-center">Piso</Form.Label>
            <Form.Control
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="text-center"
            />
          </Form.Group>
        </div>
        <div
          className="d-flex justify-content-evenly align-items-center flex-row"
          style={{ marginTop: "10px" }}
        >
          <Form.Group
            controlId="street"
            as={Col}
            style={{ marginLeft: "10px" }}
          >
            <Form.Label className="text-center">Calle</Form.Label>
            <Form.Control
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="text-center"
            />
          </Form.Group>

          <Form.Group
            controlId="number"
            as={Col}
            style={{ marginLeft: "10px" }}
          >
            <Form.Label className="text-center">Número</Form.Label>
            <Form.Control
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="text-center"
            />
          </Form.Group>
        </div>
        <Form.Group
          controlId="postalCode"
          as={Col}
          style={{ marginTop: "10px" }}
        >
          <Form.Label className="text-center">Código Postal</Form.Label>
          <Form.Control
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="text-center"
          />
        </Form.Group>
        <Form.Group controlId="city" as={Col} style={{ marginTop: "10px" }}>
          <Form.Label className="text-center">Ciudad</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="text-center"
          />
        </Form.Group>

        <Form.Group controlId="state" as={Col} style={{ marginTop: "10px" }}>
          <Form.Label className="text-center">Provincia/Estado</Form.Label>
          <Form.Control
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="text-center"
          />
        </Form.Group>

        <Col
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ marginTop: "10px" }}
        >
          <Wrapper apiKey={API_KEY} render={render} />
        </Col>
        <Col
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ marginTop: "10px" }}
        >
          <Button variant="primary" onClick={handleSubmit}>
            Guardar dirección
          </Button>
        </Col>
      </Form>
    </Container>
  );
}
