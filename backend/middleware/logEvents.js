


const {format } = require('date-fns');
const {v4: uuid} = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const LogEvents = async (message, logName) =>{
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try{   
         if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){   
         await fsPromises.mkdir(path.join(__dirname, '..','logs'));  

    }

    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);

   } catch(err){
    console.log(`There was an UncaughtException: ${err}`);
   }

}  

const logger = (req, res, next) =>{
    LogEvents(  `${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}
   
module.exports = {logger, LogEvents};


















































/*
const{ format} = require('date-fns');
const {v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvents = async (message) =>{
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try{  
        if(!fs.existsSync(path.join(__dirname, 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem);

    } catch(err){
        console.error(err);
    }
    

}

module.exports = logEvents;

*/