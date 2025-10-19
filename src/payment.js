const express = require('express')
const dotenv = require("dotenv");
dotenv.config()
const cors = require('cors')

const app = express()
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});


const PORT = process.env.PORT || 8080;


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
