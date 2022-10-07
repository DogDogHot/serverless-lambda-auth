const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_URL);

module.exports.handler = async (event) => {
  await redis.set("key", "value");
  const result = await redis.get("key");
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        user: result,
      },
      null,
      2
    ),
  };
};
