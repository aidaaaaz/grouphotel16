const express = require('express');
const app = express();
//const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb'); // Import ObjectId
//const port = 2000;
const port = process.env.PORT || 2000 ;
const ejs = require('ejs');


const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const MongoURI = process.env.MONGODB_URI

// Swagger set up
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Hostel Visitor Management API',
//       version: '1.0.0',
//       description: 'This is a simple CRUD API application made with Express and documented with Swagger',
//     },
//     servers: [
//       {
//         url: 'https://hotel16.azurewebsites.net',
//       },
//     ],
    
//     components: {
//       securitySchemes: {
//         jwt:{
// 					type: 'http',
// 					scheme: 'bearer',
// 					in: "header",
// 					bearerFormat: 'JWT'
//         },
//       },
//     },
// 		security:[{
// 			"jwt": []
//   }]
// },
//   apis: ['./index.js'], // path to your API routes

// };

// const swaggerJSDoc = require('swagger-jsdoc');

// // Define your options object first
// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My API',
//       version: '1.0.0',
//       description: 'Description of my API',
//     },
//   },
//   apis: ['./index.js'], // Specify the paths to your route files
// };

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hostel Visitor Management API',
      version: '1.0.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'https://hotel16.azurewebsites.net',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      jwt: [],
    }],
  },
  apis: ['./index.js'], // path to your API routes
};

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// ... (your existing code)

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Now, you can use the options object to generate the swaggerSpec
//const swaggerSpec = swaggerJSDoc(options);
//app.use('./index.js', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const fs = require('fs');

// Convert the Swagger specification to JSON or YAML format (choose one)
const swaggerJson = JSON.stringify(swaggerSpec, null, 2); // For JSON
// const swaggerYaml = require('js-yaml').dump(swaggerSpec, { lineWidth: -1 }); // For YAML

// Specify the file path where you want to save the Swagger file
const Desktop = 'my-api-spec.json'; // Change the file extension to '.yaml' for YAML

// Write the Swagger specification to the file
fs.writeFileSync(Desktop, swaggerJson); // Use 'swaggerYaml' for YAML

console.log(`Swagger specification saved to ${Desktop}`);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    // Check if the user has the required role (admin or security)
    if (req.user.role !== 'admin' && req.user.role !== 'security') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};


const verifyTokenSecurity = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Expecting "Bearer TOKEN_STRING"
  try {
    const decoded = jwt.verify(token, secret);
    console.log(decoded); // Log the decoded token payload
    req.user = decoded;

    // Check if the user has the required role (security)
    if (req.user.role !== 'security') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};


// Secret key for JWT signing and encryption
//const secret = 'your-secret-key'; // Store this securely

app.use(bodyParser.json());

// MongoDB connection setup
//const uri = "your-mongodb-uri";

const secret = 'your-secret-key'; // Store this securely

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Import necessary modules once at the top of your file
const { MongoClient, ServerApiVersion } = require('mongodb');

// Other imports...

const uri = "mongodb+srv://aidazainuddin4499:TEST123@cluster0.npqrvz0.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Swagger setup and other code...

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Hostel_Visitor_Management").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// Swagger setup and other code...

run().catch(console.dir);

// Connect to MongoDB and initialize collections
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('your-database-name');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Serve the admin login page
app.get('/admin/login', (req, res) => {
  res.sendFile(__dirname + '/admin-login.html');
});



let db;
let Visitorregistration;
let adminuser;
let securityCollection; 


// Connect to MongoDB and initialize collections
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = client.db('Hostel_Visitor_Management');
    

  // Initialize collections after establishing the connection
  Visitorregistration = db.collection('visitors');
  adminuser = db.collection('admins');
  // Add this within the `run` function where you initialize collections
  securityCollection = db.collection('security');



  // Now you can safely start your server here, after the DB connection is established
  app.listen(port, () => {
    console.log(`Server is running on https://hotel16.azurewebsites.net/`);
  });
});


// In-memory data storage (replace with a database in production)
const visitors = [];
const admins = [];
const security = [];

app.use(express.json());


/**
 * @swagger
 * /registeradmin:
 *   post:
 *     summary: Register a new admin account
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Admin already exists
 */


// Admin Register New Account
app.post('/registeradmin', async (req, res) => {
  const admins = db.collection('admins');
  const { username, password } = req.body;

  const existingAdmin = await admins.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ error: 'Admin already exists' });
  }

  await admins.insertOne({ username, password });
  res.status(201).json({ message: 'Admin registered successfully' });
});
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 */

// // Serve the admin login page
// app.get('/admin/login', (req, res) => {
//   res.render('admin-login'); // Assuming 'admin-login.ejs' is in the 'views' folder
// });

app.get('/admin/login', (req, res) => {
  res.render('admin-login'); // Assuming 'admin-login.ejs' is in the 'views' folder
});

// Admin login
app.post('/admin/login', async (req, res) => {
  const admins = db.collection('admins');
  const { username, password } = req.body;

  try {
    const admin = await admins.findOne({ username, password });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create token if the admin was found
    const token = jwt.sign({ userId: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });

    res.json({ message: 'Admin authenticated successfully', accessToken: token });
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Dummy user data (replace with a proper authentication system)
// const users = [
//   { username: 'user1', password: 'password1' },
//   { username: 'user2', password: 'password2' },
// ];

// // Routes
// app.get('/', (req, res) => {
//   res.render('login');
// });

// app.post('/admin/login', async (req, res) => {
//   const admins = db.collection('admins');
//   const { username, password } = req.body;

//   const admin = await admins.findOne({ username, password });
//   if (!admin) {
//     return res.status(401).json({ error: 'Invalid username or password' });
//   }

//   // Create token if the admin was found
//   const token = jwt.sign({ userId: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });

//   res.json({ message: 'Admin authenticated successfully', accessToken: token });
// });

// ... (your existing code)

// /**
//  * @swagger
//  * /login:
//  *   post:
//  *     summary: Admin login
//  *     tags: [Admin]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - username
//  *               - password
//  *             properties:
//  *               username:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Admin authenticated successfully
//  *       401:
//  *         description: Invalid username or password
//  */

// // index.js

// // ... (your existing code)

// // Routes
// app.get('/', (req, res) => {
//   res.render('login');
// });

// // Admin login page
// app.get('/admin/login', (req, res) => {
//   res.render('admin-login');
// });

// app.post('/admin/login', async (req, res) => {
//   const admins = db.collection('admins');
//   const { username, password } = req.body;

//   const admin = await admins.findOne({ username, password });
//   if (!admin) {
//     return res.status(401).json({ error: 'Invalid username or password' });
//   }

//   // Create token if the admin was found
//   const token = jwt.sign({ userId: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });

//   res.json({ message: 'Admin authenticated successfully', accessToken: token });
// });

// ... (your existing code)

// // Admin Login
// app.post('/login', async (req, res) => {
//   const admins = db.collection('admins');
//   const { username, password } = req.body;

//   const admin = await admins.findOne({ username, password });
//   if (!admin) {
//     return res.status(401).json({ error: 'Invalid username or password' });
//   }

//   // Create token if the admin was found
//   const token = jwt.sign({ userId: admin._id, role: 'admin' }, secret, { expiresIn: '1h' });

//   res.json({ message: 'Admin authenticated successfully', accessToken: token });
// });



/**
 * @swagger
 * /registersecurity:
 *   post:
 *     summary: Register a new admin account
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Security registered successfully
 *       400:
 *         description: Security already exists
 */


// Security Register New Account
app.post('/registersecurity', async (req, res) => {
  const securityCollection = db.collection('security');
  const { username, password } = req.body;

  const existingSecurity = await securityCollection.findOne({ username });
  if (existingSecurity) {
    return res.status(400).json({ error: 'Security already exists' });
  }

  await securityCollection.insertOne({ username, password });
  res.status(201).json({ message: 'Security registered successfully' });
});

/**
 * @swagger
 * /loginsecurity:
 *   post:
 *     summary: Security login
 *     tags: [Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Security authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 */


// Security Login
app.post('/loginsecurity', async (req, res) => {
  const securityCollection = db.collection('security');
  const { username, password } = req.body;

  const security = await securityCollection.findOne({ username, password });
  if (!security) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Create token if the security personnel was found
  const token = jwt.sign({ userId: security._id, role: 'security' }, secret, { expiresIn: '1h' });

  res.json({ message: 'Security authenticated successfully', accessToken: token });
});

/**
 * @swagger
 * /registervisitor:
 *   post:
 *     summary: Register a new visitor
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visitor'
 *     responses:
 *       201:
 *         description: Visitor registered successfully
 *       500:
 *         description: Error occurred while registering the visitor
 */


// Protected route for admin registering a visitor - token required
app.post('/registervisitor', verifyToken, async (req, res) => {
  try {
    const visitors = db.collection('visitors');
    const { username, password, Name, Age, Gender, Address, Zipcode, Relation } = req.body;

    await visitors.insertOne({ username, password, Name, Age, Gender, Address, Zipcode, Relation });
    res.status(201).json({ message: 'Visitor registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the visitor' });
  }
});

// Security personnel register new visitor
app.post('/registersecurityvisitor', verifyTokenSecurity, async (req, res) => {
  try {
    // Add logic to check if the requester is a valid security personnel
    const securityCollection = db.collection('security');
    const { username } = req.user; // Assuming you store username in the token payload

    const validSecurity = await securityCollection.findOne({ username });

    if (!validSecurity) {
      return res.status(403).json({ error: 'Unauthorized. Not a valid security personnel.' });
    }

    const visitors = db.collection('visitors');
    const { Name, Age, Gender, Address, Zipcode, Relation } = req.body;

    await visitors.insertOne({ Name, Age, Gender, Address, Zipcode, Relation });
    res.status(201).json({ message: 'Visitor registered successfully by security personnel' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while registering the visitor' });
  }
});

/**
 * @swagger
 * /viewvisitor:
 *   get:
 *     summary: View all visitors
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all visitors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visitor'
 *       500:
 *         description: Error occurred while fetching visitors
 */


// Protected route for viewing visitors - token required
app.get('/viewvisitor', verifyToken, async (req, res) => {
  try {
    const visitors = db.collection('visitors');
    const results = await visitors.find().toArray();

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching visitors' });
  }
});


/**
 * @swagger
 * /issuevisitorpass:
 *   post:
 *     summary: Issue a visitor pass
 *     tags: [Pass]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitorId
 *               - issuedBy
 *               - validUntil
 *             properties:
 *               visitorId:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *               validUntil:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Visitor pass issued successfully
 *       500:
 *         description: Error occurred while issuing the pass
 */



// Admin issue visitor pass
app.post('/issuevisitorpass', verifyToken, async (req, res) => {
  const { visitorId, issuedBy, validUntil } = req.body;

  try {
    const visitorPasses = db.collection('visitorpasses');

    const newPass = {
      visitorId,
      issuedBy,
      validUntil,
      issuedAt: new Date(),
    };

    await visitorPasses.insertOne(newPass);
    res.status(201).json({ message: 'Visitor pass issued successfully' });
  } catch (error) {
    console.error('Issue Pass Error:', error.message);
    res.status(500).json({ error: 'An error occurred while issuing the pass', details: error.message });
  }
});

/**
 * @swagger
 * /retrievepass/{visitorId}:
 *   get:
 *     summary: Retrieve a visitor pass
 *     tags: [Pass]
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     responses:
 *       200:
 *         description: Visitor pass details
 *       404:
 *         description: No pass found for this visitor
 *       500:
 *         description: Error occurred while retrieving the pass
 */


//Visitor to Retrieve Their Pass
// Visitor Retrieve Pass
app.get('/retrievepass/:visitorId', async (req, res) => {
  const visitorId = req.params.visitorId;

  try {
    const visitorPasses = db.collection('visitorpasses');
    const pass = await visitorPasses.findOne({ visitorId });

    if (!pass) {
      return res.status(404).json({ error: 'No pass found for this visitor' });
    }

    res.json(pass);
  } catch (error) {
    console.error('Retrieve Pass Error:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the pass', details: error.message });
  }
});


/**
 * @swagger
 * /updatevisitor/{visitorId}:
 *   patch:
 *     summary: Update visitor details
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VisitorUpdate'
 *     responses:
 *       200:
 *         description: Visitor updated successfully
 *       404:
 *         description: No visitor found with this ID
 *       500:
 *         description: Error occurred while updating the visitor
 */


//Update visitor
app.patch('/updatevisitor/:visitorId', verifyToken, async (req, res) => {
  const visitorId = req.params.visitorId;
  const updateData = req.body;

  try {
    const updatedVisitor = await db.collection('visitors').updateOne(
      { _id: new ObjectId(visitorId) }, // Use 'new' with ObjectId
      { $set: updateData }
    );

    if (updatedVisitor.matchedCount === 0) {
      return res.status(404).json({ message: 'No visitor found with this ID' });
    }

    res.json({ message: 'Visitor updated successfully', updatedVisitor });
  } catch (error) {
    console.error('Update error:', error); // Log the entire error object
    res.status(500).json({ error: 'An error occurred while updating the visitor', details: error.toString() });
  }
});

/**
 * @swagger
 * /deletevisitor/{visitorId}:
 *   delete:
 *     summary: Delete a visitor
 *     tags: [Visitor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The visitor ID
 *     responses:
 *       200:
 *         description: Visitor deleted successfully
 *       404:
 *         description: No visitor found with this ID
 *       500:
 *         description: Error occurred while deleting the visitor
 */


// Delete visitor
app.delete('/deletevisitor/:visitorId', verifyToken, async (req, res) => {
  const visitorId = req.params.visitorId;

  try {
    const deletionResult = await db.collection('visitors').deleteOne(
      { _id: new ObjectId(visitorId) } // Use 'new' with ObjectId
    );

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No visitor found with this ID' });
    }

    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error); // Log the entire error object
    res.status(500).json({ error: 'An error occurred while deleting the visitor', details: error.toString() });
  }
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Visitor:
 *       type: object
 *       required:
 *         - Name
 *         - Age
 *         - Gender
 *         - Address
 *         - Zipcode
 *         - Relation
 *       properties:
 *         Name:
 *           type: string
 *         Age:
 *           type: integer
 *         Gender:
 *           type: string
 *         Address:
 *           type: string
 *         Zipcode:
 *           type: string
 *         Relation:
 *           type: string
 *     VisitorUpdate:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *         Age:
 *           type: integer
 *         Gender:
 *           type: string
 *         Address:
 *           type: string
 *         Zipcode:
 *           type: string
 *         Relation:
 *           type: string
 */

