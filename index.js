const express = require('express');
const app = express();
const {PORT} = require('./config/config');
const DBConnect = require('./Database/database');
const route = require('./Routes/routes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const path = require('path');
const fs = require('fs')

app.use(express.json());


DBConnect();

const allowedOrigins = ['http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);


app.get("/",(req,res)=>{
    res.status(200).send({msg:"Welcome to PGECHS"})
})

app.use(route);
app.use(errorHandler); 

app.use(express.static('LocalStorage'));

app.use('/files', express.static(path.join(__dirname, 'LocalStorage')));

// Your API route to retrieve files
app.get('/get-file/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'LocalStorage', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    // Handle the case when the file does not exist
    res.status(404).send('File not found');
  }
});

  
 
  


app.listen(PORT,console.log(`Server is running at: ${PORT}`))