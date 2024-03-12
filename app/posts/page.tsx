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
                    <Donations_card key={index} hash={item.campaign_name} title={item.post_type} images={"https://images.unsplash.com/photo-1542627088-6603b66e5c54?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} desc={item.campaign_description} requiredamount = {item.amount}/>
                ))}
            </div>
        </div>
    );
};

export default page;
