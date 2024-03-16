import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";
const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };
  
const AuthContext = createContext()
const initialState ={
    user:null,
    isAuthen:false,
}
function reducer(state,action){
switch(action.type){
    case 'login':return{...state,user:action.payload,isAuthen:true}
    case 'logout':return {...state,user:null,isAuthen:false}
    default: throw new Error('action known')
}
}
function AuthProvider({children}){
     const [{user,isAuthen},dispatch]= useReducer(reducer,initialState)
function login(email,password){
if(email===FAKE_USER.email&&password===FAKE_USER.password){
    dispatch({type:'login',payload:FAKE_USER})
}
}


function logout(){
    dispatch({type:'logout'})
}




    return<>
    <AuthContext.Provider value={{user,isAuthen,login,logout}}>
        {children}
    </AuthContext.Provider>
    </>

}
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
function useAuth(){
    const context = useContext(AuthContext)
    if(context===undefined) throw new Error('Auth get undefined')
    return context
}

export {AuthProvider,useAuth}