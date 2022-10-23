const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  userValidation: { userCreateSchema, userLoginSchema },
} = require("../utils/validation");
const userService = require("./user.service");

const getUserList = function (req, res) {
  res.send("root");
};
const getMeInfo = function (req, res) {
  if (!req.headers["access-token"])
    return res.status(401).json({ code: 4010, msg: "not login" });
  try {
    const userInfo = jwt.verify(
      req.headers["access-token"],
      process.env.JWT_KEY
    );
    return res.status(200).json({
      code: 2000,
      data: {
        user: { ...userInfo },
      },
    });
  } catch (error) {
    return res.status(401).json({ code: 4010, msg: "not login" });
  }
};

const createUser = async function (req, res) {
  const { userId, password, name } = req.body;

  //validation
  try {
    await userCreateSchema.validateAsync(req.body);
  } catch (e) {
    return res.status(400).json({ code: 4000, msg: "validation error" });
  }
  const userInfo = await userService.getUser(userId);
  if (userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  await userService.createUser({
    userId,
    password,
    name,
  });

  // jwt token 추가
  const { accessToken, refreshToken } = await userService.getJwt({
    userId,
    name,
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

  const userInfo = await userService.getUser(userId);
  if (!userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  const { password: userPassword, name } = JSON.parse(userInfo);

  //password compare
  const match = await bcrypt.compare(password, userPassword);
  if (!match)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  // jwt token 추가
  const { accessToken, refreshToken } = await userService.getJwt({
    userId,
    name,
  });

  res.status(200).json({ code: 2000, data: { accessToken, refreshToken } });
};

module.exports = { getUserList, getMeInfo, createUser, login };
