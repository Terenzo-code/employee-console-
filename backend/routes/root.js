const express = require('express');
const router = express.Router();
const path = require('path');

/*
router.get('^/$|/index(.html)?',(req, res )=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('^/new-page(.html)?',(req, res )=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?',(req, res )=>{
    res.sendFile(path.join(301, 'new-page.html')) //302 by default;
});

*/

// 1. Root / Index Route (Using an actual RegExp literal so Express doesn't crash)
router.get(/^\/$|^\/index(\.html)?$/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});


module.exports = router;