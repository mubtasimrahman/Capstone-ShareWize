import express, { Request, Response } from "express";
import * as sql from 'mssql';

const app = express();
const port = 8000;

const config: sql.config = {
    user: "adminsharewize",
    password: "Sh4reW1ze123.",
    server: "sharewize-1.cci3zj5kplom.ca-central-1.rds.amazonaws.com",
    port: 1433,
    database: "",
    options: {
        encrypt: true, // Use this option if you're on Windows Azure
        trustServerCertificate: true
    },
};

// Route for the root path
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, this is the root path!");
});

// Route for the /api path
app.get("/api", (req: Request, res: Response) => {
    res.json({ "users": ["1", "2", "3"] });
    sql.connect(config)
        .then(() => {
            console.log('Connected to SQL Server on localhost');
            // Perform database operations here
        })
        .catch((err: any) => {
            console.error('Error connecting to SQL Server:', err);
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
