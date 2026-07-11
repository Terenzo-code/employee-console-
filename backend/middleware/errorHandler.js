const { LogEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) =>{
    LogEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.log(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;