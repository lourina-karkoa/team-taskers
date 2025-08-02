const xss = require('xss');
const sanitize = require('mongo-sanitize');

function sanitizeObject(obj){
    if(!obj) 
        return;
    for(let key in obj){
        if(typeof obj[key] === 'string'){
            obj[key]=xss(sanitize(obj[key]));
        }
        if(typeof obj[key] === 'object' && obj[key]!==null){
            sanitizeObject(obj[key]);
        }

    }
}
// middleware secuirty
function cleanInput(req,res,next){
    sanitizeObject(req.body);
    sanitizeObject(req.query);
    sanitizeObject(req.params);
    next();
}

module.exports = {cleanInput}