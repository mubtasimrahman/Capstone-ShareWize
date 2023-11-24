import path from 'path'
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import sql from 'mssql';

const __dirname = path.resolve()

// Deployment configuration
//configure env file in dev mode
dotenv.config()


const config = {
    user: "adminsharewize",
    password: "Sh4reW1ze123.",
    server: "sharewize-1.cci3zj5kplom.ca-central-1.rds.amazonaws.com",
    port: 1433,
    database: "",
    options: {
        encrypt: true, // Use this option if you're on Windows Azure
    },
};

sql.connect(config)
    .then(() => {
        console.log('Connected to SQL Server on localhost');
        // Perform database operations here
    })
    .catch((err) => {
        console.error('Error connecting to SQL Server:', err);
    });


const app = express()

// Body parser
app.use(express.json())

// CORS
app.use(
    cors({
        origin: '*',
    })
)

// API routes
app.use('/api/user', userRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
}

// Middleware
//app.use(notFound)
//app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
        .yellow.bold
    )
)