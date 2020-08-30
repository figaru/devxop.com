// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';


// Listen to incoming HTTP requests (can only be used on the server).
/* WebApp.connectHandlers.use('/hello', (req, res, next) => {
    res.writeHead(200);
    res.end(`Hello world from: ${Meteor.release}`);
}) */