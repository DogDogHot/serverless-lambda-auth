const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const usersRoute = require("./user/index");
const errorHandler = require("./middlewares/errorHandler.middleware");
const { NotFoundError } = require("./helpers/errors.helper");

const app = express();

app.use(
  morgan(
    `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]  :response-time ms ":referrer" ":user-agent"`,
    {
      skip(req) {
        if (req.method === "OPTIONS") {
          return true;
        }
        return false;
      },
    }
  )
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1/", usersRoute);

app.all("*", (_, res) => {
  throw new NotFoundError("Resource not found on this server!!");
});
app.use(errorHandler);

module.exports = app;
