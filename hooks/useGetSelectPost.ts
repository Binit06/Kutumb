"use client";

import { CamapignData } from "@/app/(donate)/(routes)/donate/page";
import { app } from "@/src/firebase/FirebaseConfig"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useState } from "react";

const useGetSelectPost = async (fund_id: string) => {
    const [Data, setData] = useState<CamapignData | null>(null)
    const db = getFirestore(app);
    try {
        const Query = await query(collection(db, 'products'), where('fund_id', '==', fund_id))
        const querySnapshot = await getDocs(Query)

        if(!querySnapshot.empty){
            const queryDoc = querySnapshot.docs[0];
            const queryData = queryDoc.data() as CamapignData;
            if(queryData){
                setData(queryData)
            }
        }
    } catch (e) {
        console.error('Error getting documents:', e);
    }

    return Data;
}

export default useGetSelectPost;