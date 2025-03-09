import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import { passwordRegex } from "../../../src/helpers/regex.helper";

export const createUserData = (overrides = {}) => {
  const password = new RandExp(passwordRegex).gen();

  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password,
    ...overrides,
  };
};

export const createInvalidUserData = () => {
  return {
    name: "ab",
    email: "emailinvalido",
    password: "123",
  };
};

export const createSignInData = (user: { email: string; password: string }) => {
  return {
    email: user.email,
    password: user.password,
  };
};
