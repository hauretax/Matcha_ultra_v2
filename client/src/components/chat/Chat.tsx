import React, { useContext, useEffect, useRef, useState } from "react";

import { TextInput } from "./TextInput";
import { MessageLeft } from "./Message";
import { Box, Paper } from "@mui/material";
import BrowsingChatProfiles from "./Profiles";
import SocketContext from "../../context/SocketProvider"
import { useAuth } from "../../context/AuthProvider";

// les rendres accesible a tous
interface Profile {
    username: string;
    userId: number;
    lastMessage: string;
    messageDate: Date;
    haveUnseeMessage?: boolean;
}
interface Message {
    message: string;
    timestamp: string;
    photoURL: string;
    displayName: string;
    avatarDisp: boolean;
}

async function getProfilesDiscussion(): Promise<Profile[]> {
    const fakeDBRequest: Promise<Profile[]> = new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    username: 'Alice',
                    userId: 1,
                    lastMessage: 'Hello there!',
                    messageDate: new Date('2023-08-03T12:34:56') // Sample date and time
                },
                {
                    username: 'Bob',
                    userId: 2,
                    lastMessage: 'Hey Alice, how are you?',
                    messageDate: new Date('2023-08-02T15:23:45') // Sample date and time
                },
                {
                    username: 'Charlie',
                    userId: 3,
                    lastMessage: 'Greetings!',
                    messageDate: new Date('2023-08-01T09:12:34') // Sample date and time
                },
                {
                    username: 'Eve',
                    userId: 4,
                    lastMessage: 'Hi everyone!',
                    messageDate: new Date('2023-07-31T20:30:15') // Sample date and time
                },
                {
                    username: 'Mallory',
                    userId: 5,
                    lastMessage: 'Goodbye!',
                    messageDate: new Date('2023-07-30T18:45:10') // Sample date and time
                },
            ]);
        }, 1000); // 1000 milliseconds = 1 second
    });

    const profiles = await fakeDBRequest;

    return profiles;
}

async function getMessagesDiscussion(): Promise<Message[]> {
    const fakeDBRequest: Promise<Message[]> = new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    message: 'sed leo. Nulla facilisi. Aliquam',
                    timestamp: '08/03 12:34',
                    photoURL: 'https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c',
                    displayName: 'Moi',
                    avatarDisp: true,
                },
                {
                    message: 'Lorem ipsum dolor sit amet',
                    timestamp: '08/03 14:25',
                    photoURL: 'https://example.com/avatar1.jpg',
                    displayName: 'John',
                    avatarDisp: false,
                },
                {
                    message: 'consectetur adipiscing elit',
                    timestamp: '08/03 15:10',
                    photoURL: 'https://example.com/avatar2.jpg',
                    displayName: 'Jane',
                    avatarDisp: true,
                },
                {
                    message: 'Ut id augue ut odio tincidunt pulvinar.',
                    timestamp: '08/04 09:45',
                    photoURL: 'https://example.com/avatar3.jpg',
                    displayName: 'Jack',
                    avatarDisp: true,
                },
                {
                    message: 'Phasellus vel turpis vitae nunc elementum accumsan.',
                    timestamp: '08/04 11:20',
                    photoURL: 'https://example.com/avatar4.jpg',
                    displayName: 'Alice',
                    avatarDisp: false,
                },
                {
                    message: 'Sed vitae erat nec elit venenatis bibendum.',
                    timestamp: '08/04 13:15',
                    photoURL: 'https://example.com/avatar5.jpg',
                    displayName: 'Bob',
                    avatarDisp: true,
                },
                {
                    message: 'Donec et ipsum nec mauris mattis condimentum.',
                    timestamp: '08/04 15:30',
                    photoURL: 'https://example.com/avatar6.jpg',
                    displayName: 'Eve',
                    avatarDisp: true,
                },
                {
                    message: 'Fusce rhoncus rhoncus nunc, eget pharetra magna viverra nec.',
                    timestamp: '08/05 10:55',
                    photoURL: 'https://example.com/avatar7.jpg',
                    displayName: 'Michael',
                    avatarDisp: false,
                },
                {
                    message: 'Cras non est eu metus congue eleifend a vitae libero.',
                    timestamp: '08/05 12:40',
                    photoURL: 'https://example.com/avatar8.jpg',
                    displayName: 'Sophia',
                    avatarDisp: true,
                },
                {
                    message: 'Curabitur volutpat facilisis enim in viverra.',
                    timestamp: '08/05 14:20',
                    photoURL: 'https://example.com/avatar9.jpg',
                    displayName: 'Alex',
                    avatarDisp: true,
                },
            ]);
        }, 1000);
    });
    const messages = await fakeDBRequest;
    return messages;
}


export default function Chat() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        height: '200px'
    };
    //reflexion sur la structure des profiles message
    //{ username: string, userId: number, lastMessage:string, MessageDate: Date ou string ?  }
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userIdOpenConv, changeActualConv] = useState(-1)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

    const { message } = useContext(SocketContext);
    const { user } = useAuth();
    const messageListRef = useRef<HTMLDivElement>(null);

    const handleClickProfile = (userId: number) => {
        changeActualConv(userId);
    };

    //apelle au montage
    useEffect(() => {
        async function fetchProfiles() {
            try {
                const fetchedProfiles = await getProfilesDiscussion();
                setProfiles(fetchedProfiles);
            } catch (error) {
                console.error('Erreur lors de la récupération des profils:', error);
            }
        }
        fetchProfiles();



    }, []);

    // changement de conversation
    useEffect(() => {
        setMessages([])
        const Change = profiles.map(profile => {
            if (profile.userId === userIdOpenConv)
                return { ...profile, haveUnseeMessage: false }
            return profile;
        });
        setProfiles(Change)
        async function fetchMessage() {
            try {
                const fetchedMessage = await getMessagesDiscussion();
                setMessages(fetchedMessage);
            } catch (error) {
                console.error('Erreur lors de la récupération des messages:', error);
            }
        }
        fetchMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userIdOpenConv])

    // un nouveaux message arrive
    useEffect(() => {
        console.log(message, user?.id, user?.id, message.userFrom)
        if (userIdOpenConv === message.userFrom) {
            setMessages([...messages, { message: message.message, avatarDisp: true, displayName: 'none', photoURL: 'http:nonon', timestamp: 'now' }])
        }

        else if (user?.id === message.userFrom) {
            console.log('test')
            setMessages([...messages, { message: message.message, avatarDisp: true, displayName: 'none', photoURL: 'http:nonon', timestamp: 'now' }])
        }

        else {
            const Change = profiles.map(profile => {
                if (profile.userId === message.userFrom)
                    return { ...profile, haveUnseeMessage: true }
                return profile;
            });
            setProfiles(Change)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])


    useEffect(() => {
        if (messageListRef.current && isScrolledToBottom) {
            const messageList = messageListRef.current;
            messageList.scrollTop = messageList.scrollHeight;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages])

    //charger les conversations active depuis la bdd

    //charger chat avec un apelle en bdd

    //emvoyer les messages dans la bdd

    const checkIsScrolledToBottom = (event: any) => {
        const div = event.target;
        const { scrollTop, scrollHeight, clientHeight } = div;
        const isBottom = scrollTop + clientHeight === scrollHeight;
        setIsScrolledToBottom(isBottom);
    };

    return (
        <div style={containerStyle}>

            <Paper sx={{ width: '250px' }}>
                <BrowsingChatProfiles profiles={profiles} handleClickProfile={handleClickProfile} />
            </Paper>

            <Paper sx={{ width: '80%', height: '200px' }}>
                <Paper id="style-1" sx={{ height: '300px' }} >
                    <Box onScroll={checkIsScrolledToBottom} ref={messageListRef} sx={{ height: '300px', overflow: 'auto' }}>
                        {
                            messages.map((message, key) => {
                                return <MessageLeft
                                    key={key}
                                    message={message.message}
                                    timestamp={message.timestamp}
                                    photoURL={message.photoURL}
                                    displayName={message.displayName}
                                    avatarDisp={message.avatarDisp}
                                />
                            })
                        }
                    </Box>
                </Paper>
                <TextInput userTo={userIdOpenConv} userFrom={user?.id || -1} />
            </Paper>

        </div >
    );
}

