import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../Context/CitiesContext";
import PropTypes from "prop-types";
import { useNavigate} from "react-router-dom";
import { useGeolocation } from "../Hooks/useGeolocation";
import Button from './Button'
import { useUrlPosition } from "../Hooks/useUrlPosition";
function Map() {
  const { cities } = useCities();

  const [positionMap, setPositionMap] = useState([50, 20]);

  const [mapLat,mapLng]=useUrlPosition()


  const {
    isLoading: isLoadingGeolocation,
    position: positionGeolocation,
    // error: errorGeolocation,
    getPosition,
  } = useGeolocation();
  useEffect(() => {
    if (mapLat && mapLng) setPositionMap([mapLat, mapLng]);
  }, [mapLat, mapLng]);



  useEffect(()=>{
    if(positionGeolocation)setPositionMap([positionGeolocation.lat,positionGeolocation.lng])
  },[positionGeolocation])
  return (
    <div className={styles.mapContainer}>
    {positionGeolocation && ( <Button type="position" onClick={getPosition}>{
isLoadingGeolocation?'loading...':'Use your position'}</Button>)}
      <MapContainer
        center={positionMap}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.id}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={positionMap} />
        <FormNavigate />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();

  if (
    position &&
    position.length === 2 &&
    !isNaN(Number(position[0])) &&
    !isNaN(Number(position[1]))
  ) {
    const [lat, lng] = position.map(Number); // Convert strings to numbers
    map.setView([lat, lng]);
  }

  return null;
}


ChangeCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.any),
};


function FormNavigate() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
