// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Spinner from './Spinner'
import Message from './Message'
import styles from "./Form.module.css";
import Button from './Button'
import {  useNavigate } from "react-router-dom";
import { useUrlPosition } from "../Hooks/useUrlPosition";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useCities } from "../Context/CitiesContext";

// const convertToEmoji = (flag) => {
//   var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
//   return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
// }
function Form() {
  const [lat,lng]=useUrlPosition()
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
const [emoji,setEmoji]=useState()
const [error,setError]=useState('')
const navigate = useNavigate()
const [loading,setLoading]=useState(false)
const {getNewCity}=useCities()



function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
  // var Code = Array.from(countryCode, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
  // return (<img src={`https://flagcdn.com/24x18/${Code}.png`} alt='flag' />)
}

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char-127397).toLowerCase()).join('')
  return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
}







useEffect(()=>{
  async function getData(){
   if(!lat&&!lng)return;


      try{
      setLoading(true)
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`)
      const data = await res.json()
      setError('')
      if(!data.countryCode)setError("That doesn't seem to be a city ,Click somewhere else😀")
      console.log(data)
      setCityName(data.city||data.locality||'')
      setCountry(data.countryName)
      setEmoji(convertToEmoji(data.countryCode))
      }catch(err){
      setError(err.message)
      }finally{
      setLoading(false)
      }
      }
      getData()
      },[lat,lng])

     async function handleSubmit(e){
        e.preventDefault()
        if(!cityName||!date) return;
        const newCity ={
          cityName,
          emoji,
          country,
          date,
          notes,
          position:{
            lat,lng
          }
        }
       await getNewCity(newCity)
        navigate('/app/cities')
      }
      



if(loading) return <Spinner />
if(!lat&&lng) return <Message message="start by clicking somewhere on the map"/>
if(error) return <Message message={error}/>
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji&&flagemojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker   id="date"
          onChange={(date) => setDate(date)}
          selected={date} dateFormat="dd/MM/yyy"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName},{country}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <Button type='back' onClick={(e)=>{
          e.preventDefault()
          navigate(-1)
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
