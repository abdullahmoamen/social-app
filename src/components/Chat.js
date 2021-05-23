import React,{useContext,useEffect,useRef} from 'react';
import StateContext from './../StateContext';
import DispatchContext from './../DispatchContext';
import {useImmer} from 'use-immer';
import io from 'socket.io-client';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

function Chat() {
    const socket =useRef(null);
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const inputRef =useRef(null);
    const chatLog = useRef(null);
    const [state,setState]=useImmer({
        fieldValue:'',
        chatMessages:[],
    })

    useEffect(() =>{
        if(appState.isChatOpen){
            inputRef.current.focus()
            appDispatch({type:'clearUnreadChatCount'})
        }
    },[appState.isChatOpen])

    useEffect(() =>{
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
        if(state.chatMessages.length && !appState.isChatOpen){
            appDispatch({type:'incrementUnreadChatCount'})
        }
    },[state.chatMessages])

    useEffect(() =>{
        socket.current =io(process.env.BACKENDURL ||'https://backend-social-app1.herokuapp.com')
        socket.current.on('chatFromServer' , message=>{
            setState(draft=>{
                draft.chatMessages.push(message);
            }) 
        })
        return ()=> socket.current.disconnect(); //clean up
    },[])

    function handleFieldChange(e){
        const value = e.target.value
        setState(draft=>{
            draft.fieldValue = value
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        // send messages to chat server
        socket.current.emit('chatFromBrowser',{message:state.fieldValue,token: appState.user.token,chat:appState.user.chat})
        {state.fieldValue != '' && state.fieldValue !=' ' && state.fieldValue !='  '&&
        setState(draft=>{
            draft.chatMessages.push({message: draft.fieldValue,username:appState.user.username,avatar:appState.user.avatar,chat:appState.user.chat});
            draft.fieldValue = '';
        })}
    }
    return (
        <div id="chat-wrapper" className={'chat-wrapper shadow border-top border-left border-right ' + (appState.isChatOpen ? 'chat-wrapper--is-visible':'')}>
            <div className="chat-title-bar bg-primary">
                Chat
                <span className="chat-title-bar-close" onClick={()=>appDispatch({type:'closeChat'})}>
                    <i className="fas fa-times-circle"></i>
                </span>
        </div>
        <div id="chat" className="chat-log" ref={chatLog}>
            {state.chatMessages.map((message,index) =>{
                if(message.username == appState.user.username){
                    return(
                        <div className="chat-self" key={index}>
                            <div className="chat-message">
                                <div className="chat-message-inner">{message.message}</div>
                            </div>
                        <img className="chat-avatar avatar-tiny" src={message.avatar} />
                        </div>
                    )
                }
                return(
                    <div key={index} className="chat-other">
                        <Link to={`/profile/${message.username}`}>
                        <img className="avatar-tiny" src={message.avatar} />
                    </Link>
                    <div className="chat-message">
                        <div className="chat-message-inner">
                        <Link to={`/profile/${message.username}`}>
                            <strong>{message.username}: </strong>
                        </Link>
                        {message.message}
                    </div>
                    </div>
                </div>
                )
            })}
        </div>
        <form 
            onSubmit={handleSubmit}
            id="chatForm" className="chat-form border-top">
            <input
            required
            value={state.fieldValue} 
            onChange={handleFieldChange}
            ref={inputRef} type="text" className="chat-field" id="chatField" 
            placeholder="Type a message…" autoComplete="off" autoFocus/>
            <button onClick={handleSubmit} className="chat-button btn-info" data-tip='Send' data-for='send'><i className="far fa-paper-plane"></i> </button>
            <ReactTooltip id='send' className='custom-tooltip'/>
        </form>
    </div>
    )
}

export default Chat
