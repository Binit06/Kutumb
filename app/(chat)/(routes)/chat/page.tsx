"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { app } from "@/src/firebase/FirebaseConfig";
import { UserButton, useUser } from "@clerk/nextjs";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { group } from "console";

interface FormData {
    chat_room_creator_id: string;
    chat_room_name: string;
    isPublic: boolean;
    chat_room_members: { designation: string; user_id: string }[];
    chat_room_password: string;
    chat_room_id: string;
}

export default function Chat() {
    const { user } = useUser();
    const [formData, setFormData] = useState<FormData>({
        chat_room_creator_id: '',
        chat_room_name: "",
        isPublic: false,
        chat_room_members: [],
        chat_room_password: '',
        chat_room_id: uuid(),
    });

    const handleCreateGroup = async () => {
        const db = getFirestore(app);
        try {
            const memberMap = [{
                designation: 'admin',
                user_id: formData.chat_room_creator_id
            }];
            const chatRoomCollection = collection(db, 'Chat_room');
            await addDoc(chatRoomCollection, {
                ...formData,
                chat_room_members: memberMap
            });
            setFormData({
                ...formData,
                chat_room_name: "",
                isPublic: false,
                chat_room_members: memberMap
            });
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prevData => ({
            ...prevData,
            [name]: val
        }));
    };

    const handleAutofill = () => {
        setFormData(prevData => ({
            ...prevData, 
            chat_room_creator_id: user?.id ?? ''
        }))
    }

    const [adminGroups, setAdminGroups] = useState<any[]>([]);
    const [memberGroups, setMemberGroups] = useState<any[]>([]);

    const fetchAdminGroups = async () => {
        const db = getFirestore(app);
        const adminGroupsQuery = query(collection(db, 'Chat_room'), where('chat_room_members', 'array-contains', { user_id: user?.id, designation: 'admin' }));
        const querySnapshot = await getDocs(adminGroupsQuery);
        const groupsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdminGroups(groupsData);
    };
    const fetchMemberGroups = async () => {
        const db = getFirestore(app);
        const adminGroupsQuery = query(collection(db, 'Chat_room'), where('chat_room_members', 'array-contains', { user_id: user?.id, designation: 'member' }));
        const querySnapshot = await getDocs(adminGroupsQuery);
        const groupsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMemberGroups(groupsData);
    };

    const handleSetFormData = (room_name: string, room_id: string) => {
        setFormData((prevData) => ({
            ...prevData,
            chat_room_name: room_name,
            chat_room_id: room_id,
        }))
    }

    const fetchUserId = () => {
        return user?.id || ''
    }
    const fetchuserName = () => {
        return user?.fullName || ''
    }

    const isAdmin = async () => {
        const db = getFirestore(app);
        try {
            const chatRoomQuery = query(collection(db, 'Chat_room'), where('chat_room_id', '==', formData.chat_room_id));
            const chatRoomSnapshot = await getDocs(chatRoomQuery);
            if (!chatRoomSnapshot.empty) {
                const chatRoomDoc = chatRoomSnapshot.docs[0];
                const chatRoomData = chatRoomDoc.data();
                if (chatRoomData) {
                    const isAdmin = chatRoomData.chat_room_members.some((member: any) => member.user_id === fetchUserId() && member.designation === 'admin');
                    return isAdmin;
                }
            } else {
                console.error("Chat room not found");
                return false;
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            return false;
        }
    }
    

    const handleJoinGroup = async (groupId: string) => {
        const db = getFirestore(app);
        const userId = fetchUserId(); // Assuming fetchUserId() is a function that fetches the current user's ID
        try {
            const groupQuery = query(collection(db, 'Chat_room'), where('chat_room_id', '==', groupId));
            const querySnapshot = await getDocs(groupQuery);
            if (!querySnapshot.empty) {
                const groupDoc = querySnapshot.docs[0];
                const groupRef = doc(db, 'Chat_room', groupDoc.id);
                const groupData = groupDoc.data();
                if (groupData) {
                    const updatedMembers = [
                        ...groupData.chat_room_members,
                        { designation: 'member', user_id: userId }
                    ];
                    await updateDoc(groupRef, { chat_room_members: updatedMembers });
                    setFormData(prevData => ({
                        ...prevData,
                        chat_room_members: updatedMembers
                    }));
                } else {
                    console.error("Group data not found");
                }
            } else {
                console.error("Group does not exist");
            }
        } catch (error) {
            console.error("Error joining group:", error);
        }
    };

    const handleSendMessage = async (message: string) => {
        try {
            const db = getFirestore(app);
            const timestamp = new Date().toISOString(); // Get current timestamp
            const isadmin = await isAdmin()
            const messageData = {
                chat_room_id: formData.chat_room_id,
                user_id: fetchUserId(),
                message: message,
                timestamp: timestamp,
                user_name: fetchuserName(),
                admin: isadmin,
            };
            console.log(messageData)
            const chatRoomDiscussionCollection = collection(db, 'Chat_room_discussions');
            await addDoc(chatRoomDiscussionCollection, messageData);
            setMessage('')
            fetchMessages()
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const [message, setMessage] = useState('')
    

    const [groupid, setGroupId] = useState('')
    const [messages, setMessages] = useState<any[]>([]);

    const fetchMessages = async () => {
        try {
            const db = getFirestore(app);
            const chatRoomId = formData.chat_room_id;
            const chatRoomDiscussionCollection = collection(db, 'Chat_room_discussions');
            const chatRoomMessagesQuery = query(chatRoomDiscussionCollection, where('chat_room_id', '==', chatRoomId));
            const querySnapshot = await getDocs(chatRoomMessagesQuery);
            const messagesData = querySnapshot.docs.map(doc => doc.data());
            setMessages(messagesData);
            console.log(messagesData)
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <Dialog>
            <div className="w-full h-[100vh] flex flex-row">
                <div className="w-[20%] h-full bg-[#00585c] relative">
                    <div className="p-3 flex flex-row gap-5 align-middle h-[7vh]">
                        <div className="flex align-middle justify-center">
                            <UserButton />
                        </div>
                    </div>
                    <div className="absolute top-2 right-2">
                        <DialogTrigger>
                            <Button variant={'outline'}>Create Group</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a New Group</DialogTitle>
                                <DialogDescription>
                                    This action will create a new group making you the admin for the current group.
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                placeholder="Enter your group Name"
                                name="chat_room_name"
                                value={formData.chat_room_name}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Enter your group password"
                                name="chat_room_password"
                                value={formData.chat_room_password}
                                onChange={handleChange}
                            />
                            <div className="w-full flex flex-row gap-3">
                                <Input
                                    placeholder="Enter your unique admin id"
                                    name="chat_room_creator_id"
                                    value={formData.chat_room_creator_id}
                                    onChange={handleChange}
                                />
                                <Button variant={'secondary'} onClick={handleAutofill}>AutoFill</Button>
                            </div>
                            <div className="w-full flex flex-row justify-between px-2">
                                <Label>Do you want your group to be public</Label>
                                <Switch
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onCheckedChange={(value: boolean) => setFormData(prevData => ({
                                        ...prevData,
                                        isPublic: value
                                    }))}
                                />
                            </div>
                            <div className="w-full flex flex-row justify-between px-2">
                                <Button variant={'destructive'}>Discard Changes</Button>
                                <Button variant={'default'} onClick={handleCreateGroup}>Create</Button>
                            </div>
                        </DialogContent>
                    </div>
                    <div className="w-full h-fit rounded-md flex flex-row gap-3 mt-5 justify-between">
                        <Tabs defaultValue="admin" className="w-full px-2">
                            <TabsList className="w-full">
                                <TabsTrigger value="admin">Admin</TabsTrigger>
                                <TabsTrigger value="member">Member</TabsTrigger>
                                <div className="absolute right-2">
                                    <Button variant={'outline'} onClick={fetchAdminGroups}>R</Button>
                                </div>
                            </TabsList>
                            <TabsContent value="admin">
                                <div className="flex flex-col gap-2">
                                    {adminGroups.map((value, index) => (
                                        <div key={index} className="p-2 rounded-md bg-white flex flex-row align-middle gap-3">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                {value.chat_room_name}
                                            </div>
                                            <Button variant={'link'} onClick={() => {handleSetFormData(value.chat_room_name, value.chat_room_id)}}>
                                                View Room
                                            </Button>

                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="member">
                            <Dialog>
                                <div className="w-full flex flex-row gap-2">
                                        <DialogTrigger>
                                            <Button variant={'secondary'} className="w-full">Join A Group</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Join A Group</DialogTitle>
                                                <DialogDescription>Only the groups that are public can be joined</DialogDescription>
                                            </DialogHeader>
                                            <Input 
                                                placeholder="Enter Group Id"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupId(e.target.value)}
                                                value={groupid}
                                                required
                                            />

                                            <div className="w-full flex flex-row justify-between">
                                                <Button variant={'destructive'}>Discard</Button>
                                                <Button variant={'outline'} onClick={() => {handleJoinGroup(groupid)}}>Join</Button>
                                            </div>
                                        </DialogContent>
                                    <Button variant={'outline'} onClick={fetchMemberGroups}>R</Button>
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                    {memberGroups.map((value, index) => (
                                        <div key={index} className="p-2 rounded-md bg-white flex flex-row align-middle gap-3">
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                {value.chat_room_name}
                                            </div>
                                            <Button variant={'link'} onClick={() => {handleSetFormData(value.chat_room_name, value.chat_room_id)}}>
                                                View Room
                                            </Button>

                                        </div>
                                    ))}
                                </div>
                                </Dialog>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="flex-1 w-full h-full bg-[#FFE49D] relative">
                    <div className="absolute px-4 py-5 bg-white w-full rounded-b-md font-semibold text-xl flex flex-col gap-1">
                        <div>
                            {formData.chat_room_name}
                        </div>
                        <div className="font-thin text-sm">
                            Invite ID : {formData.chat_room_id}
                        </div>
                    </div>
                    <div className="absolute w-full top-28 px-2 flex flex-col gap-3">
                        {messages
                            .slice() // Create a copy of the array to avoid mutating the original array
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) // Sort the messages by timestamp
                            .map((message, index) => (
                                <div key={index} className={`p-2 rounded-md ${message.admin ? 'bg-[rgba(2,210,207,0.6)]' : 'bg-neutral-100'} relative`}>
                                    <div className={`${message.admin ? 'font-bold': ''}`}>{message.message}</div>
                                    <div className="text-xs text-gray-500">{message.timestamp}</div>
                                    <div className="absolute right-2 top-2 font-semibold">{message.user_name}</div>
                                </div>
                        ))}
                    </div>

                    <div className="absolute bottom-2 px-2 flex flex-row gap-3 w-full">
                        <Input placeholder="Send Your Message" className="flex-1" autoFocus onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} value={message}/>
                        <Button variant={'secondary'} onClick={fetchMessages}>Fetch</Button>
                        <Button variant={'default'} onClick={() => {handleSendMessage(message)}}>Send</Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
