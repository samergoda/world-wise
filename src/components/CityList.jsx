
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message"
import { useCities } from "./../Context/CitiesContext";

function CityList() {
  const { cities, loading } = useCities()
  if (loading) return <Spinner />;
if(!cities.length) return <Message message='add your first city 😉 by clicking on a city on the map'/>
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

CityList.propTypes = {
  cities: PropTypes.array,
  loading: PropTypes.bool,
};

export default CityList;
