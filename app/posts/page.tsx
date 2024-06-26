'use client'

import React from 'react';

import useGetPosts from '../../hooks/useGetPosts';
import DonationCard from '@/components/donation/donations_card';

const PostPage = () => {
    const {isLoading , posts} = useGetPosts();

    return (
        <div className='popular flex flex-col items-center gap-[30px] h-[90vh] pt-30'>
            <h1 className='text-[30px] font-semibold'>Top Raisers</h1>
            <div className='mt-[50px] grid lg:grid-cols-3 gap-[30px] md:grid-cols-2 sm:grid-cols-1 px-28'>
                {posts.map((item: any, index:any) => (
                    <DonationCard key={index} hash={item.campaign_name} amount={item.amount} title={item.post_type} images={"https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} desc={item.campaign_description} id={item.fund_id}/>
                ))}
            </div>
        </div>
    );
};

export default PostPage;
