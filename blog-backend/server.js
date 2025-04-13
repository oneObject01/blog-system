const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const busboyParse = require('./middlewares/busboy')
const authRoutes = require('./routes/authRoutes');
const updateRoutes = require('./routes/updateRoutes');
const sendRoutes = require('./routes/sendRoutes');
const deleteRoutes = require('./routes/deleteRoutes');

const app = express();

// 中间件
app.use(bodyParser.json());
app.use(busboyParse);
app.use(cors());
app.use('/uploads', express.static('uploads'));

// 连接 MongoDB
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth',authRoutes)
app.use('/update',updateRoutes)
app.use('/send',sendRoutes)
app.use('/delete',deleteRoutes)

app.use(express.static(__dirname+'/public'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});