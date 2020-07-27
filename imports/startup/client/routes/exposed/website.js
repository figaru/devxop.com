ExposedRouter.route('/app/:website', {
    name: 'website',
    subscriptions: function (params, queryParams) {
        /* this.register('allFiles', Meteor.subscribe('files.all'));
        this.register('allProducts', Meteor.subscribe('products.all'));
        this.register('allCollections', Meteor.subscribe('collections.all')); */
        this.register('website', Meteor.subscribe('websites.getOne', params.website));
    },
    action(params) {

        FlowRouter.subsReady("website", function() {
            // do something

            let web = Websites.findOne();

            if(!web){
                FlowRouter.go("/");
            }
        });
        BlazeLayout.render('Exposed_layout', { main: 'Website_public' });
    },
});
