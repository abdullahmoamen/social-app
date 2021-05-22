import React,{useState,useContext,useRef,useEffect} from 'react';
import Axios from 'axios';
import '../main.css';
import DispatchContext from '../DispatchContext';

function HeaderLogOut() {

    const appDispatch = useContext(DispatchContext);
    const [username,setUserName]=useState();
    const [password,setPassword]=useState();

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = await Axios.post('/login',{username,password});
            if(response.data){
                appDispatch({type: 'login' , data: response.data});
                appDispatch({type: 'flashMessages',value:'Successfully Logged In ❤️'}); 
            }else{
                appDispatch({type: 'flashMessages',value:'Incorrect username || password 🙄'});
                console.log('error!')
            }
        }catch(e){
            console.log('error')
        }
    }

    const inputRef=useRef(null);
    useEffect(()=>{
        inputRef.current.focus();
    },[])

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                <input
                ref={inputRef}
                required
                name="username" 
                onChange={e=>setUserName(e.target.value)}
                className="form-control form-control-sm input-dark" 
                type="text" placeholder="Username..." autoComplete="off" />
            </div>
            <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                <input 
                required
                name="password" 
                onChange={e=>setPassword(e.target.value)}
                className="form-control form-control-sm input-dark" 
                type="password" placeholder="Password..." />
            </div>
            <div className="col-md-auto">
                <button className="btn btn-success btn-sm">Sign In</button>
            </div>
            </div>
        </form>
    )
}

export default HeaderLogOut
