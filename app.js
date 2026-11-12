import express from 'express';

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

app.get('/admin', (req, res)=>{
    res.render('admin' ,{orders});
});

app.post('/submit-order',(req,res)=>{
    // create a json object to store order data
    const order=req.body;
    order['timestamp']=new Date();
    console.log(order);

    // add order object to orders array
    orders.push(order);
    console.log(orders);
    res.render('confirm',{order});
});

//start server on designated port
app.listen(PORT, () => {
    console.log(`Server is runnning at http://localhost:${PORT}`);
});