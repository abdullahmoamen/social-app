import React,{useContext} from 'react';
import {Link} from 'react-router-dom'
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactTooltip from 'react-tooltip';

function HeaderLogIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout(){
    appDispatch({type:'logout'});
    appDispatch({ type: "flashMessages", template: "primary", value: "You have successfully logged out. 👍" });
  }

  function handleSearch(e){
    e.preventDefault();
    appDispatch({type:'openSearch'})
  }

    return (
        <div className="flex-row my-3 my-md-0">
          <Link data-tip='Search' data-for='search' onClick={handleSearch} to='/' className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
          </Link>
          <ReactTooltip id='search' className='custom-tooltip'/>

          {' '}<span onClick={()=>appDispatch({type:'toggleChat'})} data-tip='Chat' data-for='chat' className={'mr-2 header-chat-icon ' + (appState.unreadChatCount ? 'text-danger' :'text-white')}>
            <i className="fas fa-comment"></i>
            {appState.unreadChatCount ? <span className="chat-count-badge text-white" >{appState.unreadChatCount < 10 ? appState.unreadChatCount :'9+'}</span> : ''}
          </span>
          <ReactTooltip place='bottom' id='chat' className='custom-tooltip'/>

          {' '}<Link to={`/profile/${appState.user.username}`} className="mr-2" data-tip='My Profile' data-for='my profile'>
            <img className="small-header-avatar" src={appState.user.avatar} />
          </Link>
          <ReactTooltip place='bottom' id='my profile' className='custom-tooltip'/>
          
          {' '}<Link className="btn btn-sm btn-success mr-2" to="/create-post">{' '}
            Create Post <i className="fas fa-pen"></i>
          </Link>
          <Link to="/" onClick={handleLogout}
          className="btn btn-sm btn-danger">
            Sign Out <i className="fas fa-sign-out-alt"></i>
          </Link>
        </div>
    )
}

export default HeaderLogIn;
