import './notify.html';

const applicationServerPublicKey = 'BA477LIzpRITyZ83BaNVX5mjUOiNok2p0Kt9k7elV8sjmtro_kfwpcdVcD5JxVEGNyW5-P1QRny2n-K4GGodSi0';

pushButton = null;

let isSubscribed = false;
let swRegistration = null;


Template.notify.onRendered(function () {
  pushButton = $('.js-push-btn');
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('/sw.js')
      .then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
      })
      .catch(function (error) {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
    pushButton.text('Push Not Supported');
  }

});

Template.notify.events({
  'click .js-push-btn': function(){
    pushButton.prop('disabled', false);
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  }
});

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  console.log(Notification);
  if (Notification.permission === 'denied') {
    pushButton.text('Notification Blocked.');
    pushButton.prop('disabled', true);
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.text('Disable');
    pushButton.addClass("btn-danger");
    /* pushButton.hide(); */

  } else {
    pushButton.text('Enable');
    pushButton.removeClass("btn-danger");
    
  }

  pushButton.prop('disabled', false);
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application serv

  if (subscription) {
    /* subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible'); */
    let payload = JSON.stringify(subscription);
    var endpoint = FlowRouter.getParam("endpoint");

    let data = {
      payload: payload,
      user_fingerprint: Session.get("fingerprint"),
    }

    Meteor.call("website.notifications.subscribe", endpoint, data);
  } else {
    
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function (subscription) {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

function initializeUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}

