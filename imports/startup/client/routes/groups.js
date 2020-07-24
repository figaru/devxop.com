ExposedRouter = FlowRouter.group({
    triggersEnter: [function (context, redirect) {
        
    }]
});

UserRouter = FlowRouter.group({
    name: "UserGroup",
    subscriptions: function (params, queryParams) {
        this.register('allFiles', Meteor.subscribe('files.all'));
        this.register('allJobs', Meteor.subscribe('jobs.all'));
        this.register('allDevices', Meteor.subscribe('devices.all'));
        this.register('allProducts', Meteor.subscribe('products.all'));
        this.register('allCollections', Meteor.subscribe('collections.all'));
        this.register('allWebsites', Meteor.subscribe('websites.all'));
    },
    triggersEnter: [function () {
        if (!Meteor.userId() && !Meteor.loggingIn()) {
            FlowRouter.go("/");
        }
    }]
});

FlowRouter.triggers.enter([function (context) {
    // context is the output of `FlowRouter.current()`

    //force update to all route helpers
    Session.set("route-event", new Date().getTime());

    //Validate user
    /* if (!Meteor.userId()) {
        FlowRouter.go("/");
    } */
}], { except: ["/", "/login"] });

ExposedRouter.notFound = {
    action() {
        BlazeLayout.render('App_exposed', { main: 'App_notFound' });
    },
};

UserRouter.notFound = {
    action() {
        BlazeLayout.render('App_exposed', { main: 'App_notFound' });
    },
};