const fcsv = require('fast-csv');

module.exports = (req, res, next) => {
  if(req.body.recipientFile){
    // if it's not of type CSV return error
    const file = req.body.recipientFile;
    console.log(req);
    console.log('The CSV File:', file['0']);
    //const stream = fs.createReadStream(file);
    //if(fcsv.parse(req.body.recipientFile)) {
      //return res.status(400).send({error: 'The file you imported in invalid.'});
   //}
  }

  next();
}