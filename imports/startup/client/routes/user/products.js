UserRouter.route('/products', {
    name: "products",
    action: function () {
        BlazeLayout.render('User_layout', { main: 'Products' });
    }
});