import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";

import { env } from "../config/env.config";
import { cookieOptions } from "../config/cookie.config";
import { CustomError } from "../models";
import { getUserById } from "../services/user.service";
import type { AuthReq, UserAndEmail } from "../models";

export const validToken = async (req: AuthReq, res: Response, next: NextFunction) => {
  const authCookie = req.cookies.auth;
  const headerToken = req.header("Authorization");
  const authHeader = headerToken?.split(" ")[1];

  const token = authCookie || authHeader;

  try {
    if (!token) throw new CustomError("Token não encontrado", 401);

    const { user, email } = jwt.verify(token, env.JWT_SECRET) as UserAndEmail;
    if (!user) throw new CustomError("Token inválido", 401);

    const userFound = await getUserById(user);
    if (!userFound) throw new CustomError("Usuário não encontrado", 404);

    const userAndEmail = { user: String(userFound._id), email: userFound.email || email };
    const newToken = jwt.sign(userAndEmail, env.JWT_SECRET, { expiresIn: "7d" });

    req.userAndEmail = userAndEmail;
    res.cookie("auth", newToken, cookieOptions);
    return next();
  } catch (err) {
    next(err);
  }
};
