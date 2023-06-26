import { Container } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ValideMailPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const start = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code') || "";
            const email = params.get('email') || "";
            if (!code || !email) {
                navigate("/404")
            }
            try {
                await auth.valideByMail(email, code)
                navigate("/login")
            } catch (err) {
                alert(err)
            }
        }

        start()
    }, [auth , navigate]);

    return (
        <Container component="main" maxWidth="xs">
            a
        </Container>
    )
}