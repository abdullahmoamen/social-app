import React,{useEffect,useState} from 'react';
import Page from './Pages';
import {useParams,Link} from 'react-router-dom';
import Axios from 'axios';
import Loader from './Loader';
import Post from './Post';


function ProfilePosts() {
    const {username}=useParams();
    const [isLoading,setIsLoading]=useState(true);
    const [posts,setPosts]=useState([]);

    useEffect(() =>{
        const ourRequest = Axios.CancelToken.source();
        async function fetchPosts() {
            try {
                const response=await Axios.get(`/profile/${username}/posts`,{cancelToken: ourRequest.token});
                setPosts(response.data)
                setIsLoading(false);
                // console.log(response.data)
            } catch (error) {
                console.log('there is an error')
            }
        }
        fetchPosts();
        return()=>{
            ourRequest.cancel()
        }
    },[username])

    if(isLoading){
        return <Loader/>
    }

    return (
        <Page title="posts">
    <div className="list-group">
        {posts.map(post =>{
                return <Post noAuthor={true} post={post} key={post._id} />
        })}
    </div>
    </Page>
    )
}

export default ProfilePosts
