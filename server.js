//a lot of facilities are provided by expressjs which helps in manipulating data like query params and things
//and then pass this ass a json to mongo. mongo and express works hands in hands
const express = require("express");
const dotenv = require("dotenv");
const morganLogger = require("morgan");
const connectRepo = require("./config/db");
const errorHandler = require("./middlwares/ErrorHandler");
const colors = require("colors");
//to perform file related operation .. eg taking input file from user 
const fileHandler = require("express-fileupload");

//path module for file related operation
const path = require("path");



//Load env vars
dotenv.config({ path: "./config/config.env" });


const app = express();

//object mapper from req body to json - accessible throughout the project
app.use(express.json());


//middlware for uploading file , this will alow this to be used in other classes
app.use(fileHandler());
//setting public as a static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000;
connectRepo();

//routed services
const friendServices = require("./service/service_routes");

//load common logger for calls
//const logger = require("./middlwares/logger");
//using middleware by morgan is more better/light option
app.use(morganLogger('dev'));


//Mounting services to handle urls  (takes the url and passes it to friends service)
app.use('/api/v1/friends', friendServices);

//using the error handlers
app.use(errorHandler);


//port related code
//with the help of server variable you can close or start the server by code.
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} and environment is ${process.env.NODE_ENV}`.yellow.bold);
});

//global exception handler
process.on('unhandledRejection', (err, promise) => {

    console.log(`Error: ${err.message}`.red.bold);

    //stop the server 1- true
    server.close(() => { process.exit(1) });

});
