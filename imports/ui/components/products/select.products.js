import './select.products.html';

Template.select_products.helpers({
    'products_list': function(){
        return Products.find();
    }
})

Template.select_products.events({
    'click .js-product': function(e, tmpl){
        let elem = $(e.currentTarget);
        elem.data("key", tmpl.data.key);
        $(document).trigger(tmpl.data.eventId, [elem]);

        hideModal(tmpl.data.modalId);
    },
    'click .js-close-modal':function(e, tmpl){
        hideModal(tmpl.data.modalId);
        
    }
})