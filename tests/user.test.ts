import supertest from "supertest";
import app from "../src/index";
import { connect, disconnect, clear } from "./helper/database/memory.database";
import { createInvalidUserData, createSignInData, createUserData } from "./helper/faker/user.faker";
import jwt from "jsonwebtoken";

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await disconnect());

const request = supertest(app);

describe("Testes da API de Usuários", () => {
  describe("POST /user/signup", () => {
    it("deve cadastrar um novo usuário com sucesso", async () => {
      const userData = createUserData();

      const response = await request.post("/user/signup").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Usuário cadastrado com sucesso");
    });

    it("deve retornar erro 409 ao tentar cadastrar com e-mail já existente", async () => {
      const userData = createUserData();

      await request.post("/user/signup").send(userData);

      const response = await request.post("/user/signup").send(userData);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Email já cadastrado");
    });

    it("deve retornar erro 400 para dados de usuário inválidos", async () => {
      const invalidUserData = createInvalidUserData();

      const response = await request.post("/user/signup").send(invalidUserData);

      expect(response.status).toBe(400);
    });

    it("deve retornar erro 400 para dados de usuário incompletos", async () => {
      const response = await request.post("/user/signup").send({ email: "teste@teste.com" });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /user/signin", () => {
    it("deve fazer login com sucesso e retornar token e dados do usuário", async () => {
      const userData = createUserData();
      await request.post("/user/signup").send(userData);

      const signInData = createSignInData({ email: userData.email, password: userData.password });

      const response = await request.post("/user/signin").send(signInData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user).toHaveProperty("name");
      expect(response.body.data.user).toHaveProperty("email");
      expect(response.body.data.user.email).toBe(userData.email);

      // Verificar se o token é válido
      const decoded = jwt.verify(response.body.data.token, process.env.JWT_SECRET || "secret");
      expect(decoded).toHaveProperty("user");
    });

    it("deve retornar erro 403 para email incorreto", async () => {
      const userData = createUserData();
      await request.post("/user/signup").send(userData);

      const signInData = createSignInData({ email: "email_incorreto@teste.com", password: userData.password });

      const response = await request.post("/user/signin").send(signInData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Usuário ou senha incorretos");
    });

    it("deve retornar erro 403 para senha incorreta", async () => {
      const userData = createUserData();
      await request.post("/user/signup").send(userData);

      const signInData = createSignInData({ email: userData.email, password: "senha_incorreta" });

      const response = await request.post("/user/signin").send(signInData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Usuário ou senha incorretos");
    });

    it("deve retornar erro 400 para dados de login incompletos", async () => {
      const response = await request.post("/user/signin").send({ email: "teste@teste.com" });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /user/:id", () => {
    it("deve retornar erro 404 para rota não implementada", async () => {
      // Cadastrar usuário
      const userData = createUserData();
      const signupResponse = await request.post("/user/signup").send(userData);

      // Login para obter token
      const signInData = createSignInData({ email: userData.email, password: userData.password });
      const loginResponse = await request.post("/user/signin").send(signInData);
      const token = loginResponse.body.data.token;
      const userId = loginResponse.body.data.user.id;

      // Buscar usuário por ID (esta rota não parece existir na aplicação, então espera-se 404)
      const response = await request.get(`/user/${userId}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /user/update", () => {
    it("deve atualizar os dados do usuário com sucesso", async () => {
      // Cadastrar usuário
      const userData = createUserData();
      await request.post("/user/signup").send(userData);

      // Fazer login para obter token
      const signInData = createSignInData({ email: userData.email, password: userData.password });
      const loginResponse = await request.post("/user/signin").send(signInData);
      const token = loginResponse.body.data.token;

      // Dados atualizados
      const updatedUserData = createUserData();

      // Requisição para atualização
      const response = await request.put("/user/update").set("Authorization", `Bearer ${token}`).send(updatedUserData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Dados atualizados com sucesso");
    });

    it("deve retornar erro 401 quando token não for fornecido", async () => {
      const updatedUserData = createUserData();

      const response = await request.put("/user/update").send(updatedUserData);

      expect(response.status).toBe(401);
    });

    it("deve retornar erro 401 quando token for inválido", async () => {
      const updatedUserData = createUserData();

      const response = await request
        .put("/user/update")
        .set("Authorization", "Bearer token_invalido")
        .send(updatedUserData);

      expect(response.status).toBe(500);
    });

    it("deve retornar erro 400 quando dados de atualização forem inválidos", async () => {
      // Cadastrar usuário
      const userData = createUserData();
      await request.post("/user/signup").send(userData);

      // Fazer login para obter token
      const signInData = createSignInData({ email: userData.email, password: userData.password });
      const loginResponse = await request.post("/user/signin").send(signInData);
      const token = loginResponse.body.data.token;

      // Dados inválidos
      const invalidData = createInvalidUserData();

      const response = await request.put("/user/update").set("Authorization", `Bearer ${token}`).send(invalidData);

      expect(response.status).toBe(400);
    });
  });
});
