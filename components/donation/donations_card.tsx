'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const DonationCard = (props: any) => {

  const {push} = useRouter();

  const handleClick1 = ()=>{
    push(`/donate?campaign=${props.id}`);
  }


  return (
    <div>
    <div className="relative flex w-[400px] flex-col rounded-xl bg-[#f7f0cc] bg-clip-border text-gray-700 transition-all shadow-md hover:scale-105 focus:scale-105 hover:bg-[#fff1ad]">
      <div className="relative mx-4 mt-4 h-[300px] rounded-xl bg-white bg-clip-border text-gray-700">
        <Image
        alt="pic"
        fill
        src={props.images}
        className='rounded-lg'
        />
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
            {props.hash}
          </p>
        </div>
        <p className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75" style={{ maxHeight: '5em', overflow: 'hidden' }}>
          {props.desc}
        </p>


      </div>
      <div className="p-6 pt-0 flex flex-row gap-3 w-full justify-center items-center">
        <Button
          onClick={handleClick1}
          type="button"
          className='px-10'
          variant={'destructive'}
        >
          Donate Now
        </Button>
        <Button variant={'outline'} className='text-white'>
          Target : {props.amount}
        </Button>
      </div>
      </div>
  </div>
  )
}

export default DonationCard