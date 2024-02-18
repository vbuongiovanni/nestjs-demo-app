export default () => {
  return {
    env: process.env.ENV,
    port: parseInt(process.env.PORT, 10),
    authKey: process.env.AUTH_KEY,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtAudience: process.env.JWT_TOKEN_AUDIENCE,
    jwtPrincipal: process.env.JWT_TOKEN_ISSUER,
    jwtTimeToLive: parseInt(process.env.JWT_ACCESS_TOKEN_TTL, 10),
    jwtRefreshTimeToLive: parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10),
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT, 10),
  };
};
