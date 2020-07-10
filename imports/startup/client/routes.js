import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'Landing',
  action() {
    BlazeLayout.render('Exposed_layout', { main: 'Landing' });
  },
});

FlowRouter.route('/login', {
  name: 'Login',
  action() {
    BlazeLayout.render('Exposed_layout', { main: 'Login' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('Exposed_layout', { main: 'App_notFound' });
  },
};
