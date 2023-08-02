import React, { useState } from "react";

import { TextInput } from "./TextInput";
import { MessageLeft, MessageRight } from "./Message";
import { Paper } from "@mui/material";
import BrowsingChatProfiles from "./Profiles";

export default function Chat() {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
    };
    const [profiles, setProfiles] = useState([{ username: 'qsd', userId: 12 }, { username: 'qsqqqqqd', userId: 2 }]);


    return (
        <div style={containerStyle}>
            <Paper sx={{ width: '250px' }}>
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
