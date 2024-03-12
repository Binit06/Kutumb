'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const donations_card = (props) => {

  const {push} = useRouter();

  const handleClick1 = ()=>{
    push('/donate');
  }


  return (
    <div>
    <div className="relative flex w-[400px] flex-col rounded-xl bg-[#f7f0cc] bg-clip-border text-gray-700 transition-all shadow-md hover:scale-105 focus:scale-105 hover:bg-[#fff1ad]">
      <div className="relative mx-4 mt-4 h-[300px] rounded-xl bg-white bg-clip-border text-gray-700">
        <Image
        fill
        alt="pic"
          src={props.images}
          className=""
        />
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
            {props.hash}
          </p>
        </div>
        <p className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75">
          {props.desc}
        </p>

      </div>
      <div className="p-6 pt-0 flex flex-row gap-3">
        <button
          onClick={handleClick1}
          className="block w-[50%] select-none rounded-lg bg-[#0F999B] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Donate Now
        </button>
        <button
          onClick={handleClick1}
          className="block w-[50%] select-none rounded-lg bg-[#0F999B] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Campaigns
        </button>
      </div>
      </div>
  </div>
  )
}

export default donations_card