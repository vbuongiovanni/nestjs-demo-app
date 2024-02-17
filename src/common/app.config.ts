import * as bcrypt from 'bcrypt';

export default () => {
  return {
    env: process.env.ENV,
    port: parseInt(process.env.PORT, 10),
    authKey: process.env.AUTH_KEY,
    mongoUri: process.env.MONGO_URI,
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
    // jwtSecret: process.env.JWT_SECRET,
    // jwtAudience: process.env.JWT_TOKEN_AUDIENCE,
    // jwtPrincipal: process.env.JWT_TOKEN_ISSUER,
    // jwtTimeToLive: process.env.JWT_ACCESS_TOKEN_TTL,
    // jwtRefreshTimeToLive: process.env.JWT_REFRESH_TOKEN_TTL,
  };
};
