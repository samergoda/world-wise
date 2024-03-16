import PropTypes from "prop-types";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../Context/CitiesContext";

function CityItem({ city }) {
 const {currentCity,deleteCity}= useCities()
  let {cityName,emoji,date,id,position}= city
  console.log(position)
  const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

  const flagemojiToPNG = (flag) => {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
    return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}



function handleDelete(e){
e.preventDefault()
deleteCity(id)
}
  return (
    <li>
      <Link  className={`${styles.cityItem}  ${id===currentCity.id ?styles['cityItem--active']:''}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>
     <span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>

      <h3 className={styles.name}>
        {cityName}
      </h3>
      <time className={styles.date}>
         {formatDate(date)}
      </time>
      <button className={styles.deleteBtn} onClick={handleDelete}>&times;</button>
      </Link>
    </li>
  );
}

CityItem.propTypes = {
  city: PropTypes.shape({
    cityName: PropTypes.string.isRequired,
    emoji: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CityItem;
