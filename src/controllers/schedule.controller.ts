import { Response, NextFunction } from "express";
import * as service from "../services/schedule.service";
import { respObj } from "../helpers/responsePattern.helper";
import type { AuthReq } from "../models/interfaces.type";

export const getSchedule = async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const resp = await service.getScheduleRegister(req.userAndEmail.user, req.params.id);

    return res.status(200).json(respObj(resp));
  } catch (err) {
    next(err);
  }
};

export const postSchedule = async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const resp = await service.postSchedule(req.userAndEmail.user, req.body);

    return res.status(201).json(respObj(resp));
  } catch (err) {
    next(err);
  }
};

export const putSchedule = async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const resp = await service.updateSchedule(req.userAndEmail.user, req.params.id, req.body);

    return res.status(200).json(respObj(resp));
  } catch (err) {
    next(err);
  }
};

export const deleteSchedule = async (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const resp = await service.deleteSchedule(req.userAndEmail.user, req.params.id);

    return res.status(200).json(respObj(resp));
  } catch (err) {
    next(err);
  }
};
