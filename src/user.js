const { createClient } = require("redis");

const client = createClient(6379, process.env.REDIS_URL);

let isReady = false;
module.exports.handler = async (event) => {
  if (!isReady) {
    await client.connect();
  }
  await client.set("key", "value");
  const result = await client.get("key");
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
