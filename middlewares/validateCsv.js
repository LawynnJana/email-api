const csv = require('fast-csv');
const fs = require('fs');
module.exports = (req, res, next) => {
  // should validate the key for e-mails
  // valid is true if there is at least one e-mail
  if(req.files){
    console.log('Validating CSV...', req.files);  
    const stream = fs.createReadStream(req.files[0].path); 
    let invalid = true;
    csv
      .fromStream(stream, {headers : true})
      .validate(data => {
        if( data['E-mail 1 - Value'] !== '' || data['E-mail 1 - Value'] !== null){
          if(invalid) invalid = false
          return true;
        }
        return false;
      })
      .on("data-invalid", function(data){
         //do something with invalid row
      })
      .on("end", function(){
         if(!invalid)
          res.status(404).send({error: 'Please provide a valid CSV'});
      });
  }

  next();
}