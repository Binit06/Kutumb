"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { app } from '@/src/firebase/FirebaseConfig';
import { v4 as uuid} from 'uuid'
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function CampaignPage() {
    const [selectedCause, setSelectedCause] = useState('Animal');
    const { user } = useUser();
    const [formData, setFormData] = useState({
        cause: 'Animal',
        name: '',
        email: '',
        phoneNumber: '',
        benefit: 'MySelf',
        other_individual: '',
        other_number: '',
        ngo_name: '',
        state: '',
        district: '',
        campaign_name: '',
        campaign_description: '',
        description: '',
        amount: 0,
        user_id: '',
        fund_id: uuid(),
        timestampz: new Date(),
    });

    const handleCauseChange = (value: any) => {
        setFormData(prevData => ({
            ...prevData,
            cause: value
        }));
        setSelectedCause(value);
    };
    const handleBenefitChange = (value: any) => {
        setFormData(prevData => ({
            ...prevData,
            benefit: value
        }));
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const { toast } = useToast()
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };
      
      const router = useRouter();
      const handleSubmit = async () => {
        
        setFormData(prevData => ({
            ...prevData,
            timestampz: new Date()
        }));
        console.log(formData);
        if(!user?.id){
            console.log("No User Id Found")
            return
        }
    
        const db = getFirestore(app);
        try {
            // Check if formData contains any undefined values
            if (Object.values(formData).some(value => value === undefined)) {
                console.log('Form data contains undefined values');
                return;
            }
    
            const userDataCollection = collection(db, 'products');
            await addDoc(userDataCollection, formData);
            toast({variant: 'default', title: 'Campaign Added Succesfully', description: 'Please navigate to posts section to see your post', action: <ToastAction altText='Return Home' onClick={() => {router.push('/')}}>Return Home</ToastAction>})
        } catch (e) {
            console.log(e);
            toast({variant: 'default', title: 'Campaign Addtion Failed', description: 'Please try again', action: <ToastAction altText='Try Again' onClick={handleSubmit}>Try Again</ToastAction>})
        }
    };
    
    

    const handlePageOneSubmit = () => {
        console.log(formData)
        if(formData.email !== '' && formData.name !== '' && formData.phoneNumber !== '' && formData.cause !== ''){
            setPage(page + 1)
        }
    }

    const handlePageTwoSubmit = () => {
        if(formData.state !== '' && formData.district !== ''){
            setPage(page + 1)
        }
    }

    const [page, setPage] = useState(1);

    const handleAutoFill = () => {
        setFormData(prevData => ({
            ...prevData,
            email: user?.emailAddresses[0].emailAddress ?? '',
            name: user?.fullName ?? '',
            phoneNumber: user?.phoneNumbers[0].phoneNumber ?? '',
            user_id: user?.id ?? ''
        }));
    };
    

    return (
        <div className="w-full h-screen flex justify-center items-center bg-[#e9f6fc]">
            <IoIosArrowBack size={30} color='black' className={`${page === 1 ? "hidden" : ""} cursor-pointer`} onClick={() => { setPage(page - 1) }} />
            <div className={`max-w-[30rem] w-full bg-white shadow-md rounded-3xl py-5 px-8 ${page === 1 ? "" : "hidden"}`}>
                <div className="font-normal text-2xl text-center mb-4 text-black">Basic Details</div>
                <div className="text-lg text-center mb-4 text-black">The fund is being raised for <span className="font-bold">{selectedCause}</span> cause</div>
                <div className="flex justify-center">
                    <div className="w-[27rem] border-2 shadow-neutral-200 shadow-sm py-4 rounded-md px-3 flex items-center">
                        <div className="text-center py-2 mr-2 rounded-sm text-black">Choose Cause</div>
                        <div className="border-1 border-black flex-1 text-center ml-2 rounded-sm bg-white">
                            <Select onValueChange={(value) => { handleCauseChange(value) }}>
                                <SelectTrigger><SelectValue placeholder={selectedCause}></SelectValue></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Animal">Animal</SelectItem>
                                    <SelectItem value="Children">Children</SelectItem>
                                    <SelectItem value="Elderly">Elderly</SelectItem>
                                    <SelectItem value="Faith">Faith</SelectItem>
                                    <SelectItem value="Disability">Disability</SelectItem>
                                    <SelectItem value="Hunger">Hunger</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Women">Women</SelectItem>
                                    <SelectItem value="Transgender">Transgender</SelectItem>
                                    <SelectItem value="DisasterRelief">Disaster Relief</SelectItem>
                                    <SelectItem value="Covid19">Covid 19</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className='mt-2 w-full bg-white'>
                    <Button variant={'secondary'} onClick={handleAutoFill} className='text-white'>Auto Fill</Button>
                </div>
                <div className='w-full mt-2 flex-col gap-3'>
                    <div className='flex-1 px-1 text-black'>Your name</div>
                    <Input name="name" placeholder='Enter your Name' required autoFocus={false} className='mt-1 bg-white text-black' value={formData.name} onChange={handleChange}/>
                </div>
                <div className='w-full mt-2 flex-col gap-3'>
                    <div className='flex-1 px-1 text-black'>Your email</div>
                    <Input name="email" placeholder='Enter your E-Mail' required autoFocus={false} className='mt-1 bg-white text-black' value={formData.email} onChange={handleChange} />
                </div>
                <div className='w-full mt-5 flex-col gap-3'>
                    <div className='flex-1 px-1 text-black'>Phone Number</div>
                    <Input name="phoneNumber" placeholder='Enter your Mobile Number' required autoFocus={false} className='mt-1 bg-white text-black' value={formData.phoneNumber} onChange={handleChange} />
                </div>
                <Button variant={'default'} className='w-full mt-4' onClick={handlePageOneSubmit}>Continue</Button>
            </div>
            <div className={`max-w-[30rem] w-full bg-white shadow-md rounded-3xl py-5 px-8 ${page === 2 ? "" : "hidden"}`}>
                <div className="font-normal text-2xl text-center mb-4 text-black">NGO / Individual Details</div>
                <div className='w-full mt-2 flex-col gap-3'>
                    <div className='flex-1 px-1 text-black'>The fundraiser will benefit</div>
                    <Select onValueChange={(value) => { handleBenefitChange(value) }}>
                        <SelectTrigger><SelectValue placeholder={formData.benefit}></SelectValue></SelectTrigger>
                        <SelectContent>
                            <SelectItem value='MySelf'>My Self</SelectItem>
                            <SelectItem value='Individual_Other_Than_Self'>Individual Other Than Self</SelectItem>
                            <SelectItem value='NGO'>NGO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {formData.benefit === 'NGO' ? (
                    <div className='w-full mt-2 flex-col gap-3'>
                        <div className='flex-1 px-1 text-black'>Individual name</div>
                        <Input name="ngo_name" placeholder='Enter NGO Name' required autoFocus={false} className='mt-1' value={formData.ngo_name} onChange={handleChange} />
                    </div>
                ) : formData.benefit === 'Individual_Other_Than_Self' ? (
                    <div>
                        <div className='w-full mt-2 flex-col gap-3'>
                            <div className='flex-1 px-1 text-black'>Individual name</div>
                            <Input name="other_individual" placeholder='Enter Name' required autoFocus={false} className='mt-1' value={formData.other_individual} onChange={handleChange} />
                        </div>
                        <div className='w-full mt-5 flex-col gap-3'>
                            <div className='flex-1 px-1 text-black'>Individuals Phone Number</div>
                            <Input name="other_number" placeholder='Enter Mobile Number' required autoFocus={false} className='mt-1' value={formData.other_number} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className='w-full mt-2 flex-col gap-3'>
                            <div className='flex-1 px-1 text-black'>Your name</div>
                            <Input name="name" placeholder='Enter your Name' required autoFocus={false} className='mt-1' value={formData.name} onChange={handleChange} />
                        </div>
                        <div className='w-full mt-5 flex-col gap-3'>
                            <div className='flex-1 px-1 text-black'>Phone Number</div>
                            <Input name="phoneNumber" placeholder='Enter your Mobile Number' required autoFocus={false} className='mt-1' value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                    </div>
                )}
                <div className='flex-1 px-1 mt-2 mb-1 text-black'>Location</div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px'}}>
                <Select onValueChange={(value) => {setFormData(prevData => ({ ...prevData, state: value }))}}>
                    <SelectTrigger><SelectValue placeholder='State'></SelectValue></SelectTrigger>
                    <SelectContent>
                        <SelectItem value='Maharashtra'>Maharashtra</SelectItem>
                        <SelectItem value='Gujarat'>Gujarat</SelectItem>
                        <SelectItem value='Andhra_Pradesh'>Andhra Pradesh</SelectItem>
                        <SelectItem value='Delhi'>Delhi</SelectItem>
                        <SelectItem value='Odisha'>Odisha</SelectItem>
                        <SelectItem value='Goa'>Goa</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => {setFormData(prevData => ({ ...prevData, district: value }))}}>
                    <SelectTrigger><SelectValue placeholder='District'></SelectValue></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Maharashtra</SelectLabel>
                            <SelectItem value='Pune'>Pune</SelectItem>
                        </SelectGroup>
                        <SelectItem value='Gandhinagar'>Gandhinagar</SelectItem>
                        <SelectItem value='Ongole'>Ongole</SelectItem>
                        <SelectItem value='New_Delhi'>New Selhi</SelectItem>
                        <SelectItem value='Bhadrak'>Bhadrak</SelectItem>
                        <SelectItem value='Panaji'>Panaji</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className='w-full mt-4'>
                    <Button variant={'default'} onClick={handlePageTwoSubmit} className='w-full'>Proceed</Button>
                </div>

            </div>
            <div className={`max-w-[30rem] w-full bg-white shadow-md rounded-3xl py-5 px-8 ${page === 3 ? "" : "hidden"}`}>
                <div className="font-normal text-2xl text-center mb-4 text-black">Campaign Details</div>
                <div className='w-full h-[20vh] px-10'>
                    <div className='w-full border-2 border-black rounded-md border-dashed h-full grid place-content-center'>
                        <Input type='file'/>
                    </div>
                </div>
                <div className='w-full mt-2 flex-col gap-3'>
                    <Input name="campaign_name" placeholder='Enter Campaign Name' required autoFocus={false} autoComplete='false' autoSave='false' className='mt-4 py-6 text-xl font-bold bg-white text-black focus:outline-0 border-b-2 border-black mb-6' value={formData.campaign_name} onChange={handleChange} />
                </div>
                <div className='w-full mt-2 flex-col gap-3 px-1'>
                    <div className='flex-1 text-black'>Campaign Description</div>
                    {/* <Input name="description" placeholder='Enter Campaign Description' required autoFocus={false} className='mt-1' value={formData.description} onChange={handleChange} multiple/> */}
                    <textarea
                    name="campaign_description"
                    placeholder="Enter Campaign Description"
                    required
                    autoFocus={false}
                    className="mt-1"
                    value={formData.campaign_description}
                    onChange={handleTextAreaChange}
                    rows={5} // Specify the number of rows (lines) you want
                    style={{width: '100%', padding: '10px', borderRadius: '10px', fontSize: '18px'}}
                    />

                </div>
                <div className='mt-2 w-full flex flex-col gap-1'>
                    <div className='text-black'>Fund Target</div>
                    <Input type='number' placeholder='Amount in Rupees' name='amount' className='text-lg font-bold tracking-widest py-6 bg-white text-black' onChange={handleChange} value={formData.amount}/>
                </div>
                <div className='w-full mt-4'>
                    <Button variant={'secondary'} className='w-full' onClick={handleSubmit}>Create Campaign</Button>
                </div>
            </div>
        </div>
    )
}
