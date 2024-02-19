"use client"

import Hero from "@/components/Hero/Hero";
import { ModeToggle } from "@/components/mode-toogle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { app, storage } from "@/src/firebase/FirebaseConfig";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import Stripe from "stripe";
import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid'
import We from "../../../components/We/We"

export interface Fundraisers {
  fund_captions?: string | undefined;
  name?: string;
  fund_id: string;
  imgUrl?: string;
  active?: boolean;
  metadata?: Stripe.Metadata;
}

export interface Price {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_daya?: number | null;
  metadata?: Stripe.Metadata;
}

interface UserData {
  // Define the structure of your user data here
  user_id: string;
  user_name: string;
  user_email: string;
  user_type: string;
  user_image: string;
  user_location: string;
  user_followers: any[];
  user_following: any[];
  user_connections: any[];
  user_follower_count: number;
  user_following_count: number;
  connect_requests: any[];
  user_connection_count: number;
  sectors: any[];
}

export default function Home() {

    const {user} = useUser();



    const [formData, setFormData] = useState({
        user_id: user?.id,
        name: user?.fullName,
        email: user?.emailAddresses[0].emailAddress,
        userType: '',
        userImage: user?.imageUrl,
        user_location: '',
        user_followers: [] as any[],
        user_following: [] as any[],
        user_connections: [] as any[],
        user_follower_count: 0,
        user_following_count: 0,
        connect_requests: [] as any[],
        user_connection_count: 0,
        sectors: [] as any[],
    });

    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
      const fetchUserData = async () => {
        const db = getFirestore(app);
        const userDataCollection = collection(db, 'user_data');
        const q = query(userDataCollection, where("user_id", "==", user?.id || ''));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            // Update userData with fetched user data
            setUserData(doc.data() as UserData);
          });
        } else {
          // Handle case where no matching document is found
          console.log('No matching document found for user ID:', user?.id);
          setUserData(null); // Or setUserData({}) depending on your requirements
        }
      };

      fetchUserData();
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const userData = {
          user_email: formData.email,
          user_name: formData.name,
          user_type: formData.userType,
          user_location: '',
          user_followers: [],
          user_following: [],
          user_connections: [],
          user_follower_count: 0,
          user_following_count: 0,
          user_image: formData.userImage,
          user_id: user?.id,
          connect_requests: [],
          user_connection_count: 0,
          sectors: [],
        }
        console.log(userData)
        // const auth = getAuth(app)
        // try {
        //   await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        // } catch (e) {
        //   console.error('Error creating user in Firebase Authentication:', e);
        // }

        const db = getFirestore(app);
        try {
          if (userData) {
            const userDataCollection = collection(db, 'user_data');
            const q = query(userDataCollection, where('user_id', '==', userData.user_id));
            const querySnapshot = await getDocs(q);
      
            querySnapshot.forEach(async (doc) => {
              try {
                await updateDoc(doc.ref, userData);
                console.log('Profile updated successfully');
              } catch (e) {
                console.error('Error updating profile:', e);
              }
            });
          } else {
            console.error('userData is null');
          }
        } catch (e) {
          console.error('Error fetching document:', e);
        }

    };

    const [fileUpload, setFileUpload] = useState<any | null>(null)
    const [fileURL, setFileURL] = useState<string | null>(null)

    const upload = async () => {
      console.log(fileUpload);
      if (fileUpload !== null) {
        const fileref = ref(storage, `userprofile/${formData.user_id}`);
        try {
          const data = await uploadBytes(fileref, fileUpload[0]);
          const url = await getDownloadURL(data.ref);
          setFileURL(url);
          formData.userImage = url
          localStorage.setItem('fileURL', url)
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      } else {
        alert('Please Upload The Image');
      }
    };
    useEffect(() => {
        const storedFileURL = localStorage.getItem('fileURL');
        if (storedFileURL && user?.imageUrl === undefined) {
            setFileURL(storedFileURL);
            formData.userImage = storedFileURL
        } else {
            setFileURL(user?.imageUrl || '')
            formData.userImage = storedFileURL || '';
        }
    }, []);

    useEffect(() => {
      if (userData !== null) {
        setFormData(prevData => ({
          ...prevData,
          user_id: user?.id,
          name: user?.fullName,
          email: user?.emailAddresses[0].emailAddress,
          userType: userData.user_type || 'Volunteer',
          userImage: user?.imageUrl || userData.user_image,
          user_location: userData.user_location,
          user_followers: userData.user_followers,
          user_following: userData.user_following,
          user_connections: userData.user_connections,
          user_follower_count: userData.user_follower_count,
          user_following_count: userData.user_following_count,
          connect_requests: userData.connect_requests,
          user_connection_count: userData.user_connection_count,
          sectors: userData.sectors,
        }));
      }
    }, [userData]);
    return (
        <Sheet>
            <div className="flex flex-row absolute">
                <div className="flex flex-row gap-3 p-2 rounded-3xl border-neutral-300 border-2 w-fit bg-neutral-100">
                    <UserButton afterSignOutUrl="/" />
                    <SheetTrigger><div className="font-semibold">Profile</div></SheetTrigger>
                </div>
                <div>
                  {userData?.user_name}
                </div>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Complete your profile</SheetTitle>
                        <SheetDescription>
                            The data entered will be stored in our server. Be sure to enter the same data as you entered in Auth.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-3">
                            <p>Name</p>
                            <Input
                                name="name"
                                value={formData.name ?? ''}
                                onChange={handleChange}
                                placeholder="User Name"
                                className="w-full py-3 px-2"
                                disabled={user?.fullName !== '' ? true: false}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Email</p>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="User Email"
                                className="w-full py-3 px-2"
                                type="email"
                                disabled={user?.emailAddresses[0].emailAddress !== '' ? true: false}
                            />
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <p>Attach Profile Picture</p>
                            <div className="w-full h-[140px] border-2 border-dashed border-neutral-200 rounded-md grid place-content-center">
                              {fileURL ? (<p>Picture Uploaded</p>):(<Input type="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFileUpload(e.target.files)}/>)}
                            </div>
                            {fileURL? (null):(<Button className="absolute bottom-0 right-0" onClick={upload}>Upload</Button>)}
                        </div>

                        <div className="flex flex-col gap-3">
                          <p>Choose Your Designation</p>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <button
                                type="button"
                                className="w-full py-2 px-4 rounded-md border border-neutral-300"
                                style={{ backgroundColor: formData.userType === "NGO" ? "rgba(0,0,0,0.1)" : "transparent" }}
                                onClick={() => setFormData({ ...formData, userType: "NGO" })}
                                disabled={false}
                              >
                                NGO
                              </button>
                            </div>
                            <div className="flex-1">
                              <button
                                type="button"
                                className="w-full py-2 px-4 rounded-md border border-neutral-300"
                                style={{ backgroundColor: formData.userType === "Volunteer" ? "rgba(0,0,0,0.1)" : "transparent" }}
                                onClick={() => setFormData({ ...formData, userType: "Volunteer" })}
                                disabled={false}
                              >
                                Volunteer
                              </button>
                            </div>
                          </div>
                        </div>


                        
                        <div className="flex flex-col gap-3">
                            {userData ? (
                              <Button onClick={handleSubmit}>Update Profile</Button>
                            ):(
                              <Button onClick={handleSubmit}>Proceed</Button>
                            )}
                        </div>
                    </div>
                </SheetContent>
                <div>
                  <ModeToggle />
                </div>
            </div>
            <div>
              <Hero/>
            </div>
            <div>
              <We/>
            </div>
        </Sheet>
    );
}
