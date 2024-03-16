import { createContext, useContext, useEffect, useReducer} from "react";
import PropTypes from 'prop-types';
const CitiesContext = createContext();
const initialState = {
  cities:[],
  loading:false,
  currentCity:{},
  error:'',
}

function reducer(state,action){
switch(action.type){
  case "loading" :return {
    ...state,loading:true
  }
  case 'cities/loaded':return{
    ...state,loading:false,cities:action.payload
  }

  case 'city/loaded':return{
    ...state,loading:false,currentCity:action.payload
  }

  case 'city/created':return {
    ...state,loading:false,cities:[...state.cities,action.payload],currentCity:action.payload
  }

  case 'cities/deleted':return {
    ...state,loading:false,cities:state.cities.filter(city=>city.id!==action.payload),currentCity:{}
  }


  case 'rejected':return {
    ...state,loading:false,error:action.payload
  }
 default : throw new Error('some thing get be a wrong')
}
}
function CitiesProvider({ children }) {
  const URL = "http://localhost:9000/";
  const [{cities,loading,currentCity},dispatch]=useReducer(reducer,initialState)
  // const [cities, setCities] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [currentCity,setCurrentCity] = useState({})


  useEffect(() => {
    async function getData() {
      dispatch({type:'loading'})
      try {
        let res = await fetch(`${URL}cities`);
        let data = await res.json();
        dispatch({type:'cities/loaded',payload:data})
      } catch {
        dispatch({type:'rejected',payload:"something went wrong"});
      }
    }
    getData();
  }, []);



async function getCity (id){
  if(+id === currentCity.id)return;
  dispatch({type:'loading'})
    try {
   
      let res = await fetch(`${URL}cities/${id}`);
      let data = await res.json();
      dispatch({type:'city/loaded',payload:data})
    } catch {
      dispatch({type:'rejected',payload:"something went wrong"});
    } 
  }


  async function getNewCity (newCity){
    dispatch({type:'loading'})
    try {
    
      let res = await fetch(`${URL}cities`,{
        method:'POST',
        body:JSON.stringify(newCity),
        headers:{
          "Content-Type":"application/json",
        },
      });
      let data = await res.json();
      dispatch({type:'city/created',payload:data})
    } catch {
      dispatch({type:'rejected',payload:"something went wrong"});
    } 
  }




  async function deleteCity (id){
    dispatch({type:'loading'})
    try {
     
       await fetch(`${URL}cities/${id}`,{
        method:'DELETE',
      });
    
      dispatch({type:'cities/deleted',payload:id})
    } catch {
      dispatch({type:'rejected',payload:"something went wrong"});
    } 
  }



  return (
    <CitiesContext.Provider value={{ cities, loading,getCity ,currentCity,getNewCity,deleteCity}}>
      {children}
    </CitiesContext.Provider>
  );
}

CitiesProvider.propTypes = {
  children: PropTypes.node,
};

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error('error');
  return context;
}

export { CitiesProvider, useCities };
