import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import express from 'express'
const app = express()
import notFoundMiddleware from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'
import connectDB from './db/connect.js'
import authRouter from './routes/authRoutes.js'
import jobRouter from './routes/jobRoutes.js'
import morgan from 'morgan';
import authenticateUser from './middleware/auth.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';


if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json())

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get('/', (req,res) => {
    //throw new Error('new error')
    res.send('welcome')
})

app.get('/api/v1', (req,res) => {
    //throw new Error('new error')
    res.json({msg:'welcome'})
})

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobRouter)

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  });

app.use(notFoundMiddleware)
app.use(errorHandler)
const port = process.env.port || 5000



const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`server is listening to ${port} no`)
        })
    } catch (err) {
        console.log(err)
    }
    
}

start()