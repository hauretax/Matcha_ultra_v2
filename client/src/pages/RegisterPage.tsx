import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import MyLink from '../components/MyLink';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface IFields {
  [key: string]: string;
}

interface ISetErrors {
  [key: string]: React.Dispatch<React.SetStateAction<string | null>>;
}

function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [firstNameError, setFirstNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  let navigate = useNavigate();
  let auth = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let username = formData.get("username") as string;
    let email = formData.get("email") as string;
    let firstName = formData.get("firstName") as string;
    let lastName = formData.get("lastName") as string;
    let password = formData.get("password") as string;
    let confirmPassword = formData.get("confirmPassword") as string;

    const errors: (string | null)[] = [null, null, null, null, null, null]
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const fields: IFields = {
      username,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    const setErrors: ISetErrors = {
      username: setUsernameError,
      firstName: setFirstNameError,
      lastName: setLastNameError,
      email: setEmailError,
      password: setPasswordError,
      confirmPassword: setConfirmPasswordError,
    };

    const validations = [
      {
        field: 'username',
        test: (value: string) => value.length >= 4,
        error: 'Username must be at least 4 characters long',
      },
      {
        field: 'firstName',
        test: (value: string) => value !== '',
        error: 'First name cannot be empty',
      },
      {
        field: 'lastName',
        test: (value: string) => value !== '',
        error: 'Last name cannot be empty',
      },
      {
        field: 'email',
        test: (value: string) => emailPattern.test(value),
        error: 'Email address is not valid',
      },
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
      await auth.signup(username, email, firstName, lastName, password)
      navigate('/login');
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const prefill = () => {
    const preFilledValues: { [key: string]: string } = {
      'username': "tonio",
      'firstName': "Antoine",
      'lastName': "Labalette",
      'email': "labalette@gmail.com",
      'password': "@Antoine1",
      'confirmPassword': "@Antoine1",
    };

    Object.keys(preFilledValues).forEach((fieldName) => {
      const inputField = document.getElementById(fieldName) as HTMLInputElement;
      if (inputField) {
        inputField.value = preFilledValues[fieldName] as string;
      }
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <Button onClick={() => prefill()}>Prefill</Button>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={usernameError !== null}
                helperText={usernameError}
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={firstNameError !== null}
                helperText={firstNameError}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={lastNameError !== null}
                helperText={lastNameError}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={emailError !== null}
                helperText={emailError}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MyLink to="/login" variant="body2">
                Already have an account? Sign in
              </MyLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;