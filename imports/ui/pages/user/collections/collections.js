import './collections.html';

COLLECTION_EDIT_ID = "collection.editing";


Template.Collections.onRendered(function () {
    $(document).on('collectionEditEvent', function (e, elem) {
        let target, key, val, data = {};

        let editCollection = Collections.findOne({ "_id": Session.get(COLLECTION_EDIT_ID) });

        target = $(elem);
        key = target.data("key");
        val = target.val();

        if (target.is('div')) {
            //then it does not have value attr use data-value=""
            val = target.data("value");
        }

        if (key == "products") {
            let productId = target.data("value");

            let productsList = editCollection.products;

            if (!productsList.includes(productId)) productsList.push(productId);

            val = productsList;


        }

        data[key] = val;

        Collections.update(Session.get(COLLECTION_EDIT_ID), {
            $set: data
        })
    });
});

Template.Collections.events({
    'click .js-remove-product': function (e) {
        let target = $(e.currentTarget);
        let editCollection = Collections.findOne({ "_id": Session.get(COLLECTION_EDIT_ID) });
        let index = target.data("index");

        let productsList = editCollection.products;
        productsList.splice(index, 1);

        Collections.update(editCollection._id, {
            $set: { products: productsList }
        });
    },
    'click .js-edit-collection': function (e, tmpl) {
        let id = $(e.currentTarget).data("collection");
        Session.set(COLLECTION_EDIT_ID, id);
    },
    "click .js-create-collection": function () {
        Collections.insert({ title: "New", products: [] })
    },
    "click .js-remove-collection": function () {
        let editCollection = Collections.findOne({ "_id": Session.get(COLLECTION_EDIT_ID) });

        if (editCollection) {
            Collections.remove(editCollection._id);
            hideModal("modalEditCollection");
        }
    }
});

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Template.Collections.helpers({
    'list_collections': function () {
        return Collections.find().fetch();
    },
    'get_product': function (id) {
        return Products.findOne(id);
    },
    'colletion_products_list': function () {
        let collection = Collections.findOne({ "_id": Session.get(COLLECTION_EDIT_ID) });
        let productIds = [];
        let list = [];

        if (collection) {
            productIds = collection.products;
            productIds.forEach(element => {
                list.push(Products.findOne(element));
            });

        }

        return list;//Products.find({ "_id": { "$in": productIds } }).fetch();
    },
    'editing_collection': function () {
        return Collections.findOne({ "_id": Session.get(COLLECTION_EDIT_ID) });
    }
});