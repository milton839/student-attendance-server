const express = require('express');
const connectDB = require('./db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Invalid Data' })
    }

    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    else {
        try {
            user = new User({ name, email, password });

            const salt = await bcrypt.genSaltSync(10);
            var hash = await bcrypt.hashSync(password, salt);
            user.password = hash;

            await user.save();
            return res.status(201).send({ message: 'User created successfully', user })
        } catch (error) {
            next(error)
        }
    }
})

app.post('/login', async(req, res, next) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword){
            return res.status(400).json({ message: 'Invalid Password' });
        }

        delete user._doc.password;
        return res.status(200).json({message:"Login Successfully", user})
    }catch (error) {
        next(error);
    }
})

app.get('/', (req, res) => {
    res.send("Student Attendence Project Startting....");
})

app.use((error, req, res, next) => {
    console.log(error);
    return res.status(500).json({ message: "Server error occured" });
})

connectDB('mongodb://localhost:27017/attendence-db')
    .then(() => {
        console.log('Database Connected');
        app.listen(port, () => {
            console.log("Server Starting at " + port);
        })
    })
    .catch((e) => console.log(e))
