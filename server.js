const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send("Student Attendence Project Startting....");
})

app.listen(port, ()=>{
    console.log("Server Starting at " + port);
})