let express = require('express');
let app = express();
const cors = require('cors');

// To avoid cors problem
app.use(cors());
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
        console.log("req.decoded"+JSON.stringify(req.decoded))
        console.log("decoded"+JSON.stringify(decoded))
        req.decoded =decoded;
        console.log("req.decoded"+JSON.stringify(req.decoded))
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
  

