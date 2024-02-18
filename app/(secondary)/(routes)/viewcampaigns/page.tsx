"use client";

import { app } from "@/src/firebase/FirebaseConfig";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface ProductData {
    amount: number;
    benefit: string;
    campaign_description: string;
    campaign_name: string;
    cause: string;
    description: string;
    district: string;
    email: string;
    fund_id: string;
    name: string;
    other_individual: string;
    other_number: string;
    phoneNumber: string;
    state: string;
    timestampz: Date;
    user_id: string;
}

export default function viewcampaign() {
    const [campaignData, setCampaignData] = useState<ProductData[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("reached")
            try {
                if (campaignData === null) {
                    const db = getFirestore(app);
                    const campaignCollection = collection(db, 'products');
                    const snapshot = await getDocs(campaignCollection);
                    
                    const data: ProductData[] = [];
                    snapshot.forEach(doc => {
                        const productData = doc.data() as ProductData;
                        data.push(productData);
                    });
                    setCampaignData(data);
                }
            } catch (error) {
                console.error("Error fetching campaign data: ", error);
            }
        };

        fetchData();
    }, [campaignData]);

    const memoizedCampaignData = useMemo(() => campaignData, [campaignData]);

    return (
        <div>
            {/* <div style={{ width: '300px', height: '300px', overflow: 'hidden', position: 'relative' }}>
                <Image src={"https://serudsindia.org/wp-content/uploads/2020/10/children-in-seruds-orphanage-kurnool.jpg"} layout="fill" alt="Image" />
            </div> */}
            {memoizedCampaignData?.map((value, index) => (
                <div key={index} className="max-w-[300px] overflow-hidden">
                    {value.campaign_name}
                </div>
            ))}
            <div>Donate</div>
        </div>
    );
}
