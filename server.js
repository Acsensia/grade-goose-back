//imports
import express, { json } from 'express';
import dotenv from 'dotenv';

//.setup
const app = express();
//.setup->environment
dotenv.config({path: './config/.env'});

//middleware?
app.use(json());

//routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//starting the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
