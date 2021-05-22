import React ,{useEffect,useState,useContext}from 'react'
import Page from './Pages';
import { Link ,useParams,withRouter} from 'react-router-dom';
import Axios from 'axios';
import Loader from './Loader';
import { useImmerReducer } from 'use-immer';
import StateContext from './../StateContext';
import DispatchContext from '../DispatchContext';
import NotFound from './NotFound';

function EditPost(props) {
    const appState =useContext(StateContext);
    const appDispatch =useContext(DispatchContext);
    const originalState ={
        title:{
            value: '',
            hasError: false,
            message: '',
        },
        body:{
            value: '',
            hasError: false,
            message: '',
        },
        isFetching: true,
        isSaving: false,
        id:useParams().id,
        sendCount: 0,
        notFound:false,
    }

function ourReducer(draft,action){
        switch(action.type){
            case 'fetchComplete':
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching =false;
                break;
            case 'titleChange':
                draft.title.value = action.value;
                draft.title.hasError=false;
                break;
            case 'bodyChange':
                draft.body.value = action.value;
                draft.body.hasError=false;
                break;
            case 'submitRequest':
                if (!draft.title.hasError && !draft.body.hasError) { 
                    draft.sendCount++;
                }
                break;
            case "saveRequestStarted":
                draft.isSaving= true;
                break;
            case 'saveRequestFinished':
                draft.isSaving= false;
                break;
            case 'titleRules':
                // لو مش فاضي 
                if(!action.value.trim()){
                    draft.title.hasError=true;
                    draft.title.message='You Must Add a Title! 🤫'
                }
                break;
            case 'bodyRules' :
                if(!action.value.trim()){
                    draft.body.hasError=true;
                    draft.body.message='You Must Add A Body Content ! 🤨'
                }
                break;
            case 'notFound':
                draft.notFound=true;
                break;
        }
    }
    const [state,dispatch]=useImmerReducer(ourReducer,originalState)

    useEffect(() =>{
        const ourRequest = Axios.CancelToken.source();
        async function fetchPost(){
            try {
                const response=await Axios.get(`/post/${state.id}`,{cancelToken: ourRequest.token});
                if(response.data){
                dispatch({type:'fetchComplete',value:response.data});
                if(appState.user.username != response.data.author.username){
                    appDispatch({type:'flashMessages',value:`you don't have permission to edit this post 😒`});
                    //redirect 
                    props.history.push('/');
                }
                }
                else{
                    dispatch({type:'notFound'})
                }
            } catch (error) {
                console.log('error in loading post !');
            }
        }
        fetchPost();
        return()=>{
            ourRequest.cancel()
        }
    },[]);

    useEffect(() =>{
        if(state.sendCount){
            dispatch({type:'saveRequestStarted'})
            const ourRequest = Axios.CancelToken.source();
                async function fetchPost(){
                    try {
                        const response=await Axios.post(`/post/${state.id}/edit`,{title:state.title.value,body:state.body.value,token:appState.user.token},{cancelToken: ourRequest.token});
                        dispatch({type:'saveRequestFinished'});
                        appDispatch({type:'flashMessages' , value:'post was updated. 😎'})
                    }catch (error) {
                        console.log('error in loading post !');
                        }
                            }
        fetchPost();
        return()=>{
            ourRequest.cancel()
        }
        }
    },[state.sendCount]);

    if(state.notFound){
        return (
            <Page title="not found">
                <NotFound /> 
            </Page>
        )
    }

    if(state.isFetching){
        return(
        <Page title=''>
            <Loader/>
        </Page>
        )
    }

    const submitHandler=(e)=>{
        e.preventDefault();
        dispatch({type:'submitRequest'});
        dispatch({type:'titleRules',value:state.title.value});
        dispatch({type:'bodyRules',value:state.body.value});
    }

    return (
        <Page title='Edit post'>
            <Link to={`/post/${state.id}`} className='font-weight-bolder'> &laquo;Back To Post</Link>
        <form className='mt-3' onSubmit={submitHandler}>
            <div className="form-group">
            <label htmlFor="post-title" className="text-muted mb-1">
                <small>Title</small>
            </label>
            <input
            onBlur={e=>dispatch({type:'titleRules' ,value:e.target.value})}
            onChange={e=> dispatch({type:'titleChange',value:e.target.value})}
            value={state.title.value}
            autoFocus name="title" id="post-title" 
            className="form-control form-control-lg form-control-title" 
            type="text" placeholder="" autoComplete="off" />
            {state.title.hasError&&
            <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
            }
            </div>
    
            <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
                <small>Body Content</small>
            </label>
            <textarea
            onBlur={e=>dispatch({type:'bodyRules' ,value:e.target.value})}
            onChange={(e)=> dispatch({type:'bodyChange',value:e.target.value})}
            value={state.body.value}
            name="body" id="post-body" className="body-content tall-textarea form-control" 
            type="text"/>
            {state.body.hasError &&
            <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
            </div>
    
            <button disabled={state.isSaving} className="btn btn-primary">Save Updates</button>
        </form>
            </Page>
    )
}

export default withRouter(EditPost)
