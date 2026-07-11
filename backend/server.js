require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser =  require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');


//Connect to MongoDB
connectDB();

//custom middleware logger
app.use(logger);
//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);
//Cross Origin Resource 
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));
//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/employees', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
 
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


// Change '*' to '/{*splat}' for Express v5 compatibility

app.all('/{*splat}', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
 


/*
app.use('/subdir',express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
*/

app.use(errorHandler);

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=>{ console.log(`Server is running on port: ${PORT}`)});
})

  











/*
Passwords: 
name: Walter99
pwd: 97ddnys

name: Walter94


name: Walter92


















/*

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

 const LogEvents = require('./LogEvents');
 const eventEmitter = require('events');
 class Emitter extends eventEmitter{};
 const myEmitter = new Emitter();
  myEmitter.on('Logs', (msg, fileName) =>{ LogEvents(msg, fileName)});








const PORT = process.env.PORT || 3500;

const serveFile = async(filePath, contentType, response) =>{
    try{

        const rawData = await fsPromises.readFile(
            filePath, 
            !contentType.includes('image') ? 'utf8' : ''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData): rawData;
        response.writeHead
        (filePath.includes('404.html') ? 404 : 200,
             {'Content-Type': contentType}
            );
        response.end(
        contentType === 'application/json' ? JSON.stringify(data) : data
    );

    } catch(err){
        console.error(err);
         myEmitter.emit('Logs', `${err.name}: ${err.message}`, 'errlog.txt');
        response.statusCode = 500;
        response.end();
    }
}


const server = http.createServer((req, res) =>{
    console.log(req.url, req.method);
    myEmitter.emit('Logs', `${req.url}\t${req.method}`, 'reqlog.txt');



    const extension = path.extname(req.url);

    let contentType;

    switch(extension){

        case '.css':
        contentType = 'text/css';
        break;

        case '.js':
            contentType = 'text/javaScript';
        break;

        case '.json':
            contentType = 'application/json';
        break;
        case '.jpg':
            contentType = 'image/jpeg';
        break;
        case '.png':
            contentType = 'image/png';
        break;
        case '.txt':
            contentType = 'text/plain';
        break;
        default:
            contentType = 'text/html'; 
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
           ? path.join(__dirname, 'views', 'index.html')
           : contentType === 'text/html' && req.url.slice(-1) === '/'
                   ? path.join(__dirname, 'views', req.url, 'index.html')
                   : contentType === 'text/html'
                        ? path.join(__dirname, 'views', req.url)
                        : path.join(__dirname, req.url);
            //makes .html extension not required in the browser
    if(!extension && req.url.slice(-1) !== '/') 
        filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        // serve the file
        serveFile(filePath, contentType, res)
    } else{
        //404
        //301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                 break;
            
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
 
            default:
                //serve a 404 response
                     serveFile(path.join(__dirname, 'views','404.html' ),'text/html', res);
 

        }
    }

});
server.listen(PORT, () =>{
    console.log(`Server is running at Port: ${PORT}`);
});





*/












































/*const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter{};

//initialize object

const myEmitter = new MyEmitter();

//add listener for the log event

myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(()  =>{
    //Emit event
    myEmitter.emit('log', 'Log event emitted');
}, 2000); */