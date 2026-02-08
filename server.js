//imports
import express, { json } from 'express';
import dotenv from 'dotenv';
import mainrouter from './src/routers/mainrouters.js'
import mysql from 'mysql2/promise'

//.setup
const app = express();
//.setup->environment
dotenv.config({path: './config/.env'});
//.setup->middleware
app.use(json());

//database connection
//shuts the server down if connection failed
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host:process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASS,
            database:process.env.DB_NAME
        });
        console.log('Database connection successful');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.warn('Shutting server down.');
        process.exit(1);
    }
}

//server start procedure
//allows for automatic server shutdown if db connection failed
async function startServer() {
    //trying to connect
    const connection = await connectToDatabase();

    //passing all requests to the main router
    app.use('/', mainrouter);

    //starting the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
}

//starting the server
startServer();