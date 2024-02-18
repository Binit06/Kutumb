import React from 'react'
import { TypeAnimation } from "react-type-animation";
import Card from '../Post-item/Card';
import Card2 from '../Post-item/Card2';


const Hero = () => {
  return (
    <div className='text-black flex flex-row min-h-full min-w-full bg-gradient-to-r  from-[#ffea84] to-[#f7f0cc]'>
        <div className='h-[100vh] flex flex-row'>
            <div className='flex flex-col pl-40 pt-28'>
                <p className='ml-[5px] text-lg font-semibold'>Healing Hearts ,Healing Souls</p>
                <h1 className="text-black text-3xl sm:text-5xl lg:text-6xl font-bold">
                    <span className="text-transparent bg-clip-text bg-black pb-10">
                    Being Part Of  , {" "}
                    </span>
                    <br></br>
                    <TypeAnimation
                        style={{ whiteSpace: 'pre-line', height: '195px', display: 'block' }}
                        sequence={[
                            `Founding Aids\nHelping in Wars!`,
                            1000,
                            '',
                        ]}
                        repeat={Infinity}
                        />
                </h1>
                <div className='flex flex-col gap-2 ml-[3px]'>
                <p className='text-balance '>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
                <p>
                Ipsam itaque hic aperiam dignissimos doloribus! Voluptatum
                </p>
                <p>
                llam placeat voluptatem nulla repudiandae qui vitae enim
                </p>
                </div>
            </div>
            <div className='bg-gradient-to-t from-[#0F999B] h-[70vh] w-[30vw] absolute right-0 '>
            </div>
            <div className='top-40 absolute right-10'>
                <Card/>
            </div>
            <div className='top-40 absolute right-80 mt-32 mr-28 overflow-hidden'>
                <Card2/>
            </div>
            <div className='bg-[#0F999B] h-[20vh] w-[90vh] rounded-tr-full absolute bottom-0'>
                <div className='flex flex-row gap-[100px] pl-20 mt-11'>
                    <p className='font-semibold text-white text-[30px]'>145+</p>
                    <p className='font-semibold text-white text-[30px]'>1200+</p>
                    <p className='font-semibold text-white text-[30px]'>30+</p>
                </div>
                <div className='flex flex-row gap-[70px] pl-20'>
                    <p className='text-white text-[20px]'>Campaigns</p>
                    <p className='text-white text-[20px]'>Volunteers</p>
                    <p className='text-white text-[20px]'>Countries</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero