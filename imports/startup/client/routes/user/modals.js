UserRouter.route('/modals', {
    name: "modals",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Modals' });
    }
});