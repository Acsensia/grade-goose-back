//imports
import express, { json } from 'express';
import dotenv from 'dotenv';
import mainrouter from './src/routers/mainrouters.js'

//.setup
const app = express();
//.setup->environment
dotenv.config({path: './config/.env'});
//.setup->middleware
app.use(json());

//passing all requests to the main router
app.get('/', mainrouter);

//starting the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
