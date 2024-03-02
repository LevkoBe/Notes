const cors = require('cors');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverrride = require('method-override');
const verifyToken = require('./handlers/verifyToken');
const loggingMiddleware = require('./handlers/loggingMiddleware');

const prohibitedOrigins = ['http://blocked.com', 'http://anotherblocked.com'];

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mongoConnection = "mongodb+srv://lbeniakh:6YdKpcWoP56wFCnW@cluster0.tdh5js4.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3400;

const start = async () => {
    await mongoose.connect(mongoConnection);

    server.listen(PORT, () => {
        console.log(`Server is running at "http://127.0.0.1:${PORT}"`);
    })
}

start();

app.set('view engine', 'pug');
app.set('views', ['Notes/views', 'Notes/views/users', 'Notes/views/groups', 'Notes/views/notes', 'Notes/views/folders']);

app.use(cookieParser());
app.use(express.static('Notes/static'));
app.use(express.static('Notes/public'));
app.use(methodOverrride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: function (origin, callback) {
    if (!prohibitedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(loggingMiddleware);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
    });

    socket.on('chat message', (data) => {
        const { groupId, message } = data;
        console.log('Message:', message);
        io.to(groupId).emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use('/registration', require('./routes/registrationRoutes'));
app.use(verifyToken);
app.use('/', require('./routes/homeRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/folders', require('./routes/folderRoutes'));
app.use('/groups', require('./routes/groupRoutes'));
app.use('/*', require('./routes/pageNotFoundRoutes'));
