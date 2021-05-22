import React , {useState,useContext} from "react";
import HeaderLogOut from './HeaderLogOut';
import HeaderLogIn from './HeaderLogIn';
import {Link} from 'react-router-dom';
import StateContext from "../StateContext";


function Header(props) {
const appState=useContext(StateContext)

  return (
    <header className="header-bar bg-dark mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            SocialApp
          </Link>
        </h4>
        {appState.loggedIn ? <HeaderLogIn /> : <HeaderLogOut />}
      </div>
    </header>
  )
}

export default Header
