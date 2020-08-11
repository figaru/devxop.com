// Import client startup through a single index entry point
import '../../ui/layouts/index';
import '../../ui/pages/index';
import '../../ui/components/index';
import '../../ui/utils/index';

import './routes/index.js';


import WayPoint from '../../ui/vendors/js/jquery.waypoints.min.js';
import Carousel from '../../ui/vendors/js/owl.carousel.min.js';

import QRCode from 'qrcode-generator'

$(document).ready(function () {
    fingerprint();
    window["WayPoint"] = WayPoint;
    window["owlCarousel"] = Carousel;
    window["qrCode"] = QRCode;

});



fingerprint = function () {

    let res;
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.

        let fingerprint = localStorage.getItem("devxop_fingerprint");


        if(!fingerprint){
            let id = uuidv4();

            localStorage.setItem("devxop_fingerprint", id);

            Session.set("fingerprint", id);
            res = id;
        }else{
            Session.set("fingerprint", fingerprint);
            res = fingerprint;
        }

    } else {
        // Sorry! No Web Storage support..
        console.log("localStorage not available");
    }

    window["fingerprint"] = res;

    return res;

}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }





