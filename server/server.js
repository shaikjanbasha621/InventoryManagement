const express=require('express');
const bodyParser=require('body-parser');
const api=require('./routes/api')
const cors=require('cors')
const PORT=3000;

const app=express();
app.use(bodyParser.json());
//
// app.get('/',function (req,res) {
//     res.send('hello from server');
// })
app.use(cors());
app.use('/api',api);


app.listen(PORT,function () {
    console.log("server running on port :" +PORT);
})