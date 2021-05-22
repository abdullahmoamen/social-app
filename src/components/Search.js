import React,{useContext,useEffect} from 'react';
import DispatchContext from '../DispatchContext';
import {useImmer} from 'use-immer';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Post from './Post'

function Search() {
const appDispatch = useContext(DispatchContext);

const [state,setState]=useImmer({
  searchTerm:'',
  results:[],
  show:'neither',
  requestCounter:0,
})

useEffect(()=>{
  if(state.searchTerm.trim()){
    setState(draft=>{
      draft.show='loading';
    })
    const delay= setTimeout(()=>{
      setState(draft=>{
        draft.requestCounter++
      })
      },700)
      return()=> clearTimeout(delay)
  }else{
    setState(draft=>{
      draft.show='neither';
    })
  }
},[state.searchTerm]);

useEffect(()=>{
  if(state.requestCounter){
    const ourReq=Axios.CancelToken.source();
    async function fetchResults(){
      try {
        const response =await Axios.post('/search',{searchTerm:state.searchTerm},{cancelToken:ourReq.token});
        setState(draft=>{
          draft.results=response.data;
          draft.show='results';
        });
      } catch (error) {
        console.log('error !')
      }
    }
    fetchResults();
    return ()=>ourReq.cancel();
  } 
},[state.requestCounter])

useEffect(() =>{
    document.addEventListener('keyup',searchKeyHandler);
    return ()=> document.removeEventListener('keyup',searchKeyHandler);
},[])

function searchKeyHandler(e){
    if(e.keyCode == 27){
        appDispatch({type:'closeSearch'})
    }
}


function closeHandler(e){
    e.preventDefault();
    appDispatch({type: 'closeSearch'})
}

function handleInput(e){
  const value = e.target.value;
  setState(draft=>{
    draft.searchTerm=value;
  })
}

    return (
        <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input 
          onChange={handleInput}
          autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />

          <span onClick={closeHandler} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={'circle-loader ' + (state.show == 'loading' ? 'circle-loader--visible' :'')}></div> 
            <div className={'live-search-results ' + (state.show == 'results' ? 'live-search-results--visible' :'')}>
              {Boolean(state.results.length) && (
                <div className="list-group shadow-sm">
                <div className="list-group-item active"><strong>Search Results</strong> ({state.results.length} {state.results.length>1 ? 'items': 'item' } )found</div>
                  {state.results.map(post=>{
                  return <Post post={post} key={post._id}
                  onClick={()=>appDispatch({type:'closeSearch'})}
                  />
                  })}
            </div>
            )}
            {!Boolean(state.results.length)&& <p className="text-center alert-danger alert shadow-sm">Whoops !, We couldn't find any results for this search 🙄</p>}
          </div>
        </div>
      </div>
    </>
    )
}

export default Search
