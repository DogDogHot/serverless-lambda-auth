"use strict";

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `serverless test
        createdAt : 22-10-02`,
      },
      null,
      2
    ),
  };
};
