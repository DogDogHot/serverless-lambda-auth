const Redis = require("ioredis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { off } = require("../app");

const saltRounds = 10;

const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_URL);

getUser = async (userId) => {
  return await redis.get(`user:${userId}`);
};

getUserList = async () => {
  let users = (await redis.keys(`user:*`)) || [];
  users = users.map((v) => v.split(":")[1]);
  return users;
};

createUser = async ({ userId, password, name }) => {
  const secretPwd = await bcrypt.hash(password, saltRounds);
  await redis.set(
    `user:${userId}`,
    JSON.stringify({ password: secretPwd, name })
  );
};

login = async ({ userId, password, name }) => {
  await redis.set(`user:${userId}`, JSON.stringify({ password, name }));
};

getJwt = async ({ userId, name }) => {
  const accessToken = jwt.sign({ userId, name }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ userId, name }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

module.exports = { getUser, createUser, login, getJwt, getUserList };
