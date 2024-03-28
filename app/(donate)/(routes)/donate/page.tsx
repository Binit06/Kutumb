"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, getFirestore, query, where, getDocs } from "firebase/firestore";
import { app } from "@/src/firebase/FirebaseConfig";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import {v4 as uuid} from "uuid"
import { useRouter } from "next/navigation";


export interface PaymentData {
    amount: number;
    campaign_id: string;
    user_id: string;
    receipt_id: string;
    timestamp: Date;
    anonymity: boolean;
}
export interface CamapignData {
    amount: string;
    benefit: string;
    campaign_description: string;
    campaign_name: string;
    cause: string;
    description: string;
    district: string;
    email: string;
    fund_id: string;
    name: string;
    ngo_name: string;
    other_individual: string;
    other_number: string;
    phoneNumber: string;
    state: string;
    timestampz: Date;
    user_id: string;
}

export default function DonatePage() {
    const [campaignId, setCampaignId] = useState<string | null>(null);
    const [campaignData, setCampaignData] = useState<CamapignData | null>(null);
    const [donationAmount, setDonationAmount] = useState<number>(0);
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const [hasPaid, setHasPaid] = useState<boolean>(false);
    const router = useRouter();
    const { user } = useUser()
    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');
        if (savedUserId) {
            setUserId(savedUserId);
        } else if (user?.id) {
            setUserId(user.id);
            localStorage.setItem('userId', user.id);
        }
    }, [user]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const campaign = searchParams.get("campaign");
        setCampaignId(campaign);
    }, []);

    useEffect(() => {
        const checkIfPaid = async () => {
            if (!userId || !campaignId) return;

            const db = getFirestore(app);
            const donationQuery = query(
                collection(db, 'donation_data'),
                where('user_id', '==', userId),
                where('campaign_id', '==', campaignId)
            );

            const donationSnapshot = await getDocs(donationQuery);
            if (!donationSnapshot.empty) {
                setHasPaid(true);
                router.push(`/thanks?cid=${campaignId}&uid=${userId}`)
                return;
            }
        };

        checkIfPaid();
    }, [userId, campaignId, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!hasPaid && campaignId && userId) {
                const db = getFirestore(app)
                try {
                    const Query = await query(collection(db, 'products'), where('fund_id', '==', campaignId))
                    const Querysnapshot = await getDocs(Query);
                    if (!Querysnapshot.empty) {
                        const queryDoc = Querysnapshot.docs[0];
                        const queryData = queryDoc.data() as CamapignData;
                        if (queryData) {
                            setCampaignData(queryData);
                            console.log(queryData);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching campaign data:', error);
                }
            }
        };
        fetchData();
    }, [campaignId, userId, hasPaid])

    const { toast } = useToast();

    const handleDonation = async () => {
        if (!hasPaid && campaignData && donationAmount > 0) {
            const db = getFirestore(app);
            try {
                if(userId){
                    const paymentData: PaymentData = {
                        amount: donationAmount,
                        campaign_id: campaignData.fund_id,
                        user_id: userId,
                        receipt_id: uuid(),
                        timestamp: new Date(),
                        anonymity: false,
                    };
                    await addDoc(collection(db, 'donation_data'), paymentData);
                    console.log('Donation data added successfully:', paymentData);
                    toast({ variant: 'default', title: 'Donation Added Succesfully', description: 'Please navigate to posts section to see your post'});
                } else {
                    toast({variant: 'default', title: 'Payment Failed', description: 'Please Try the Payment again after reloading'})
                }
            } catch (error) {
                console.error('Error adding donation data:', error);
            }
        }
    };

    return (
        <div className="w-full h-[100vh] flex flex-row">
            <div className="w-[60%] bg-white px-5 flex flex-col gap-3 py-3 overflow-auto">
                <div className="w-full h-full relative">
                    <Image src={'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} fill alt="" className="rounded-md"/>
                </div>
                <h1 className="text-black text-2xl font-bold">{campaignData?.campaign_name}</h1>
                <div className="text-black">{campaignData?.campaign_description}</div>
            </div>
            <div className="w-[40%] bg-white p-3">
                <div className="w-full p-2 flex flex-row gap-4">
                    <div className="rounded-md justify-center border-2 border-neutral-200 p-4">{campaignData?.district}, {campaignData?.state}</div>
                    <div className="flex-1 rounded-md justify-center text-center border-2 font-semibold p-4">Target Amount : {campaignData?.amount}</div>
                </div>
                <div className="w-full p-3 rounded-md overflow-hidden text-center text-sm">
                    {campaignData?.benefit === 'NGO' ? (
                        <p>This program is termed to benefit NGO - {campaignData.ngo_name} for supporting {campaignData.cause}</p>
                    ):(
                        <p>This program is termed to benefit {campaignData?.name} for supporting {campaignData?.cause}</p>
                    )}
                </div>
                <div className="w-full h-80 p-7 flex justify-center items-center relative">
                    <div className="absolute text-center w-full top-0 text-2xl font-semibold">Donaters Feedback</div>
                    <div className="shadow-md shadow-black rounded-md w-full px-3 py-16 text-center">
                        {"Thank you for your generous donation to Paws for a Cause: Supporting Our Furry Friends. Your support fuels our mission at Wings for Dreams, and we're grateful for your kindness and belief in our work."}
                    </div>
                </div>
                <div className="w-full flex flex-row gap-5 px-7">
                    <div className="flex-1">
                        <Input type="number" placeholder="Enter the amount you want to donate" className="border-black border-2" onChange={(e) => setDonationAmount(parseFloat(e.target.value))}></Input>
                    </div>
                    <div className="w-[20%]">
                        <Button variant={'secondary'} onClick={handleDonation}>Donate</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
