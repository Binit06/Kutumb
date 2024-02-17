"use client"

import { ModeToggle } from "@/components/mode-toogle";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { app } from "@/src/firebase/firebaseConfig";
import { UserButton, useAuth } from "@clerk/nextjs";
import { SelectValue } from "@radix-ui/react-select";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
    const {getToken} = useAuth()
    useEffect(() => {
      const signInwithClerk = async () => {
        const auth = getAuth(app);
        const token = await getToken({template: "integration_firebase"})
        const userCredentials = await signInWithCustomToken(auth, token || 'rishab_mohapatra7@gmail.com')
        console.log("User: ", userCredentials.providerId)
      }

      signInwithClerk()
    }, [])

    const [value, setValue] = useState<string | null>(null)

    useEffect(() => {
      console.log(value)
    }, [value])
    return (
      <Sheet>
        <div>
          <div className="flex flex-row gap-3 p-3 rounded-3xl border-neutral-300 border-2 w-fit bg-neutral-100">
            <UserButton 
            afterSignOutUrl="/sign-up"
            />
            <SheetTrigger><div className="font-semibold">Profile</div></SheetTrigger>
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
                <Input placeholder="User Name" className="w-full py-3 px-2"/>
              </div>
              <div className="flex flex-col gap-3">
                <p>Email</p>
                <Input placeholder="User Email" className="w-full py-3 px-2" type="email"/>
              </div>
              <div className="flex flex-col gap-3">
                <p>Password</p>
                <Input placeholder="User Password" className="w-full py-3 px-2" type="password"/>
              </div>
              <div className="flex flex-col gap-3">
                <p>User Type</p>
                <Select>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select Your Type"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO" onChange={() => {setValue('ngo'); console.log(value)}}>NGO</SelectItem>
                    <SelectItem value="User" onChange={() => {setValue('person'); console.log(value)}}>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
          <ModeToggle />
        </div>
        </Sheet>
    );
}
