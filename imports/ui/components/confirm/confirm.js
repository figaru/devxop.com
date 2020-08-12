import './confirm.html';

confirm = function (callback) {
    $(".js-action-confirm").unbind('click');
    $(".js-action-cancel").unbind('click');



    $(".js-popup-confirm").on("click", function(){

        hideModal("confirmPopupModal");

        return callback(null, true);
    });

    $(".js-popup-cancel").on("click", function(){

        return callback(true, null);
    });



    showModal("confirmPopupModal");
}


Template.confirm.events({
    'click .js-close-modal': function(e, tmpl){
        tmpl.$(".js-popup-cancel").click();
    }
})