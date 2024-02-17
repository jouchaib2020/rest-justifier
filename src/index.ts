const express = require('express');

const app = express();

app.get("/", (req, res)=>{
    res.json({message: "hi Mom !"})
});


const port = process.env.Port || 3001;
app.listen(port, (req, res)=>{
    console.log(`listening on port ${port}`)
})