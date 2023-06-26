import { Typography } from "@mui/material";


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '} Huggo & Antoine {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;