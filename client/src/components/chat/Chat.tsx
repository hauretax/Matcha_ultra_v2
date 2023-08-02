import React, { useContext, useEffect, useState } from "react";

import { TextInput } from "./TextInput";
import { MessageLeft, MessageRight } from "./Message";
import { Paper } from "@mui/material";
import BrowsingChatProfiles from "./Profiles";
import { SocketProvider } from "../../context/SocketProvider";
import ZoneContext from "../../context/zoneContext";
import SocketContext from "../../context/SocketProvider"

export default function Chat() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };
    //reflexion sur la structure des profiles message
    //{ username: string, userId: number, lastMessage:string, MessageDate: Date ou string ?  }
    const [profiles, setProfiles] = useState([{ username: 'qsd', userId: 12 }, { username: 'qsqqqqqd', userId: 2 }]);
    const [userIdOpenConv, changeActualConv] = useState(-1)
    const { message } = useContext(SocketContext);

    useEffect(() => {
        if (userIdOpenConv === message.userFrom) {
            console.log('new message')
        } else {
            console.log('profille')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])
//charger les conversations active depuis la bdd
//les poser dans BrowsingChatProfiles


//changer de conv sur un click mettre le bonne id dans userIdOpenConv
//charger le conv depuis chat avec un apelle en bdd
//push le message dans la liste des messages de la conv si la conv actuelle est ouverte
//sinons trouver l'utilisteur dans la liste des profiles 
//mettre le message a 1 


    return (
        <div style={containerStyle}>
            <Paper sx={{ width: '250px' }}>
                <p>{message.message}</p>
                <br />
                <br />
                <br />
                <BrowsingChatProfiles profiles={profiles} />
            </Paper>

            <Paper>
                <Paper id="style-1" >
                    <MessageLeft
                        message="あめんぼあかいなあいうえお"
                        timestamp="MM/DD 00:00"
                        photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                        displayName=""
                        avatarDisp={true}
                    />

                    <MessageLeft
                        message="xxxxxhttps://yahoo.co.jp xxxxxxxxxあめんぼあかいなあいうえおあいうえおかきくけこさぼあかいなあいうえおあいうえおかきくけこさぼあかいなあいうえおあいうえおかきくけこさいすせそ"
                        timestamp="MM/DD 00:00"
                        photoURL=""
                        displayName="テスト"
                        avatarDisp={false}
                    />
                    <MessageRight
                        message="messageRあめんぼあかいなあいうえおあめんぼあかいなあいうえおあめんぼあかいなあいうえお"
                        timestamp="MM/DD 00:00"
                        photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                        displayName="まさりぶ"
                        avatarDisp={true}
                    />
                    <MessageRight
                        message="messageRあめんぼあかいなあいうえおあめんぼあかいなあいうえお"
                        timestamp="MM/DD 00:00"
                        photoURL="https://lh3.googleusercontent.com/a-/AOh14Gi4vkKYlfrbJ0QLJTg_DLjcYyyK7fYoWRpz2r4s=s96-c"
                        displayName="まさりぶ"
                        avatarDisp={false}
                    />
                </Paper>
                <TextInput />
            </Paper>
        </div >
    );
}
