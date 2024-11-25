const express = require('express');
const app = express();
const dotenv = require('dotenv').config();  
const mongoose = require("mongoose");
const postRoutes = require('./routes/postRoutes'); 
//const commentRoutes = require('./routes/commentRoutes'); 



app.use(express.json());  
app.use('/api', postRoutes);  // routes will be prefixed with /api
//app.use('/api', commentRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


app.get("/", (req, res) => {
    res.send('Hello world !!');
});

const port = process.env.PORT ; 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});