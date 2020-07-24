import './website.html';

Template.Website.onRendered(function () {
    //function will create document if website does not exist
    Meteor.call("website.exists");



    $(document).on('websiteEditEvent', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let website = Websites.findOne();

        let target, key, val, data = {};

        if (elem.not_element) {
            //this is not a html element -> instead passing a direct data object
            let objData = elem;

            data[objData.key] = objData._id;

        } else {
            target = $(elem);
            key = target.data("key");
            val = target.val();

            if (target.is('div')) {
                //then it does not have value attr use data-value=""
                val = target.data("value");
            }

            if (key == "cover" || key == "logo") {
                let file = target.data("file");
                val = file;
                //key = "img";
            }

            data[key] = val;

            console.log(data);
        }


        Websites.update(website._id, {
            $set: data
        })
    });
});

Template.Website.helpers({
    'get_website': function () {
        return Websites.findOne();
    },
    'collections_list': function () {
        return Collections.find().fetch();
    },
    'highlight_selected': function (id) {
        let website = Websites.findOne();


        if (website && "highlights" in website) {
            let option = website.highlights[0];

            return option == id ? "selected" : "";
            
        }

        return;
    }
});

Template.Website.events({
    'change .js-edit-website': function (e) {
        let target = $(e.target);

        let website = Websites.findOne();
        let key = target.data("key");
        let val = target.val();
        let data = {}

        data[key] = val;

        Websites.update(website._id, {
            $set: data
        })
    },
    'change .js-highlight-select': function (e) {
        let target = $(e.target);

        let website = Websites.findOne();
        let val = $( ".js-highlight-select option:selected" ).val();
        let data = {}

        data["highlights"] = [val];

        Websites.update(website._id, {
            $set: data
        })
    }
});