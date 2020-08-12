

hideModal = function (id) {

    var myModalEl = document.getElementById(id)
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();

}

showModal = function (id) {

    var myModalEl = document.getElementById(id);


    var myModal = new bootstrap.Modal(myModalEl, {
        keyboard: false
      })

      myModal.show();

    /* var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.show();
 */
}