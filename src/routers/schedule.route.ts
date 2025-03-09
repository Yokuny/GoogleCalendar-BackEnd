import { Router } from "express";
import * as controller from "../controllers/schedule.controller";
import { scheduleSchema, idSchema, idSchemaOptional } from "../schemas";
import { validBody, validParams, validToken } from "../middlewares";

const scheduleRoute = Router();
scheduleRoute.use(validToken);

scheduleRoute.get("/", controller.getSchedule);
scheduleRoute.get("/:id", validParams(idSchemaOptional), controller.getSchedule);
scheduleRoute.post("/", validBody(scheduleSchema), controller.postSchedule);
scheduleRoute.put("/:id", validBody(scheduleSchema), validParams(idSchema), controller.putSchedule);
scheduleRoute.delete("/:id", validParams(idSchema), controller.deleteSchedule);

export { scheduleRoute };
