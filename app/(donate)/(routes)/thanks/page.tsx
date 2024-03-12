"use client";

import { Button } from "@/components/ui/button";
import { app } from "@/src/firebase/FirebaseConfig";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PaymentData } from "../donate/page";
import { useRouter } from "next/navigation";

const Thanks = () => {
    const [campaignId, setCampaignId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [briefing, setBriefing] = useState(false);
    const [briefingData, setBriefingData] = useState<PaymentData | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const campaign = searchParams.get("cid");
        const userId = searchParams.get("uid");
        setCampaignId(campaign);
        setUserId(userId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!campaignId || !userId || !briefing) return;
    
            const db = getFirestore(app);
            const donationQuery = query(
                collection(db, "donation_data"),
                where("campaign_id", "==", campaignId),
                where("user_id", "==", userId)
            );
    
            const donationSnapshot = await getDocs(donationQuery);
            if (!donationSnapshot.empty) {
                const donationDoc = donationSnapshot.docs[0];
                const donationData = donationDoc.data() as PaymentData;
                console.log(donationData)
                if (donationData) {
                    setBriefingData(donationData);
                }
            }
        };

        fetchData()
    }, [campaignId, userId, briefing])
    const router = useRouter()
    const handleClick = () => {
        router.push('/')
    }

    return (
        <div className="w-full h-[100vh]">
            <div className="w-full h-full flex items-center justify-center flex-col gap-5">
                <div className="text-5xl font-bold">
                    Thank You For Donating
                </div>
                <div className="w-full flex justify-center items-center">
                    <Button variant={'outline'} onClick={() => {setBriefing(true);}}>Get Briefings</Button>
                </div>
                {briefing && briefingData ? (
                    <div className="w-full flex flex-col justify-center items-center">
                        You have donated an amount of : {briefingData?.amount}
                    </div>
                ) : (
                    null
                )}
                <div className="w-full flex flex-col justify-center items-center">
                    <Button variant={'ghost'} onClick={handleClick}>Return Home</Button>
                </div>
            </div>
        </div>
    );
}

export default Thanks;
