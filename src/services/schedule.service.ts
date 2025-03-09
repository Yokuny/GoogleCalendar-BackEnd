import { ObjectId } from "mongodb";
import * as respository from "../repositories/schedule.repository";
import { stringToData } from "../helpers/convert.helper";
import { returnMessage, returnData, returnDataMessage } from "../helpers/responsePattern.helper";
import type { ServiceRes } from "../helpers/responsePattern.helper";
import { CustomError } from "../models";
import type { NewSchedule } from "../models";

const getSchedule = async (id: string) => {
  const schedule = await respository.getScheduleById(id);
  if (!schedule) throw new CustomError("Agendamento não encontrado", 404);

  return schedule;
};

const getAllSchedules = async (id: string) => {
  const schedules = await respository.getAllSchedules(id);
  if (!schedules) throw new CustomError("Agendamentos não encontrados", 404);

  return schedules;
};

export const getScheduleRegister = async (userID: string, id: string): Promise<ServiceRes> => {
  if (id) return returnData(await getSchedule(id));

  const schedules = await getAllSchedules(userID);

  if (!schedules || schedules.length === 0) return returnMessage("Nenhum agendamento encontrado");
  return returnData(schedules);
};

const checkDate = (data: NewSchedule) => {
  const startTime = stringToData(data.startTime);
  const endTime = stringToData(data.endTime);
  if (endTime && startTime > endTime) throw new CustomError("Data inicial maior que a final", 406);
};

export const postSchedule = async (userID: string, data: NewSchedule): Promise<ServiceRes> => {
  const hasEndTime = data.endTime && data.endTime !== "";
  if (hasEndTime) checkDate(data);

  const newSchedule = {
    ...data,
    User: new ObjectId(userID),
  };

  const register = await respository.postSchedule(newSchedule);
  if (register) {
    return returnDataMessage({}, "Agendamento criado com sucesso");
  }
  throw new CustomError("Erro ao cadastrar agendamento", 502);
};

export const updateSchedule = async (user: string, id: string, data: NewSchedule): Promise<ServiceRes> => {
  const schedule = await getSchedule(id);
  if (String(schedule.User) !== user) throw new CustomError("Agendamento não pertence ao usuário", 406);

  data.endTime && checkDate(data);

  const update = await respository.updateSchedule(new ObjectId(schedule._id), data);
  if (update) return returnMessage("Agendamento atualizado");

  throw new CustomError("Erro ao atualizar agendamento", 502);
};

export const deleteSchedule = async (user: string, id: string): Promise<ServiceRes> => {
  const schedule = await getSchedule(id);
  if (String(schedule.User) !== user) throw new CustomError("Agendamento não pertence ao usuário", 406);
  const register = await respository.deleteSchedule(new ObjectId(schedule._id));

  if (register.deletedCount === 1) return returnMessage("Agendamento deletado");
  else throw new CustomError("Agendamento não deletado", 406);
};
