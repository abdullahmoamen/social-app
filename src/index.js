import React,{useEffect,Suspense} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router , Switch ,Route} from "react-router-dom";
import Axios from "axios";
import {useImmerReducer} from "use-immer";
import {CSSTransition} from "react-transition-group";
Axios.defaults.baseURL=process.env.BACKENDURL || 'https://backend-social-app1.herokuapp.com';

// My Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import Terms from "./components/Terms";
import Home from "./components/Home";
const CreatePost =React.lazy(()=>import('./components/CreatePost'));
const ViewSinglePost =React.lazy(()=>import('./components/ViewSinglePost'));
const Search =React.lazy(()=>import('./components/Search'));
const Chat =React.lazy(()=>import('./components/Chat'));
import FlashMessages from './components/FlashMessages';
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Loader from "./components/Loader";

function Index() {
  const initialState={
    loggedIn:Boolean(localStorage.getItem('token')),
    flashMessages: [],
    user:{
      token:localStorage.getItem('token'),
      username:localStorage.getItem('username'),
      avatar:localStorage.getItem('avatar'),
    },
    isSearchOpen:false,
    isChatOpen:false,
    unreadChatCount:0,
  }

  function ourReducer(draft,action){
    switch(action.type){
      case 'login':
        draft.loggedIn=true;
        draft.user=action.data;
        break;

      case 'logout':
        draft.loggedIn=false;
        break;

      case 'flashMessages':
        draft.flashMessages.push({message:action.value, template:action.template})
        break;

      case 'openSearch':
        draft.isSearchOpen=true;
        break;

      case 'closeSearch':
        draft.isSearchOpen=false;
        break;

      case 'toggleChat':
        draft.isChatOpen =! draft.isChatOpen;
        break;

      case 'closeChat':
        draft.isChatOpen =false;
        break;

      case 'incrementUnreadChatCount':
        draft.unreadChatCount ++
        break;

      case 'clearUnreadChatCount':
        draft.unreadChatCount =0
        break;
    }
  }

  const [state,dispatch] = useImmerReducer(ourReducer,initialState);

  useEffect(()=>{
    if(state.loggedIn){
      localStorage.setItem('token',state.user.token);
      localStorage.setItem('username',state.user.username);
      localStorage.setItem('avatar',state.user.avatar);
    }else{
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('avatar');
    }
  },[state.loggedIn])

  // check token expired 
  useEffect(()=>{
    if(state.loggedIn){
      const ourReq=Axios.CancelToken.source();
      async function fetchResults(){
        try {
          const response =await Axios.post('/checkToken',{token:state.user.token},{cancelToken:ourReq.token});
          if(!response.data){
            dispatch({type:'logout'});
            dispatch({ type: "flashMessages", template: "danger", value: "Your session has expired. Please log in again.💻" })
          }
        } catch (error) {
          console.log('error !')
        }
      }
      fetchResults();
      return ()=>ourReq.cancel();
    } 
  },[])

  return (
    <StateContext.Provider value={state}> 
      <DispatchContext.Provider value={dispatch}>

    <Router>
      <FlashMessages msgs={state.flashMessages}/>
      <Header />
      <Suspense fallback={<Loader/>}>

      <Switch>
        
        <Route Route path="/profile/:username">
          <Profile/>
        </Route>

        <Route exact path="/">
          {state.loggedIn ? <Home /> : <HomeGuest />}
        </Route>

        <Route  path="/about-us">
          <AboutUs />
        </Route>

        <Route path="/create-post">
          <CreatePost/>
        </Route>

        <Route path="/post/:id/edit" exact>
          <EditPost />
        </Route>

        <Route path="/post/:id" exact>
          <ViewSinglePost />
        </Route>

        <Route path="/terms">
          <Terms />
        </Route>

      <Route>
        <NotFound/>
      </Route>

      </Switch>
      </Suspense>
      <CSSTransition timeout={400} classNames='search-overlay' in={state.isSearchOpen} unmountOnExit>
        <div className="search-overlay">
          <Suspense fallback=''>
            <Search />
          </Suspense>
        </div>
      </CSSTransition>
      <Suspense fallback=''>
        {state.loggedIn && <Chat /> }
      </Suspense>
      <Footer />
      </Router>
        </DispatchContext.Provider>
      </StateContext.Provider>
  )
}

ReactDOM.render(<Index />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
