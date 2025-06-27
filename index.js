const express = require('express');
const app = express();
const port = 3012;
const expenseRoutes = require('./expense');
const z = require('zod')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ShreeJagnnath"
const bcrypt = require('bcrypt')
const {
    UserModel,
    ExpenseModel
} = require('./db');
const mongoose = require("mongoose");

app.use(express.json());


app.use('/expense', expenseRoutes);

app.post('/signup', async function(req, res) {

    const requireBody = z.object({
        email: z.string().min(6).max(50).email(),
        name: z.string().min(2).max(45),
        password: z.string().min(3).max(20)
    });
    const parsedData = requireBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect format"
        })
        return
    }

    const { email, name, password } = parsedData.data;

    const existinguser = await UserModel.findOne({ email });
    if (existinguser) {
        return res.status(409).json({ Message: 'email already exit use signin instead of signup' })
    }
    const hashedPassword = await bcrypt.hash(password, 3);
    try {
        await UserModel.create({
            name,
            password: hashedPassword,
            email
        })
        res.status(200).json({ message: "data added sucessfuly" })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "cant add data" })

    }


});



app.post('/signin', function(req, res) {
    res.json("signin route working");
});



function auth(req, res, next) {

    console.log("Auth middleware triggered");
    next();
}

function Incomingrequest(req, res, next) {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;

    console.log(log);
    next();
}

function RateLimmiter(req, res, next) {

}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});