const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverrride = require('method-override')
const app = express();

const mongoConnection = "mongodb+srv://lbeniakh:6YdKpcWoP56wFCnW@cluster0.tdh5js4.mongodb.net/?retryWrites=true&w=majority";

const PORT = 3400;

const start = async() => {
    await mongoose.connect(mongoConnection);

    app.listen(PORT, () => {
        console.log(`Server is running at "http://127.0.0.1:${PORT}"`);
    })
}

start();

app.set('view engine', 'pug');
app.set('views', ['views', 'views/users', 'views/groups', 'views/notes', 'views/folders']);

app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverrride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/homeRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/groups', require('./routes/groupRoutes'));
app.use('/*', require('./routes/homeRoutes'));
