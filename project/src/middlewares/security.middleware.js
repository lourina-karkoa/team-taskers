const xss = require('xss');
const sanitize = require('mongo-sanitize');
const { decode } = require('html-entities');
// XSS و NoSQL Injection
function deepSanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const cleaned = Array.isArray(obj) ? [] : {};

  for (let key in obj) {

    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }

    let value = obj[key];

    if (typeof value === 'object' && value !== null) {
      cleaned[key] = deepSanitize(value); 
    } else if (typeof value === 'string') {
      const decoded = decode(value);          
      const noMongo = sanitize(decoded);      
      cleaned[key] = xss(noMongo);             
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

function rejectIfMalicious(obj){
    if(!obj || typeof obj !== 'object'){
        return false;
    }
    const str = JSON.stringify(obj); 
    if(typeof str !== 'string'){
        return false; 
    }
    const lower = str.toLowerCase()
    if(lower.includes('script') || lower.includes('$ne') || lower.includes('$where')){
        return true
    }
    return false
}

function cleanInput(req, res, next) {
  console.log("cleanInput-successfully");

    if(rejectIfMalicious(req.body)){
        return res.status(400).json({message:"suspicious input"})
    }

  req.body = deepSanitize(req.body);
  req.query = deepSanitize(req.query);
  req.params = deepSanitize(req.params);
  
  next();
}

module.exports = cleanInput ;