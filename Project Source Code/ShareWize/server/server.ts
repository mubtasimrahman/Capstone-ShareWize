import express, { Request, Response } from "express";
import * as sql from "mssql";

const app = express();
const port = 8000;

const config: sql.config = {
  user: "adminsharewize",
  password: "Sh4reW1ze123.",
  server: "sharewize-1.cci3zj5kplom.ca-central-1.rds.amazonaws.com",
  port: 1433,
  database: "ShareWize", // Specify your database name here
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Route for the root path
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is the root path!");
});

// Route for the /api path
app.get("/api", (req: Request, res: Response) => {
  let pool: sql.ConnectionPool;
  sql
    .connect(config)
    .then((p) => {
      pool = p;
      // Insert a user into the Users table
      return pool.query(`
        INSERT INTO Users (GoogleId, DisplayName, Email)
        VALUES ('someGoogleId', 'John Doe', 'john.doe@example.com')
      `);
    })
    .then(() => {
      console.log("User inserted into the Users table.");
      res.send({ users: ["1", "2", "3"] });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server or inserting data:", err);
      res.status(500).send("Internal Server Error");
    })
    .finally(() => {
      // Close the SQL Server connection
      if (pool) {
        pool.close();
      }
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
