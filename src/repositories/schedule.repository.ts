import { ObjectId } from "mongodb";
import { Schedule } from "../database/schedule.database";
import type { NewSchedule } from "../models";

const excludeFields = { __v: 0 };

export const getScheduleById = async (id: string) => {
  return Schedule.findById(id, excludeFields).lean();
};

export const getAllSchedules = async (userID: string) => {
  return Schedule.find({ User: new ObjectId(userID) }, excludeFields).lean();
};

export const postSchedule = (data: NewSchedule) => {
  return Schedule.create(data);
};

export const updateSchedule = (_id: ObjectId, data: NewSchedule) => {
  return Schedule.updateOne({ _id }, data);
};

export const deleteSchedule = (_id: ObjectId) => {
  return Schedule.deleteOne({ _id });
};
