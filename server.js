//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/razorgripassignment'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/razorgripassignment/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);




//// server.js
// const express = require('express');
// const app = express();
// // Run the app by serving the static files
// // in the dist directory
// app.use(express.static(__dirname + '/dist'));
// // Start the app by listening on the default
// // Heroku port
// app.listen(process.env.PORT || 8080);
