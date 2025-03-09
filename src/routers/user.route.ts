import { Router } from "express";
import * as controller from "../controllers/user.controller";
import { validBody, validToken } from "../middlewares";
import { SignUpSchema, SignInSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.post("/signup", validBody(SignUpSchema), controller.signup);
userRoute.post("/signin", validBody(SignInSchema), controller.signin);

userRoute.use(validToken);
userRoute.put("/update", validBody(SignUpSchema), controller.updateUser);

export { userRoute };
