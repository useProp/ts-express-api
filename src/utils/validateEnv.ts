import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  return cleanEnv(process.env, {
    POSTGRES_DB: str(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_PORT: port(),
    POSTGRES_HOST: str(),
    PORT: port(),
    JWT_SECRET: str(),
  });
}

export default validateEnv;