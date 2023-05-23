import express, { Request, Response, NextFunction } from 'express';

export function checkDataProfilCreate(req: Request, res: Response, next: NextFunction) {
    const { userName, email, firstName, lastName, password } = req.body
    const passwordRegex = /(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

    console.log('COUCOU----------------------', userName, email, firstName, lastName, password)
    if(!userName || !email || !firstName || !lastName || !password){
        return res.status(405).send('Missing required data');
    }
    if (!passwordRegex.test(password)){
        return res.status(406).send('to easy password');
    }
    if (!emailRegex.test(email)){
        return res.status(406).send('don t lokk like email');
    }
    console.log('work')
    next();
 }