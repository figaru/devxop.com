

hideModal = function (id) {
    var myModalEl = document.getElementById(id)
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

}