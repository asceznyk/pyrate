const path = require('path');
const express = require('express'), app = express();

app.use(express.static(path.join(__dirname, '/static')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, () => console.log("listening on port 3000"));


