import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers["authorization"];
  
  if (typeof bearerHeader !== "undefined"){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.headers["token"] = bearerToken;

    jwt.verify(req.headers["token"], config.TOKEN_KEY!, (err, authData) => {
      if(err){
        req.headers["authData"] = '';
        next();
      }
      else{
        req.headers["authData"] = authData as string;
        next();
      }
    });
  }
  else{
    res.status(403).json({ message: "Forbidden" });
  }
};

export default verifyToken;
