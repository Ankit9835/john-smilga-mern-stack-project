import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
import notFoundMiddleware from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'
import connectDB from './db/connect.js'

app.get('/', (req,res) => {
    //throw new Error('new error')
    res.send('welcome')
})

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