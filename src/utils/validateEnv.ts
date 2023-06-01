import { cleanEnv, str, port } from 'envalid';

function validateEnv() {
  return cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
    MONGO_PASSWORD: str(),
    MONGO_USER: str(),
    MONGO_PATH: str(),
  });
}

export default validateEnv;