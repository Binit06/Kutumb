'use client'

import React, { useEffect, useState } from 'react'
import FeedPost from "./FeedPost"
import useGetPosts from '../../hooks/useGetPosts';

const FeedPostsAll = () => {

    const {isLoading , posts} = useGetPosts();

  return (
        <div className='flex flex-col items-center gap-[10px] h-[90vh] mt-20'>
            <h1 className='text-[30px] font-semibold'>POST</h1>
            <div className='mt-[50px] grid grid-cols-4 gap-[70px]'>
                {posts.map((item, i) => (
                    <FeedPost key={i} title={item.post_type} images={item.post_images} desc={item.post_content}/>
                ))}
            </div>
        </div>
  )
}

export default FeedPostsAll