
const express = require('express');


const cookieParser = require('cookie-parser');


module.exports = (app) => {
    
    app.use((req,res,next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PATCH');
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Authorization");
        
        next();
    });
    
    app.use(cookieParser());

    app.use(express.json()); 
    app.use('/uploads', express.static('uploads'))
    app.use((req,res,next) => {
        console.log('>>>', req.method);
        
        if(req.user){
            console.log('Known user', req.user.email);
        }
        next();
    });
}