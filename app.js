import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();
console.log('Admin User:', process.env.ADMIN_USER);
console.log('Session secret loaded:', process.env.SESSION_SECRET);

//Create a connection pool (bucket of db connectiom) create a bunch of connections to grab from
 const pool= mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
 }).promise();

 

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10000 * 60 * 60}
}));

function requireLogin(req, res, next){
    if( req.session.loggedIn){
        next();
    } else{
        res.redirect('/login');
    }
};

//define a port number for server to listen on
const PORT = 3001;

const orders =[];
//enable static file serving 
app.use(express.static('public')); //grab static files from the public folder => images and styles NOT html

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));




/*app.get('/session-test', (req,res) => {
    req.session.views = (req.session.views || 0) +1;
    res.send(`Visits: ${req.session.views}<br>
        Logged in: ${req.session.loggedIn === true }`);
});*/


//defining a default route
app.get('/', (req, res) => {
   // res.send('Welcome to My Ice Cream Shop!');
   res.render('home') //when user accesses main page it sends the file
});

app.get('/login', (req, res) => {
    res.render('login', {error: null});
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === process.env.ADMIN_USER &&
       password === process.env.ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        console.log("I am here");
        res.redirect('/admin');

       } else{
        res.render('login', {error: 'Invalid username or password'});
       }
    
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


app.get('/admin', requireLogin, async(req, res) => {
     try{
        const [orders] = await pool.query('SELECT * FROM orders');
        console.log(orders);
        res.render('admin', {orders} );
    } catch(err){
        console.error('Database error: ', err);
        res.status(500).send('Database error occured.');
        
    }
    
})

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