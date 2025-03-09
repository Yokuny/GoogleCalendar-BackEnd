import { faker } from "@faker-js/faker";

export const createScheduleData = (overrides = {}) => {
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1);

  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);

  return {
    description: faker.lorem.words({ min: 2, max: 5 }).slice(0, 30),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    ...overrides,
  };
};

export const createInvalidScheduleData = () => {
  return {
    description: "ab", // Muito curto (mínimo é 5)
    startTime: "data-invalida",
    endTime: "data-invalida",
  };
};

export const createScheduleWithoutEndTime = () => {
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1);

  return {
    description: faker.lorem.words({ min: 2, max: 5 }).slice(0, 30),
    startTime: startTime.toISOString(),
  };
};
