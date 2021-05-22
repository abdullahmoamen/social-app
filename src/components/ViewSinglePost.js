import React ,{useEffect,useState,useContext}from 'react'
import Page from './Pages';
import { Link ,useParams,withRouter} from 'react-router-dom';
import Axios from 'axios';
import Loader from './Loader';
import ReactMarkdown from 'react-markdown';
import ReactTooltip from 'react-tooltip';
import NotFound from './NotFound';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function ViewSinglePost(props) {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const [isLoading,setIsLoading]=useState(true);
    const [post,setPost]=useState();
    const {id} =useParams();

    useEffect(() =>{
        const ourRequest = Axios.CancelToken.source();
        async function fetchPost(){
            try {
                const response=await Axios.get(`/post/${id}`,{cancelToken: ourRequest.token});
                setPost(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log('error in loading post !');
            }
        }
        fetchPost();
        return()=>{
            ourRequest.cancel()
        }
    },[id]); 

    if(!isLoading && !post){
        return <NotFound />
    }

    if(isLoading){
        return(
        <Page title=''>
            <Loader/>
        </Page>
        )
    }
    
    const date=new Date(post.createdDate);
    const dateFormatted= `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`

    function isOwner(){
        if(appState.loggedIn){
            return appState.user.username == post.author.username;
        }
        return false;
    }

    async function deleteHandler(){
        const confirmation = window.confirm('Are you sure you want to delete this post ? 🤔')
        if(confirmation){
            try {
                const response = await Axios({url: `/post/${id}`, data: {token: appState.user.token}, method: 'delete'})
                if(response.data == 'Success'){
                    // display flash message
                    appDispatch({type:'flashMessages',value:'Post successfully deleted. 👌'})
                    // back to profile
                    props.history.push(`/profile/${appState.user.username}`);
                }
            } catch (error) {
                console.log('error !')
            }
        }
    }

    return (
        <Page title={post.title}>
    <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() &&(
        <span className="pt-2">
        <Link to={`/post/${id}/edit`} data-tip='Edit' data-for='edit' className="text-primary mr-2" ><i className="fas fa-edit"></i></Link>
        <ReactTooltip id='edit' className='custom-tooltip'/>

        <Link to="/" onClick={deleteHandler} data-tip='Delete' data-for='delete' className="delete-post-button text-danger"><i className="fas fa-trash"></i></Link>
        <ReactTooltip id='delete' className='custom-tooltip'/> 
        </span>
        )}
    </div>
        <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> {dateFormatted}
        </p>

        <div className="body-content">
            <ReactMarkdown children={post.body}/>
        </div>
        </Page>
    )
}

export default withRouter(ViewSinglePost);
