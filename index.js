let express = require('express');
let app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// To avoid cors problem
app.use(cors());
//parse JSON
//app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Received raw body:', req.body);
    next();
});

app.listen(8080, ()=>{
    console.log("Server runs:port 8080");
});


const myLogger =  (req, res, next)=> {
    const clientIP = req.ip;
    const timestamp= new Date().toUTCString();
    const log =`${clientIP} [${timestamp}]"${req.method} ${req.originalUrl}"`
    console.log(log)
    next()
  }
  
  app.use(myLogger)

  app.get("/", function(res){
    res.sendFile(__dirname+ "/documentation.html");
  });

 const mysql = require("mysql2");
 con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Miwakodori23!",
    database: "fashionhub_db2024", 
}); 

/* const mysql =require("mysql2/promise");
function connectToDatabase(){
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Miwakodori23!",
        database: "fashionhub_db2024", 
});
} */

app.use(express.json());

const dotenv = require('dotenv'); // npm i dotenv ->To bring token i .env install dotenv
dotenv.config();
const crypto = require('crypto');
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const { error } = require('console');

function hashSalting(password){
    const salt = crypto.randomBytes(16).toString('hex');
    const hash= crypto.createHash('sha256');
    hash.update(password+salt);
    const hashSaltingPassword = hash.digest('hex');

    const conbinedPassword = salt + ':'+ hashSaltingPassword 

    return conbinedPassword;
}

//console.log("conbinedPassword: ", hashSalting("1234"))
console.log("conbinedPassword: ", hashSalting("2345"))



//Start JWT---------------------------------------------

let secretKey= () =>{
    var key = crypto.randomBytes(32).toString('hex');
    return key;
}

 const JWT_SECRET =process.env.TOKEN_SECRET||secretKey();
 /**
  * Function signJWT: to sign a JWT
  * @param {*} payload 
  * @returns 
  */
 let signJWT =(payload)=>{
  return jwt.sign(payload, JWT_SECRET)
 }
 /**
  * Function decodeJWT : to Verify and decode a JWT
  * @param {*} token 
  * @returns 
  */

 let decodeJWT = (token) =>{
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch(error){
        return null;
    }
 }

 /**
  * Login
  */

app.post("/login", function (req, res) {

    if (!(req.body && req.body.email && req.body.password)) {

        return res.status(400).send("400: Not found such a customer!");
      }

    con.query(
        'SELECT * FROM customers WHERE email = ?',
        [req.body.email],
        (error, results) => {
            if (error) {
                console.error("Error: Login user error!");
                return res.status(500).send("500: Error logging in");
            }

            if (results.length === 0) {
                return res.status(401).send("401: Unauthorized");
            }

            let enteredPass=req.body.password;// userinput
            let storedConbinedPassword= results[0].password; // from database
            const [storedSalt, storedHashPassword] =  storedConbinedPassword.split(':');
            const hash = crypto.createHash('sha256');
            hash.update(enteredPass+storedSalt);// Use same salt which is stored in database
            const hasedEnteredPassword= hash.digest('hex');

    
             if (hasedEnteredPassword === storedHashPassword) {  
               //if (results[0].password === req.body.password){// When you login the first time as Admin user

                let payload ={
                    id: results[0].id,
                    firstname: results[0].firstname,
                    lastname: results[0].lastname,
                    email: results[0].email,
                    telephone: results[0].telephone,
                    address: results[0].address,
                    city: results[0].city,
                    postcode: results[0].postcode,           
                    //role: results[0].role,
                    exp: Math.floor(Date.now()/1000) + (60*0.5) // time-limit token: current time + 1hour
                };
                let token = signJWT(payload);
                res.json(token);
            } else {
                return res.status(401).send("401: Unauthorized");
            }
        }
    );
});

 function authToken (req, res, next){
    let authHeader = req.headers["authorization"];
    if (authHeader === undefined){
        return res.status(400).send("Bad request! Auth header is undefined.");
    }


    let token = authHeader.slice(7);
    try{
        let decoded =decodeJWT(token);
        console.log("req.decoded: "+JSON.stringify(req.decoded))
        console.log("decoded: "+JSON.stringify(decoded))
        req.decoded =decoded;
        console.log("req.decoded:  "+JSON.stringify(req.decoded))
       if (decoded===null) {
            return res.status(401).send("Bad request! Decoded token is null. (Check: token is expired, fail token or token not set )")
        }
        next(); // Go to next middleware or route handler
    } catch(error){
        console.log(error);
        return res.status(401).send("Invalid Authentication Token")
    }
 }


//JWT end--------------------------


 /**
  * Customer: Get own token info
  */

 app.get("/token-info", authToken, function(req, res){
    const decoded=req.decoded;

    console.log(JSON.stringify(req.decoded))
    let decoded_payload ={
        id: decoded.id,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
        email: decoded.email,
        telephone: decoded.telephone,
        address: decoded.address,
        city: decoded.city,
        postcode: decoded.postcode,
        //role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat
    }
    return res.status(200).send(decoded_payload);

}); 



/**
 * Customer endpoints
 * 
 */
const customers_columns = ["firstname", "lastname", "email", "telephone", "address", "city", "postcode", "password"];// users table
let customerPath= "/customer"

/**
 * Get own userinfo
 */

app.get(customerPath+"/me", authToken,function(req, res){
    const decoded= req.decoded;
    con.query(
    `SELECT * FROM customers WHERE id=?`,
    [decoded.id],
    (error, results,fields) =>{

        let output ={
            id: results[0].id,
            firstname: results[0].firstname,
            lastname: results[0].lastname,
            email: results[0].email,
            telephone: results[0].telephone,
            address: results[0].address,
            city: results[0].city,
            postcode: results[0].postcode,
            
            //role: results[0].role,
        };

        return res.status(200).send(output);
    })        
}) ;


/**
 * Signup : Create customer  
 */

let inputRequiredMessage =(input, field_name)=>{
    if (typeof input!=="string"||input.trim()===""){
        
   return field_name +"(Type:String) is required! ";
 }
   return ""
}

 
app.post(customerPath+"/signup", function (req, res) {
    let errormessage = "400: "
    errormessage += inputRequiredMessage(req.body.firstname,"firstname");
    errormessage += inputRequiredMessage(req.body.lastname,"lastname");
    errormessage += inputRequiredMessage(req.body.email,"email");
    errormessage += inputRequiredMessage(req.body.telephone,"telephone");
    errormessage += inputRequiredMessage(req.body.address,"address");
    errormessage += inputRequiredMessage(req.body.city,"city");
    errormessage += inputRequiredMessage(req.body.postcode,"postcode");
    errormessage += inputRequiredMessage(req.body.password, "password");
    //errormessage += inputRequiredMessage(req.body.role,"role");

    if(errormessage!=="400: "){
        return res.status(400).send( errormessage)
    
}

    
     for (let key in req.body){
        if(!customers_columns.includes(key)){
            return res.status(400).send("Unknown customers column: "+ key);
        }
     }

     //Check the email alredy exist or not
    con.query(
            `SELECT * FROM customers WHERE email=?`,
            [req.body.email],
             (error, results)=>{
                if(error){
                    return res.status(500).send("500: Internal server error")
                }
    
                if(results.length>0){
                    return res.status(400).send("400: email already exist. You already have a membership! ")
                }

   let insertSql= `INSERT INTO customers (firstname, lastname, email, telephone, address, city, postcode, password) 
   VALUES ( 
   
   '${req.body.firstname}',
   '${req.body.lastname}',
   '${req.body.email}',
   '${req.body.telephone}',
   '${req.body.address}',
   '${req.body.city}',
   '${req.body.postcode}',
   '${hashSalting(req.body.password)}')`;

   console.log(insertSql)

    con.query(insertSql,
        
            (error, results) =>{ 
    
                if(error){
                    console.error("Adding customer Error!: "+ error);//error detail
                    
                    return res.status(500).send("500: Error signup")
                }

              console.log(results)

              let selectSql = 'SELECT LAST_INSERT_ID() as insertId';
    

    con.query(selectSql, (error, results) => {
            if(error){
                console.error("Error retrieving last insert ID: " + err);
                return res.status(500).send("500: Error retrieving customer ID");
            }

                let output ={
                    id: results[0].insertId,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email:req.body.email,
                    telephone: req.body.telephone,
                    address: req.body.address,
                    city: req.body.city,
                    postcode: req.body.postcode,
                };// do not return password!!!
                return res.status(201).send(output);
            });

        });
    });
});


/**
 * fashion_products endpoints
 */

const fashion_products_colums =["title","description","image","price","category"]
let productPath="/product"

/**
 * Get all products
 */
app.get(productPath+"/all", function(req, res){
  let sql =  "SELECT * FROM fashion_products";
  con.query(sql,
    function(error, results, fieldes){
        return res.status(200).send(results);
    });
});

/**
 * Get product by product title (Fuzzy search)
 */
app.get(productPath+"/all/:searchQuery", async (req, res) => {
    const { searchQuery } = req.params;
    let sql = "SELECT * FROM fashion_products WHERE title LIKE ?";

    con.query(sql, [`%${searchQuery}%`], (error, results)=>{
        if(error){
            console.error('Error searching for products with searching query: error')
            res.status(500).json({ error: 'Internal server error' });
        } else{
            res.json(results);

        }
    })

});

/**
 * Get product by ID
 */
app.get(productPath+"/byid/:id",  async (req, res) =>{
    const {id} = req.params;
    let sql = "SELECT * FROM fashion_products WHERE id=?";

    con.query(sql, [id], (error, results)=>{
        if(error){
            console.error('Error searching for a product by ID: error')
            res.status(500).json({ error: 'Internal server error' });
        } else if(results.length>0){
            res.status(200).send(results);
        } else{
            res.status(404).send("404: Not found!");
        }
    });
});


/* const { check, validationResult } = require('express-validator');

        const validateOrder = [
            // Example validation rules using check function
            check('customerId').isInt().withMessage('Customer ID must be an integer'),
            check('products.*.id').isInt().withMessage('Product ID must be an integer'),
            check('products.*.title').isString().notEmpty().withMessage('Product title is required'),
            check('products.*.price').isNumeric().withMessage('Product price must be a number'),
            check('products.*.quantity').isNumeric().withMessage('Product quantity must be a number'),
            // Add more validation rules as needed
          ]; */
/**
 * Orders
 */
let ordersPath="/orders"

/* app.post(ordersPath+"/add/:customerId",authToken, async (req, res) => {
    try {
        // Establish connection using await
        //const connection = await connectToDatabase();
        const customerId= req.params.customerId;
        const { products } = req.body;

        // Validate customerId and products
         console.log("Received body:", req.body);
        console.log("customerId",customerId)
        console.log("ProductsArray", Array.isArray(products)) //false:  the data is being sent as JSON string instead of a JavaScript object.
        if (!customerId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Invalid request. Missing customerId or products array.' });
        }

        // Calculate total amount
        const totalAmount = products.reduce((total, product) => total + (product.price * product.quantity), 0);
        console.log("typeof totalAmount:", typeof totalAmount);

        // Save order to the database
         const queryResult =  con.query('INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)', [customerId, totalAmount]);
        console.log("queryResult", queryResult);
        //-----This return
        const resultCast = con.query('SELECT CAST(LAST_INSERT_ID() AS UNSIGNED) as insertId');
        console.log("resultCast", resultCast)
        const orderId = resultCast.insertId; // undefined
        //const [{ insertId: orderId }]  = con.query('SELECT LAST_INSERT_ID() as insertId');
        
        


        // One to Many: Order_id has many orderitems(products) Iterate through products and save each one to order_items table
        for (const product of products) {
            console.log("typeof orderId:", typeof orderId);//expected INT
            console.log("typeof product.id:", typeof product.id);//expected INT
            console.log("typeof quantity:", typeof product.quantity);//expected INT 

             con.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [orderId, product.id, product.quantity]);
        }
        
        // If the order is successfully saved, respond with success message
        res.status(201).json({ message: 'Order created successfully' }); */

        //--------------------------------------------------------
        
        /* const insertSql =  con.query('INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)', [customerId, totalAmount]);
        con.query( insertSql,
            (error, results)=>{

                if(error){
                    console.error("Adding order Error!: "+ error);//error detail
                    
                    return res.status(500).send("500: Error adding order")
                }

              console.log(results)

              let selectSql = 'SELECT LAST_INSERT_ID() as insertId';

              con.query(selectSql, (error, results) => {
                if(error){
                    console.error("Error retrieving last insert ID: " + err);
                    return res.status(500).send("500: Error retrieving orderID");
                }
                
                let i=0;
                for (const product of products ) {
                    console.log("typeof orderId:", typeof results[i].insertId);//expected INT
                    console.log("typeof product.id:", typeof product.id);//expected INT
                    console.log("typeof quantity:", typeof product.quantity);//expected INT 
        
                     con.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [results[i].insertId, product.id, product.quantity]);
                    i++;
                    }
                res.status(201).json({ message: 'Order created successfully' });
              
            }
       )} 
      ); */
      //------------------------------------------------

   /*  } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});  */


//const ordersPath = "/orders";

app.post(ordersPath + "/add/:customerId", authToken,  (req, res) => {
    try {
        const customerId = req.params.customerId;
        const { products } = req.body;

        // Validate customerId and products
        if (!customerId || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'Invalid request. Missing customerId or products array.' });
        }

        // Calculate total amount
        const totalAmount = products.reduce((total, product) => total + (product.price * product.quantity), 0);

        // Save order to the database
        const insertOrderQuery = 'INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)';
        con.query(insertOrderQuery, [customerId, totalAmount], (orderInsertErr, orderInsertResults) => {
            if (orderInsertErr) {
                console.error('Error inserting order:', orderInsertErr);
                return res.status(500).json({ error: 'Failed to create order' });
            }

            const orderId = orderInsertResults.insertId;
            console.log("orderID:", orderId)

            // Insert order items
            const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?'; //(?,?,?) it is incorrect
            const values = products.map(product => [orderId, product.id, product.quantity]);
            console.log("Values:", values)

            con.query(insertOrderItemsQuery, [values], (orderItemsInsertErr, orderItemsInsertResults) => {
                if (orderItemsInsertErr) {
                    console.error('Error inserting order items:', orderItemsInsertErr);
                    return res.status(500).json({ error: 'Failed to create order' });
                }

                res.status(201).json({ message: 'Order created successfully' });
            });
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});


app.get(ordersPath+"/bycustomerid/:id",  authToken, (req, res) =>{
    const {id} = req.params;
    let sql = "SELECT * FROM orders WHERE customer_id=?";

    con.query(sql, [id], (error, results)=>{
        if(error){
            console.error('Error searching for orders by customer ID: error')
            res.status(500).json({ error: 'Internal server error' });
        } else if(results.length>0){
            res.status(200).send(results);
        } else{
            res.status(404).send("404: Not found!");
        }
    });
});

/**
 * I need controll by role(Just now there is no
 * role)
 */

app.get(ordersPath+"/byid/:id",  (req, res) =>{
    const {id} = req.params;
    let sql = "SELECT * FROM orders WHERE id=?";

    con.query(sql, [id], (error, results)=>{
        if(error){
            console.error('Error searching for orders by customer ID: error')
            res.status(500).json({ error: 'Internal server error' });
        } else if(results.length>0){
            res.status(200).send(results);
        } else{
            res.status(404).send("404: Not found!");
        }
    });
});
