const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_URL);

const getUserList = function (req, res) {
  res.send("root");
};
const getMeInfo = function (req, res) {
  res.send("userMe");
};

const createUser = async function (req, res) {
  const { userId, password, name } = req.body;
  if (!userId || !password || !name)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  //joi 추가
  let userInfo = await redis.get(`user:${userId}`);
  //password 암호화
  const secretPwd = password;
  if (userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  await redis.set(
    `user:${userId}`,
    JSON.stringify({ password: secretPwd, name })
  );
  const result = await redis.get("key");
  res.status(201).json({ code: 2010, msg: "create User" });
};

const login = async function (req, res) {
  const { userId, password } = req.body;
  if (!userId || !password)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  //joi 추가
  let userInfo = await redis.get(`user:${userId}`);
  if (!userInfo)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  //password 암호화
  const secretPwd = password;

  const { password: userPassword, name } = JSON.parse(userInfo);
  if (secretPwd != userPassword)
    return res.status(400).json({ code: 4000, msg: "validation error" });

  res.status(200).json({ code: 2000, data: { name } });
};

module.exports = { getUserList, getMeInfo, createUser, login };
