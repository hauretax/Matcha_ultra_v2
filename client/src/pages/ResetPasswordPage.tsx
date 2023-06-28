import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MyLink from '../components/MyLink';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import React, { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface IFields {
    [key: string]: string;
}

interface ISetErrors {
    [key: string]: React.Dispatch<React.SetStateAction<string | null>>;
}

function ResetPasswordPage() {
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState<boolean>(false)


    let navigate = useNavigate();
    let auth = useAuth();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {


        event.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code') as string;
        const email = params.get('email') as string;

        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        const errors: (string | null)[] = [null, null]


        const fields: IFields = {
            password,
            confirmPassword,
        };

        const setErrors: ISetErrors = {
            password: setPasswordError,
            confirmPassword: setConfirmPasswordError,
        };

        const validations = [
            {
                field: 'password',
                test: (value: string) => value.length >= 8,
                error: 'Password should be at least 8 characters long',
            },
            {
                field: 'confirmPassword',
                test: (value: string) => value === password,
                error: 'Confirm password does not match the password',
            },
        ];

        validations.forEach(({ field, test, error }, idx) => {
            const setError = setErrors[field];
            const fieldValue = fields[field];
            errors[idx] = test(fieldValue) ? null : error;
            setError(errors[idx]);
        });

        if (errors.every(e => e === null)) {
            await auth.resetPassword(email, code, password)
            navigate('/login')
        }
    }

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset password
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            error={passwordError !== null}
                            helperText={passwordError}
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={confirmPasswordError !== null}
                            helperText={confirmPasswordError}
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm password"
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <MyLink to="/login" variant="body2">
                                Remember your password? Sign in
                            </MyLink>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default ResetPasswordPage