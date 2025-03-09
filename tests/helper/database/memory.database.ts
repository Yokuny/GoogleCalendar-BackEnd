import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoDB: MongoMemoryServer | null = null;

export const connect = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Conexão ativa com o banco de dados");
      return;
    }

    mongoDB = await MongoMemoryServer.create();
    const uri = mongoDB.getUri();

    await mongoose.connect(uri);
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados teste:", error);
    throw error;
  }
};

export const clear = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error("Erro ao limpar as coleções:", error);
    throw error;
  }
};

export const disconnect = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await clear();
      await mongoose.disconnect();
      if (mongoDB) {
        await mongoDB.stop();
        mongoDB = null;
      }
    }
  } catch (error) {
    console.error("Erro ao desconectar do banco de dados:", error);
    throw error;
  }
};
