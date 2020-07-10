import './user.html';

Template.User_layout.events({
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
    'click #toggle-drawer': function (e, tmpl) {
        let drawer = tmpl.$(".layout-drawer");
        let content = tmpl.$(".layout-content");

        if (drawer.hasClass("toggled")) {
            drawer.removeClass("toggled");
            
            content.addClass("full");
        } else {
            drawer.addClass("toggled");

            content.removeClass("full");
        }
    }
});