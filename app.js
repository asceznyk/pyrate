const express = require('express');
const path = require('path');

const port = 5000;
const app = express();
const router = express.Router();

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(router);
app.use(express.static('public'));
app.listen(port, () => {
	console.log(`listening at port ${port}`);
})


