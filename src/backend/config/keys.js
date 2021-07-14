module.exports = {
  MONGOURI: process.env.PROD
    ? `mongodb://${process.env.DB_HOST}:27017`
    : "mongodb+srv://url",
  JWT_SECRET: "abcdefg",
};
