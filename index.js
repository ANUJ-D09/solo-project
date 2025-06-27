const express = require('express');
const app = express();
const port = 3012;
const expenseRoutes = require('./expense');
const z = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ShreeJagnnath";
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

// Database connection
const { UserModel, ExpenseModel } = require('./db');
const mongoose = require("mongoose");


.then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/expense', expenseRoutes); // Note the /api prefix

// Auth Routes
app.post('/api/signup', async(req, res) => {
    try {
        const requireBody = z.object({
            email: z.string().email(),
            name: z.string().min(2),
            password: z.string().min(3)
        });

        const parsedData = requireBody.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ message: "Invalid input format" });
        }

        const { email, name, password } = parsedData.data;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/signin', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Serve frontend - must be last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});