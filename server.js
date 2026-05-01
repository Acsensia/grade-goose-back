//imports
import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
//imports->project
//import mainRouter from "./src/routers/mainRouter.js";
import { authRouter } from "./src/routers/authRouter.js";
import * as mysqlManagement from "./src/startup/databases/mysql/mysqlManagement.js";

//.setup
const app = express();
//.setup->environment
dotenv.config({ path: "./config/.env" });
//.setup->middleware
app.use(json());
//,setup->cookie-parsing-middleware
app.use(cookieParser());

//starting the server
startServer();

//server start procedure
//allows for automatic server shutdown if db connection failed
async function startServer() {
  //clearing the console
  console.clear();

  //trying to connect
  const connectionPool = await mysqlManagement.getConnectionPool();

  //passing all requests to the main router
  //app.use("/", mainRouter); // TODO keep in mind that it is not being used for now

  //applying the auth router
  app.use("/api/auth", authRouter);

  //starting the server
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
