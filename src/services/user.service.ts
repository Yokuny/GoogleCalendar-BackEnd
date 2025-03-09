import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as repository from "../repositories/user.repository";
import { returnMessage, returnData } from "../helpers/responsePattern.helper";
import type { ServiceRes } from "../helpers/responsePattern.helper";
import type { SignUp, SignIn } from "../models";
import { CustomError } from "../models/error.type";

export const getUserByEmail = async (email: string) => {
  return await repository.getUserByEmail(email);
};

export const getUserById = async (userID: string) => {
  const user = await repository.getUserById(userID);
  if (!user) throw new CustomError("Usuário não encontrado", 404);

  return user;
};

export const signup = async (data: SignUp): Promise<ServiceRes> => {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) throw new CustomError("Email já cadastrado", 409);

  const cryptPassword = await bcrypt.hash(data.password, 10);

  const newUser = {
    ...data,
    password: cryptPassword,
  };

  await repository.signup(newUser);

  return returnMessage("Usuário cadastrado com sucesso");
};

export const signin = async (data: SignIn): Promise<ServiceRes> => {
  const user = await getUserByEmail(data.email);
  if (!user) throw new CustomError("Usuário ou senha incorretos", 403);

  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) throw new CustomError("Usuário ou senha incorretos", 403);

  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ user: String(user._id), email: user.email }, secret, { expiresIn: "7d" });

  const secureUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return returnData({ user: secureUser, token });
};

export const updateUser = async (userID: string, data: SignUp): Promise<ServiceRes> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const newUser = {
    name: data.name,
    email: data.email,
    password: data.password,
  } as SignUp;

  await repository.updateUser(userID, newUser);

  return returnMessage("Dados atualizados com sucesso");
};
