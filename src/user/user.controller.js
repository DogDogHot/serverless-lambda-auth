const Redis = require("ioredis");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const {
  userValidation: { userCreateSchema, userLoginSchema },
} = require("../utils/validation");
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_URL);

const getUserList = function (req, res) {
  res.send("root");
};
const getMeInfo = function (req, res) {
  res.send("userMe");
};

const createUser = async function (req, res) {
  const { userId, password, name } = req.body;

  //validation
  try {
    await userCreateSchema.validateAsync(req.body);
  } catch (e) {
    return res.status(400).json({ code: 4000, msg: "validation error" });
  }
  const userInfo = await redis.get(`user:${userId}`);
  if (userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  //password 암호화
  const secretPwd = await bcrypt.hash(password, saltRounds);

  await redis.set(
    `user:${userId}`,
    JSON.stringify({ password: secretPwd, name })
  );

  // jwt token 추가
  const accessToken = jwt.sign({ name }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ name }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  return res.status(201).json({
    code: 2010,
    msg: "create User",
    data: { accessToken, refreshToken },
  });
};

const login = async function (req, res) {
  const { userId, password } = req.body;

  //validation
  try {
    await userLoginSchema.validateAsync(req.body);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ code: 4000, msg: "validation error" });
  }

  const userInfo = await redis.get(`user:${userId}`);
  if (!userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  const { password: userPassword, name } = JSON.parse(userInfo);

  //password compare
  const match = await bcrypt.compare(password, userPassword);
  if (!match)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  // jwt token 추가
  const accessToken = jwt.sign({ name }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ name }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });

  res.status(200).json({ code: 2000, data: { accessToken, refreshToken } });
};

module.exports = { getUserList, getMeInfo, createUser, login };
