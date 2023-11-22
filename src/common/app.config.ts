import * as bcrypt from 'bcrypt';

export default () => ({
  env: process.env.ENV,
  port: parseInt(process.env.PORT, 10),
  authKey: process.env.AUTH_KEY,
  mongoUri: process.env.MONGO_URI,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
});
