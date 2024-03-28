let express = require('express');
let app = express();
const cors = require('cors');

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

console.log("conbinedPassword: ", hashSalting("1234"))

//TODO: you need to add secretkey  JWT Signetc...
//--------------------------

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
  

