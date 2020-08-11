import './user.html';

Template.User_layout.helpers({
    'app': function(){
        return Meteor.settings.public.app;
    }
})

Template.User_layout.events({
    'click .js-logout': function () {
        Meteor.logout(function () {
            var path = FlowRouter.path("Landing");
            //console.log(path);
            FlowRouter.go(path);
        });
    },
    'click .js-link': function (e) {
        let target = $(e.currentTarget);
        let route = target.data("route");
        let params = target.data("params");
        let query = target.data("query");

        if (route) {

            if (params || query) {
                if (typeof params == "string") {
                    params = JSON.parse(params);
                }

                if (typeof query == "string") {
                    query = JSON.parse(query);
                }

                var path = FlowRouter.path(route, params, query);
                //console.log(path);
                FlowRouter.go(path);
            } else {
                FlowRouter.go(route);
            }
        }
    },
    'click #toggle-drawer, click .drawer-overlay': function (e, tmpl) {
        console.log(e);
        let drawer = tmpl.$(".layout-drawer");
        let overlay = tmpl.$(".drawer-overlay");
        let content = tmpl.$(".layout-content");

        if (drawer.hasClass("toggled")) {
            drawer.removeClass("toggled");
            overlay.removeClass("toggled");

            content.addClass("full");
        } else {
            drawer.addClass("toggled");
            overlay.addClass("toggled");
            content.removeClass("full");
        }
    }
});