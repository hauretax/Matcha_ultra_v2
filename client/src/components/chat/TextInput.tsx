import { Button, TextField } from '@mui/material';
import React from 'react'




export const TextInput = () => {
    return (
        <>
            <form   noValidate autoComplete="off">
            <TextField
                id="standard-text"
                label="メッセージを入力"
                //margin="normal"
            />
            <Button variant="contained" color="primary" >
            </Button>
            </form>
        </>
    )
}


