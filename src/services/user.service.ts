import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";

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
  const user = await getUserById(userID);
  if (user.email !== data.email) {
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) throw new CustomError("Email já cadastrado", 409);
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const newUser = {
    name: data.name,
    email: data.email,
    password: data.password,
  } as SignUp;

  await repository.updateUser(userID, newUser);

  return returnMessage("Usuário atualizado com sucesso");
};

export const setGoogleToken = async (userID: string, token: string): Promise<ServiceRes> => {
  await getUserById(userID);

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectURI = process.env.GOOGLE_REDIRECT_URI_LOCAL;

  const endpoint = "https://oauth2.googleapis.com/token";
  const body = {
    client_id: clientID,
    client_secret: clientSecret,
    code: token,
    redirect_uri: redirectURI,
    grant_type: "authorization_code",
  };

  const { data } = await axios.post(endpoint, body);

  const googleAuthData = {
    googleAuth: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
  };

  await repository.setGoogleAccessToken(userID, googleAuthData);
  return returnMessage("Usuário atualizado com sucesso");
};

export const refreshGoogleToken = async (userID: string): Promise<{ accessToken: string; expiresAt: Date }> => {
  const user = await getUserById(userID);
  if (!user.googleAuth) throw new CustomError("Usuário não possui token de acesso do Google", 400);

  const { accessToken, refreshToken, expiresAt } = user.googleAuth;
  if (expiresAt > new Date()) return { accessToken, expiresAt };

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const endpoint = "https://oauth2.googleapis.com/token";
  const body = {
    client_id: clientID,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  const { data } = await axios.post(endpoint, body);
  if (!data.access_token) throw new CustomError("Erro ao atualizar token de acesso do Google", 400);

  const access_token = data.access_token;
  const expires_in = new Date(Date.now() + data.expires_in * 1000);

  const googleAuthData = {
    googleAuth: {
      accessToken: access_token,
      refreshToken: refreshToken,
      expiresAt: expires_in,
    },
  };

  await repository.setGoogleAccessToken(userID, googleAuthData);

  return { accessToken: access_token, expiresAt: expires_in };
};

export const googleRefreshToken = async (userID: string): Promise<ServiceRes> => {
  const user = await refreshGoogleToken(userID);

  return returnData({ accessToken: user.accessToken, expiresAt: user.expiresAt });
};

const createGoogleCalendar = async (userID: string) => {
  try {
    const user = await refreshGoogleToken(userID);
    const { accessToken } = user;

    const endpoint = "https://www.googleapis.com/calendar/v3/calendars";
    const body = {
      summary: "DentalEase",
      description: "Agendamentos",
      timeZone: "America/Sao_Paulo",
    };
    const header = { headers: { Authorization: `Bearer ${accessToken}` } };

    const { data } = await axios.post(endpoint, body, header);
    if (!data.id) throw new CustomError("Erro ao criar calendário do Google", 400);

    await repository.setGoogleCalendarID(userID, data.id);
    return data.id;
  } catch (e) {}
};

export const getGoogleCalendarID = async (userID: string) => {
  const user = await getUserById(userID);
  if (user.googleCalendarID) return user.googleCalendarID;

  const calendarID = await createGoogleCalendar(userID);
  return calendarID;
};
