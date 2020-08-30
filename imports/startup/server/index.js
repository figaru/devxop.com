// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';

//WEBAPP IMports
import bodyParser from 'body-parser';
import connectRoute from 'connect-route';
import oldAPI from './api.old.js';


//make sure body and content is parsed.
WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }))

//connect route handled by api imported script -> contains all api routes
WebApp.connectHandlers.use(connectRoute(oldAPI));