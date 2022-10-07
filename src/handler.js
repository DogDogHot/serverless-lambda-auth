const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
});

let isReady = false;
module.exports.handler = async (event) => {
  if (!isReady) {
    await client.connect();
    isReady = true;
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
