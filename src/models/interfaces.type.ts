import { Request } from "express";
import { ObjectId } from "mongodb";

export type UserAndEmail = {
  user: string;
  email: string;
};

export type AuthReq = Request & { userAndEmail: UserAndEmail };
