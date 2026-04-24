//imports
import express, { json } from 'express';
import dotenv from 'dotenv';
//imports->project
import mainrouter from './src/routers/mainrouters.js';
import * as mysqlManagement from './src/startup/databases/mysql/mysqlManagement.js';

//.setup
const app = express();
//.setup->environment
dotenv.config({path: './config/.env'});
//.setup->middleware
app.use(json());

//starting the server
startServer();

//server start procedure
//allows for automatic server shutdown if db connection failed
async function startServer() {
    //clearing the console
    console.clear();

    //trying to connect
    const connection = await mysqlManagement.connect();

    //passing all requests to the main router
    app.use('/', mainrouter);

    //starting the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}