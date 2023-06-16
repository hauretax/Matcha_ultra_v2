import { Request, Response, NextFunction } from 'express';

const globalErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.stack)
  return res.status(500).send("Une erreur est survenue sur le serveur.");
}

export default globalErrorMiddleware
