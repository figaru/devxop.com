// Set up all routes in the app
ExposedRouter.route('/', {
    name: 'Landing',
    action() {
        BlazeLayout.render('Exposed_layout', { main: 'Landing' });
    },
});

ExposedRouter.route('/login', {
    name: 'Login',
    action() {
        BlazeLayout.render('Exposed_layout', { main: 'Login' });
    },
});
