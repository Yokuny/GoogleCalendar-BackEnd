import { Router } from "express";

const googleAuthRoute = Router();

googleAuthRoute.get("/google", (req, res) => {
  res.status(200).json({ message: "Rota para iniciar autenticação com Google" });
});

export { googleAuthRoute };
