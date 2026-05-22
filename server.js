//imports
import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
//imports->project
import { auth } from "./src/middleware/auth.js";
import { authRouter } from "./src/routers/authRouter.js";
import { accountRouter } from "./src/routers/accountRouter.js";
import { adminRouter } from "./src/routers/adminRouter.js";
import * as mysqlManagement from "./src/startup/databases/mysql/mysqlManagement.js";
import { teacherRouter } from "./src/routers/teacherRouter.js";
import { studentRouter } from "./src/routers/studentRouter.js";

//.setup
const app = express();
//.setup->environment
dotenv.config({ path: "./config/.env" });
//.setup->middleware
app.use(json());
//,setup->cookie-parsing-middleware
app.use(cookieParser());
//,setup->cors for development
if (process.env.NODE_ENV === "development")
  app.use(
    cors({
      origin: process.env.FRONTEND_DEV_URL,
      credentials: true, // sets Access-Control-Allow-Credentials: true
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

//starting the server
startServer();

//server start procedure
//allows for automatic server shutdown if db connection failed
async function startServer() {
  //clearing the console
  console.clear();

  //trying to connect
  //const connectionPool = await mysqlManagement.getConnectionPool();
  await mysqlManagement.getConnectionPool();

  //applying the auth router
  app.use("/api/auth", authRouter);

  //applying the account router
  app.use("/api/account", auth, accountRouter);

  //applying the student router
  app.use("/api/student", auth, studentRouter);

  //applying the teacher router
  app.use("/api/teacher", auth, teacherRouter);

  //applying the admin router
  app.use("/api/admin", auth, adminRouter);

  //starting the server
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
