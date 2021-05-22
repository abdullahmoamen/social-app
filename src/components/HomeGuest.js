import React,{useEffect,useContext,useRef} from "react";
import Pages from "./Pages";
import Axios from "axios";
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import DispatchContext from './../DispatchContext';


function HomeGuest() {
const appDispatch =useContext(DispatchContext)
  const initState= {
    username:{
      value:"",
      hasErrors:false,
      message:"",
      isUnique:false,
      checkCount:0
    },
    email:{
      value:"",
      hasErrors:false,
      message:"",
      isUnique:false,
      checkCount:0
    },
    password:{
      value:"",
      hasErrors:false,
      message:"",
    },
    submitCount:0,
  }

  function ourReducer(draft,action){
    switch(action.type){

      case 'usernameImmediately':
        draft.username.value=action.value;
        draft.username.hasErrors = false;
        if(draft.username.value.length > 30){
          draft.username.hasErrors = true;
          draft.username.message = 'UserName should not exceed 30 characters 🙄';
        }
        if(draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)){//Reg exp
          draft.username.hasErrors = true;
          draft.username.message='UserName can only contain numbers and letters 🙄.';
        }
        break;

      case 'usernameAfterDelay':
        if(draft.username.value.length <= 3){
          draft.username.hasErrors = true;
          draft.username.message = 'Please enter more than 3 characters !';
        }
        if(!draft.username.hasErrors && !action.noRequest){
          draft.username.checkCount++;
        }
        break;

      case 'usernameUniqueResults':
        if(action.value){ //username has been exist
          draft.username.hasErrors = true;
          draft.username.isUnique=false;
          draft.username.message='this username is already exist, plz choose a different username'
        }else{
          draft.username.isUnique=true;
        }
        break;

      case 'emailImmediately':
        draft.email.hasErrors = false;        
        draft.email.value=action.value;
        break;

      case 'emailUniqueResults':
        if(action.value){ //email has been exist
          draft.email.hasErrors = true;
          draft.email.isUnique=false;
          draft.email.message='this email is already exist, plz choose a different email'
        }else{
          draft.email.isUnique=true;
        }
        break;

      case 'emailAfterDelay':
        if(!/^\S+@\S+$/.test(draft.email.value)){
          draft.email.hasErrors=true;
          draft.email.message ='You must provide a valid email.🙄'
        }
        if(!draft.email.hasErrors && !action.noRequest){
          draft.email.checkCount++;
        }
        break;

      case 'passwordImmediately':
        draft.password.value=action.value;
        draft.password.hasErrors = false;
        if(draft.password.value.length > 50){
          draft.password.hasErrors=true;
          draft.password.message='Password can not exceed 50 characters.'
        }
        break;

      case 'passwordAfterDelay':
        if(draft.password.value.length <= 10 ){
          draft.password.hasErrors=true;
          draft.password.message='Password must be more than 10 characters.'
        }
        break;
      
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        }
        break;
    }
  }

  const [state,dispatch]=useImmerReducer(ourReducer,initState);

  useEffect(()=>{
    if(state.username.value){
      const delay = setTimeout(()=>dispatch({type:'usernameAfterDelay'}),800)
      return ()=> clearTimeout(delay)
    }
  },[state.username.value])

  useEffect(()=>{
    if(state.email.value){
      const delay = setTimeout(()=>dispatch({type:'emailAfterDelay'}),800)
      return ()=> clearTimeout(delay)
    }
  },[state.email.value])

  useEffect(()=>{
    if(state.password.value){
      const delay = setTimeout(()=>dispatch({type:'passwordAfterDelay'}),800)
      return ()=> clearTimeout(delay)
    }
  },[state.password.value])

  useEffect(()=>{
    if(state.username.checkCount){
      const ourReq=Axios.CancelToken.source();
      async function fetchResults(){
        try {
          const response =await Axios.post('/doesUsernameExist',{username:state.username.value},{cancelToken:ourReq.token});
          dispatch({type:'usernameUniqueResults',value:response.data})
        } catch (error) {
            console.log('error !')
          }
        }
        fetchResults();
        return ()=>ourReq.cancel();
      } 
    },[state.username.checkCount]);

    useEffect(()=>{
      if(state.email.checkCount){
        const ourReq=Axios.CancelToken.source();
        async function fetchResults(){
          try {
            const response =await Axios.post('/doesEmailExist',{email:state.email.value},{cancelToken:ourReq.token});
            dispatch({type:'emailUniqueResults',value:response.data})
          } catch (error) {
            console.log('error !')
          }
        }
        fetchResults();
        return ()=>ourReq.cancel();
      } 
    },[state.email.checkCount])
    
    useEffect(()=>{
      if(state.submitCount){
        const ourReq=Axios.CancelToken.source();
        async function fetchResults(){
          try {
            const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourReq.token })
            appDispatch({type: "login", data: response.data })
            appDispatch({type:'flashMessages' , value:`Congrats!! Welcome to your new account 💙`})
          } catch (error) {
              console.log('error !')
            }
          }
          fetchResults();
          return ()=> ourReq.cancel();
        } 
      },[state.submitCount]);

    // const inputRef=useRef(null);
    // useEffect(()=>{
    //   inputRef.current.focus();
    // },[]);

    function handleSubmit(e){
      e.preventDefault();
      dispatch({ type: "usernameImmediately", value: state.username.value })
      dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
      dispatch({ type: "emailImmediately", value: state.email.value })
      dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
      dispatch({ type: "passwordImmediately", value: state.password.value })
      dispatch({ type: "passwordAfterDelay", value: state.password.value })
      dispatch({ type: 'submitForm'});
    } 
  return (
    <Pages title="Welcome💜" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
              // ref={inputRef}
              required 
              id="username-register" 
              onChange={e=> dispatch({type:'usernameImmediately',value:e.target.value})}
              name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={400} classNames={'liveValidateMessage'} unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
              required 
              id="email-register" 
              onChange={e=> dispatch({type:'emailImmediately',value:e.target.value})}
              name="email" className="form-control" type="email" placeholder="you@example.com" autoComplete="off" />
              <CSSTransition in={state.email.hasErrors} timeout={400} classNames={'liveValidateMessage'} unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input 
              required
              id="password-register" 
              onChange={e=> dispatch({type:'passwordImmediately',value:e.target.value})}
              name="password" className="form-control" type="password" placeholder="Create a password" />
              <CSSTransition in={state.password.hasErrors} timeout={500} classNames={'liveValidateMessage'} unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </Pages>
  )
}

export default HomeGuest
