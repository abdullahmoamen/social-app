import React,{useEffect,useContext} from 'react';
import Page from './Pages';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { useImmer } from "use-immer";
import Loader from './Loader';
import Axios from 'axios';
import Post from './Post';

function Home() {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const [state,setState]=useImmer({
        isLoading: true,
        feed:[]
    })

useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    
    async function fetchData() {
    try {
        const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState(draft => {
        draft.isLoading=false;
        draft.feed=response.data;
        })
    } catch (e) {
        console.log("There was a problem.")
    }
    }
    fetchData()
    return () => {
    ourRequest.cancel()
    }
}, [])

    if(state.isLoading){
        return <Loader />
    }
    
    return (
        <Page title="Your feed">
            {state.feed.length>0 &&(
                <>
                    <h2 className="text-center mb-5">
                    the latest posts 
                    from the people you follow.
                    </h2>
                    <div className="list-group">
                    {state.feed.map(post=>{
                        return <Post post={post} key={post._id}/>
                })}
                    </div>
                </>
            )}
            {state.feed.length == 0 && (
                <>
                    <h2 className="text-center">Hello <strong> {appState.user.username} </strong>, your feed is empty.</h2>
                    <p className="lead text-muted text-center">Your feed displays the latest posts 
                    from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s 
                    okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content 
                    written by people with similar interests and then follow them.</p>
                    </>
                )
            }
        </Page>
    )
}

export default Home
