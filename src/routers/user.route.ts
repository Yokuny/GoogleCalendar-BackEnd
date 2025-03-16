import { Router } from "express";
import * as controller from "../controllers/user.controller";
import { validBody, validToken } from "../middlewares";
import { SignUpSchema, SignInSchema, GoogleTokenSchema } from "../schemas/user.schema";

const userRoute = Router();

userRoute.post("/signup", validBody(SignUpSchema), controller.signup);
userRoute.post("/signin", validBody(SignInSchema), controller.signin);

userRoute.use(validToken);
userRoute.put("/update", validBody(SignUpSchema), controller.updateUser);
userRoute.post("/google/token", validBody(GoogleTokenSchema), controller.setGoogleToken);
userRoute.get("/google/access_token", controller.getGoogleToken);

export { userRoute };
