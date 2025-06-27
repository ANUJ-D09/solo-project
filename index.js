const express = require('express');
const app = express();
const port = 3012;
const expenseRoutes = require('./expense');
const z = require('zod')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ShreeJagnnath"
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit');

const {
    UserModel,
    ExpenseModel
} = require('./db');
const mongoose = require("mongoose");
app.use(express.json());


app.use('/expense', expenseRoutes);

app.post('/signup', Incomingrequest, async function(req, res) {


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



app.post('/signin', async function(req, res) {
    const { password, email } = req.body;
    try {
        const foundUser = await UserModel.findOne({ email })
        if (!foundUser) {
            res.status(404).json("user not found");
        }
        const passwordValid = await bcrypt.compare(password, foundUser.password);
        if (!passwordValid) {
            return res.status(401).json({ message: "Oops! That didn’t match our records" });
        }
        const token = jwt.sign({ userId: foundUser._id }, JWT_SECRET, {
            expiresIn: '1h',
        });


        res.json({ message: "You are signed in. Enjoy!", token });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "error" })
    }

});




function Incomingrequest(req, res, next) {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;

    console.log(log);
    next();
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

})



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});