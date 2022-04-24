"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "serverless 주과장님 test",
      },
      null,
      2
    ),
  };
};
