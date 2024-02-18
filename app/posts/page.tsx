'use client'

import React, { useEffect, useState } from 'react';
import Donations_card from "../../components/donation/donations_card"
import useGetPosts from '../../hooks/useGetPosts';

const page = () => {

    const {isLoading , posts} = useGetPosts();

    return (
        <div className='popular flex flex-col items-center gap-[30px] h-[90vh] pt-30'>
            <h1 className='text-[30px] font-semibold'>Top Raisers</h1>
            <div className='mt-[50px] grid lg:grid-cols-3 gap-[30px] md:grid-cols-2 sm:grid-cols-1 px-28'>
                {posts.map((item: any, index:any) => (
                    <Donations_card key={index} hash={item.hashtags?.[0]} title={item.post_type} images={item.post_images?.[0]} desc={item.post_content}/>
                ))}
            </div>
        </div>
    );
};

export default page;
