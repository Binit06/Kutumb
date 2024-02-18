import { useRouter } from "next/navigation";
import img from "../../public/child.jpg"
import Image from "next/image"

const Card = () => {

  const {push} = useRouter();

  const handleClick1 = ()=>{
    push('/posts');
  }

  const handleClick2 = ()=>{
    push('/donations');
  }

  return (
    <div>
      <div className="relative flex w-60 flex-col rounded-xl bg-[#f7f0cc] bg-clip-border text-gray-700 transition-all shadow-md hover:bg-[#fff1ad] hover:scale-105 focus:scale-105">
        <div className="relative mx-4 mt-4 h-90 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700">
          <Image
          alt="pic"
            src={img}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased">
              The New Age Kids
            </p>
          </div>
          <p className="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75">
            Providing relieve funds to the manipur flood affetcted areas
          </p>
        </div>
        <div className="p-6 pt-0 flex flex-row gap-3">
          <button
            className="block w-[50%] select-none rounded-lg bg-[#0F999B] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleClick2}
          >
            Donate Now
          </button>
          <button
            className="block w-[50%] select-none rounded-lg bg-[#0F999B] py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleClick1}
          >
            See Post
          </button>
        </div>
        <div>
          <div className="ml-6 text-lg mb-1">
          <p>Rs 2,90,899 / 10,00,000</p>
          </div>
        <div className="w-[80%] h-2 bg-blue-200 rounded-full mb-2 items-center ml-6">
                <div className="w-[30%] h-full text-center text-xs text-white bg-[#0F999B] rounded-full">
                </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Card