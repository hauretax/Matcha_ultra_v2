import React, { useContext, useEffect, useRef, useState } from "react";

import { TextInput } from "./TextInput";
import { MessageLeft } from "./Message";
import { Box, Paper } from "@mui/material";
import BrowsingChatProfiles from "./Profiles";
import SocketContext from "../../context/SocketProvider";
import { useAuth } from "../../context/AuthProvider";

import { Message, Profile } from "../../../../comon_src/type/utils.type";
import apiProvider from "../../services/apiProvider";

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
                const conversations = await apiProvider.getConversations();
                setProfiles(conversations.data.profiles);
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
            if (profile.id === userIdOpenConv)
                return { ...profile, haveUnseeMessage: false }
            return profile;
        });
        setProfiles(Change)
        async function fetchMessage() {
            try {
                const fetchedMessage = await apiProvider.getChat(userIdOpenConv);
                setMessages(fetchedMessage.data.chat);
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
            setMessages([...messages, { msg: message.message, displayName: 'none', sendDate: 'now' }])
        }

        else if (user?.id === message.userFrom) {
            console.log('test')
            setMessages([...messages, { msg: message.message, displayName: 'none', sendDate: 'now' }])
        }

        else {
            const Change = profiles.map(profile => {
                if (profile.id === message.userFrom)
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
                                console.log(message)
                                return <MessageLeft
                                    key={key}
                                    message={message.msg}
                                    timestamp={message.sendDate}
                                    displayName={message.displayName}
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

