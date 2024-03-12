import React from 'react'


const ItemCard = (props) => {

  return (
        <div class="relative flex w-85 flex-col rounded-xl bg-white bg-clip-border text-gray-700 transition-all shadow-md hover:scale-105 focus:scale-105">
        <div class="relative mx-4 mt-4 h-90 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700">
            <img
            src={props.images}
            class="h-full w-full object-cover"
            />
        </div>
        <div class="p-6">
            <div class="mb-2 flex items-center justify-between">
            <p class="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
                {props.title}
            </p>
            </div>
            <p class="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75">
            {props.desc}
            </p>
        </div>
        <div class="p-6 pt-0">
            <button
            class="block w-full select-none rounded-lg bg-blue-700 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            >
            Add to Cart
            </button>
        </div>
        </div>
  )
}

export default ItemCard