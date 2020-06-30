import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/pages/exposed/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Landing',
  action() {
    BlazeLayout.render('Exposed_layout', { main: 'Landing' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Exposed_layout', { main: 'App_notFound' });
  },
};
