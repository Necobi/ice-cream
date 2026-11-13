import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

//Create a connection pool (bucket of db connectiom) create a bunch of connections to grab from
 const pool= mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
 }).promise();

const app = express();

//define a port number for server to listen on
const PORT = 3001;

const orders =[];
//enable static file serving 
app.use(express.static('public')); //grab static files from the public folder => images and styles NOT html

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));



//defining a default route
app.get('/', (req, res) => {
   // res.send('Welcome to My Ice Cream Shop!');
   res.render('home') //when user accesses main page it sends the file
});

app.get('/admin', async(req, res) => {
     try{
        const [orders] = await pool.query('SELECT * FROM orders');
        console.log(orders);
        res.render('admin', {orders} );
    } catch(err){
        console.error('Database error: ', err);
        res.status(500).send('Database error occured.');
        
    }
    
});

app.post('/submit-order',async(req,res)=>{
    // create a json object to store order data
    const order=req.body;
    order['timestamp']=new Date();
    console.log(order);

    //concert toppings array to comma-delimited string
    order.toppings = Array.isArray(order.toppings)?
    order.toppings.join(", "): "";

    //define a sql query to insert the new order
const sql = `INSERT INTO orders (name, email, flavor, method, toppings, comment)
VALUES(?, ?, ?, ?, ?, ?)`;

//CREATE AN ARRAY OD PARAMETERS FROM ORDER DATA
const params =[
    order.name,
    order.email,
    order.flavor,
    order.method,
    order.toppings,
    order.comment
];

//execurte query
const [result] = await pool.execute(sql, params);

    res.render('confirm',{order});
});

//start server on designated port
app.listen(PORT, () => {
    console.log(`Server is runnning at http://localhost:${PORT}`);
});