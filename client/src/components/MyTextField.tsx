import React from "react";
import { TextField } from "@mui/material";

interface MyTextFieldProps {
  label?: string;
  value?: string;
  setState?: React.Dispatch<React.SetStateAction<string>>;
}

const MyTextField: React.FC<MyTextFieldProps> = ({ label = "", value = "", setState = () => { } }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (label === 'Birthdate (YYYY-MM-DD)') {
      const date = e.target.value;
      if (date.length === 4 || date.length === 7) {
        if (date.length < value.length) {
          setState(value.slice(0, -2));
        } else {
          setState(date + "-")
        }
      } else if (date.length <= 10) {
        setState(date)
      }
    } else {
      setState(e.target.value);
    }
  }

  return (
    <TextField
      fullWidth
      variant="standard"
      label={label}
      value={value}
      onChange={handleChange}
      sx={{ my: 1 }}
    />
  )
}

export default MyTextField;