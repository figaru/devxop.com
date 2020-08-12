import './products.html';

TempProduct = new Mongo.Collection(null);

PRODUCT_EDIT_ID = "product.editing";

Template.Products.onCreated(function () {
    this.uploading = new ReactiveVar(false);
    this.uploadPercent = new ReactiveVar(0);
    this.uploadName = new ReactiveVar();
});


Template.Products.onRendered(function () {

    TempProduct.insert({ "title": "", "description": "" });

    $(document).on('productEditEvent', function (e, elem) {
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

            if (key == "file") {
                let file = target.data("file");
                val = file;
                key = "img";
            }

            data[key] = val;
        }

        Products.update(Session.get(PRODUCT_EDIT_ID), {
            $set: data
        })
    });

    $(document).on('productCreateEvent', function (e, elem) {
        //subscribers = $('.subscribers-testEvent');
        //subscribers.trigger('testEventHandler', [eventInfo]);
        let tempProduct = TempProduct.findOne();

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

            if (key == "file") {
                let file = target.data("file");
                val = file;
                key = "img";
            }

            data[key] = val;
        }


        TempProduct.update(tempProduct._id, {
            $set: data
        })
    });
});

Template.Products.helpers({
    'list_products': function () {
        return Products.find().fetch();
    },
    'editing_product': function () {
        return Products.findOne({ "_id": Session.get(PRODUCT_EDIT_ID) });
    },
    'get_temp': function () {
        return TempProduct.findOne();
    },
    'valid_to_create': function () {
        let temp = TempProduct.findOne();
        return temp && temp.title && temp.description && temp.price ? true : false;
    }
});

Template.Products.events({
    'click .js-edit-product': function (e, tmpl) {
        let productId = $(e.currentTarget).data("product");
        Session.set(PRODUCT_EDIT_ID, productId);
    },
    'click .js-remove-product': function (e, tmpl) {
        confirm(function (canceled, confirmed) {
            if (canceled) {
                
            } else {
                let id = $(e.currentTarget).data("product");

                if (id) {

                    Products.remove(id);
                }
            }
        });
    },
    'click .js-create-product': function (e, tmpl) {
        let temp = TempProduct.findOne();

        if (temp) {
            delete temp._id
            Products.insert(temp);

            let elemClose = tmpl.$(".close");
            elemClose.data("saved", true);
            elemClose.click();
        }
    },
    'click .close': function (e, tmpl) {
        let tempProduct = TempProduct.findOne();
        let isSaved = tmpl.$(".close").data("saved");

        if (!isSaved && tempProduct.img) {
            /* Meteor.call("files.remove", tempProduct.img, function (err, result) {
                if (err) {
                    //console.log(err);
                } else {
                    //console.log(result);
                    //tmpl.$(".close").click();
                }
            }); */
        } else {
            tmpl.$(".close").data("saved", false);
        }

    }
});
