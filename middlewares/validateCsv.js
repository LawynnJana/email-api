const csv = require('fast-csv');
const fs = require('fs');
module.exports = (req, res, next) => {


  // should validate the key for e-mails
  if(req.files){
    console.log('Validating CSV...', req.files);  
    const stream = fs.createReadStream(req.files[0].path); 
    csv
      .fromStream(stream, {headers : true})
      .validate(data => {
        console.log('ONVALID',data['E-mail 1 - Value']);
         return data['E-mail 1 - Value'] !== '' || data['E-mail 1 - Value'] !== null;
      })
      .on("data-invalid", function(data){
         //do something with invalid row
         console.log('INVALID DATA ', data);
      })
      .on("data", function(data){
         console.log('data',data);
      })
      .on("end", function(){
         console.log("done");
      });
  }

  next();
}