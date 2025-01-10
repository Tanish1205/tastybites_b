const express = require('express')
const app = express()
const port = process.env.PORT ||  5000
const mongoDB= require('./db')

const cors = require('cors');

// const app = express();

// Enable All CORS Requests
// app.use(cors());

// Alternatively, enable CORS for specific origins
const corsOptions = {
  origin: 'https://tastyy-bites.netlify.app/', // Replace with your client's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and authorization headers
};
app.use(cors(corsOptions));

mongoDB(); 

app.use(express.json());

// app.use((req,res,next) => {
//     res.setHeader('Access-Control-Allow-Origin', "http://localhost:5173");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next(); 
// })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
