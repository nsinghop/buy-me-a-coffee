const express = require('express')
const dotenv = require("dotenv");
dotenv.config()
const cors = require('cors')

const app = express()
app.use(express.json());


const allowedOrigins = [
  'http://localhost:5173',
  'https://hireme.codesingh.in',
  'https://connect.masternow.in/',
  'https://connect.masternow.in'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


const PORT = process.env.PORT || 3000;


const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});

app.post('/create-order', async (req, res) => {


    try {
        const { amount,
                name,
                email,
                message} = req.body;

        const options = {
            amount: Number(amount) * 100,  // amount in the smallest currency unit
            currency: 'INR',
            receipt: "coffee_order_rcptid_11",
            notes:{
                amount,
                name,
                email,
                message,
            }
        };

        const payment = await instance.orders.create(options)
        
        res.status(201).json(payment)


    } catch (err) {

        console.log(err)
        res.send(500).send("Error", err)
    }

})


app.listen(PORT,()=>{
    console.log("Server running on port http://localhost:8080")
})
