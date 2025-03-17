import { User } from "../database";
import type { SignUp } from "../models";

const projection = { __v: 0 };

export const signup = (data: SignUp) => {
  return User.create(data);
};

export const getUserById = (userID: string) => {
  return User.findById(userID, projection);
};

export const getUserByEmail = (email: string) => {
  return User.findOne({ email }, projection);
};

export const updateUser = (userID: string, data: SignUp) => {
  return User.updateOne({ _id: userID }, { $set: data });
};

export const setGoogleAccessToken = (userID: string, googleData: any) => {
  return User.updateOne({ _id: userID }, { $set: { googleAuth: googleData.googleAuth } });
};

export const setGoogleCalendarID = (userID: string, calendarID: string) => {
  return User.updateOne({ _id: userID }, { $set: { googleCalendarID: calendarID } });
};
