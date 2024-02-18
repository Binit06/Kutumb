
import { useEffect, useState } from 'react'
import useFeedStore from "../store/FeedStore.js"
import { db } from "../src/firebase/FirebaseConfig.ts"
import { collection, getDocs, query, where } from 'firebase/firestore'

const useGetPosts = ()=>{
    const [isLoading , setIsLoading] = useState(true);
    // const authUser = useAuthStore((state) => state.user);
    const {posts,setPosts} = useFeedStore();

    useEffect(()=>{
      const getFeedPosts = async()=>{
        setIsLoading(true);
        // if(authUser.following.length === 0){
        //   setIsLoading(false)
        //   setPosts([])
        //   return;
        // }

        const get = query(collection(db,"post_data"))

        try {
          
          const Snap = await getDocs(get);
          const Feed = [];

          Snap.forEach((doc)=>{
            Feed.push({id:doc.id , ...doc.data()})
          })
          setPosts(Feed);

        } catch (error) {
          console.log(error);
        }finally{
            setIsLoading(false)
        }
      };
      getFeedPosts()
    },[setPosts])

    return {isLoading , posts}

}

export default useGetPosts;