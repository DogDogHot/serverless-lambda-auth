const Redis = require("ioredis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_URL);

const getUser = async (userId) => {
  return await redis.get(`user:${userId}`);
};

const getUserList = async () => {
  let users = (await redis.keys(`user:*`)) || [];
  users = users.map((v) => v.split(":")[1]);
  return users;
};

const createUser = async ({ userId, password, name }) => {
  const secretPwd = await bcrypt.hash(password, saltRounds);
  await redis.set(
    `user:${userId}`,
    JSON.stringify({ password: secretPwd, name })
  );
};

const login = async ({ userId, password, name }) => {
  await redis.set(`user:${userId}`, JSON.stringify({ password, name }));
};

const getJwt = async ({ userId, name }) => {
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
