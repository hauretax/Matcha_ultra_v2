import { Avatar } from "@mui/material";
import React from "react";

export const MessageLeft = (props: any) => {
    const message = props.message ? props.message : "no message";
    const timestamp = props.timestamp ? props.timestamp : "";
    const photoURL = props.photoURL ? props.photoURL : "dummy.js";
    const displayName = props.displayName ? props.displayName : "名無しさん";
    return (
        <>
            <div >
                <Avatar
                    alt={displayName}
                    src={photoURL}
                ></Avatar>
                <div>
                    <div >{displayName}</div>
                    <div >
                        <div>
                            <p >{message}</p>
                        </div>
                        <div >{timestamp}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const MessageRight = (props: any) => {
    const message = props.message ? props.message : "no message";
    const timestamp = props.timestamp ? props.timestamp : "";
    return (
        <div>
            <div >
                <p >{message}</p>
                <div >{timestamp}</div>
            </div>
        </div>
    );
};
