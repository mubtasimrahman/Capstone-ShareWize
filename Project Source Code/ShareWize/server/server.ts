import express, { Request, Response } from "express";
import * as sql from "mssql";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import cors from "cors";

const app = express();
const port = 8000;

// Update cors configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your client's origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

const CLIENT_ID =
  "507009074308-bal2u8rup2p4154mp623sg8v197sn23n.apps.googleusercontent.com";

// Route for the root path
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is the root path!");
});

app.post(
  "/groups/:groupId/users",
  cors(),
  express.json(),
  (req: Request, res: Response) => {
    const groupId = req.params.groupId;
    const { userEmail } = req.body; // Change variable name to reflect using email

    // Check if required parameters are present
    if (!groupId || !userEmail) {
      // Change variable name to reflect using email
      return res.status(400).send("Group ID and user email are required"); // Change variable name to reflect using email
    }

    // Insert the user into the specified group in the database using email
    insertUserIntoGroupByEmail(groupId, userEmail) // Change variable name to reflect using email
      .then(() => {
        // Respond with success
        res.status(201).send("User added to group successfully");
      })
      .catch((error) => {
        console.error("Error adding user to group:", error);
        res.status(500).send("Internal Server Error");
      })
      .finally(() => {
        // Any cleanup or additional logic after success or failure
      });
  }
);

app.get("/getUser/:googleId", cors(), async (req: Request, res: Response) => {
  const googleId = req.params.googleId;

  if (!googleId) {
    return res.status(400).send("Google ID is missing");
  }

  try {
    const user = await getUserByGoogleId(googleId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post(
  "/createGroup",
  cors(),
  express.json(),
  async (req: Request, res: Response) => {
    const { groupName } = req.body;

    // Check if required parameters are present
    if (!groupName) {
      return res.status(400).send("Group name is required");
    }

    try {
      // Insert the group into the database
      await insertGroupIntoDatabase(groupName);

      // Get the group ID after successfully inserting the group
      const groupID = await getGroupID(groupName);

      // Check if the group exists (groupID is not null)
      if (groupID !== null) {
        // Respond with success and send groupID
        res
          .status(201)
          .send({ message: "Group created successfully", groupID });
      } else {
        // Return a response indicating the group does not exist
        res.status(409).send({ message: "Group already exists", groupName });
      }
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      // Additional cleanup or finalization logic here
      // You can access groupID here if needed
    }
  }
);

// Handling logging in
app.post("/api", cors(), express.json(), (req: Request, res: Response) => {
  const token = req.body.token as string;
  console.log("Received request at /api");

  if (!token) {
    return res.status(400).send("Token is missing");
  }

  // Verify and decode the token, then handle the result
  verifyAndDecodeToken(token)
    .then((userObject) => insertUserIntoDatabase(userObject))
    .then(() => {
      console.log("User inserted into the Users table.");
      res.send({ users: ["1", "2", "3"] });
    })
    .catch((error) => {
      console.error(
        "Error verifying, decoding, or inserting into the database:",
        error
      );
      res.status(401).send("Unauthorized");
    })
    .finally(() => {
      // Additional cleanup or finalization logic here
    });
});

const verifyAndDecodeToken = async (token: string): Promise<TokenPayload> => {
  const client = new OAuth2Client(CLIENT_ID);

  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => {
      const payload = ticket.getPayload();

      // Check if payload is not undefined before accessing its properties
      if (payload) {
        const userid = payload.sub;

        // If needed, perform additional verification or checks here

        return payload;
      } else {
        throw new Error("Payload is undefined");
      }
    })
    .catch((error) => {
      console.error("Error verifying ID token:", error);
      throw error;
    });
};

const insertUserIntoDatabase = async (
  userObject: TokenPayload
): Promise<void> => {
  let pool: sql.ConnectionPool;

  // Connect to the database and insert the user
  return sql
    .connect(config)
    .then((p) => {
      pool = p;

      // Insert a user into the Users table
      return pool.query(`
        INSERT INTO Users (GoogleId, DisplayName, Email)
        VALUES ('${userObject.sub}', '${userObject.name}', '${userObject.email}')
      `);
    })
    .then((result) => {
      // Handle the result of the query if needed
      console.log("Query result:", result);

      // You might want to perform additional logic based on the result

      // Return void since this function is supposed to return Promise<void>
      return Promise.resolve();
    })
    .catch((error) => {
      console.error("Error connecting to SQL Server or inserting data:", error);
      throw error;
    })
    .finally(() => {
      // Close the SQL Server connection
      if (pool) {
        pool.close();
      }
    });
};

const insertGroupIntoDatabase = async (groupName: string): Promise<number> => {
  let pool: sql.ConnectionPool;

  // Connect to the database and insert the group
  return sql
    .connect(config)
    .then((p) => {
      pool = p;

      // Insert a group into the Groups table
      return pool.query(`
        INSERT INTO Groups (GroupName)
        OUTPUT INSERTED.GroupId
        VALUES ('${groupName}')
      `);
    })
    .then((result) => {
      // Handle the result of the query if needed
      console.log("Group creation result:", result);

      // Return the groupId
      return result.recordset[0].GroupId;
    })
    .catch((error) => {
      console.error(
        "Error connecting to SQL Server or inserting group:",
        error
      );
      throw error;
    })
    .finally(() => {
      // Close the SQL Server connection
      if (pool) {
        pool.close();
      }
    });
};

const getUserByGoogleId = async (googleId: string): Promise<any | null> => {
  let pool: sql.ConnectionPool | null = null;

  try {
    // Connect to the database and fetch the user by Google ID
    pool = await sql.connect(config);

    const result: sql.IResult<string> = await pool.query(`
    SELECT * FROM Users
    WHERE GoogleId = '${googleId}'
  `);

    // Return the user or null if not found
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } catch (error) {
    console.error("Error connecting to SQL Server or fetching user:", error);
    throw error;
  } finally {
    // Close the SQL Server connection
    if (pool) {
      pool.close();
    }
  }
};

async function getGroupID(groupName: string) {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("groupName", sql.NVarChar, groupName)
      .query("SELECT GroupId FROM Groups WHERE GroupName = @groupName");

    if (result.recordset.length > 0) {
      // Group exists, return the group ID
      return result.recordset[0].GroupId;
    } else {
      // Group doesn't exist, return null
      return null;
    }
  } catch (error) {
    console.error("Error getting group ID:", error);
    throw error;
  }
}

const insertUserIntoGroupByEmail = async (
  groupId: string,
  userEmail: string
): Promise<void> => {
  let pool: sql.ConnectionPool;

  // Connect to the database
  return sql
    .connect(config)
    .then(async (p) => {
      pool = p;
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        // Insert a user into the specified group in the GroupMemberships table using email
        const result = await pool
          .request()
          .input("userEmail", sql.NVarChar, userEmail)
          .input("groupId", sql.Int, groupId).query(`
            INSERT INTO GroupMemberships (UserId, GroupId)
            VALUES (
              (SELECT UserId FROM Users WHERE Email = @userEmail),
              @groupId
            )
          `);

        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
          // No user found with the specified email
          throw new Error("User not found");
        }

        await transaction.commit();
      } catch (error) {
        console.error(
          "Error connecting to SQL Server or inserting data:",
          error
        );
        await transaction.rollback();
        throw error;
      }
    })
    .finally(() => {
      // Close the SQL Server connection
      if (pool) {
        pool.close();
      }
    });
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
