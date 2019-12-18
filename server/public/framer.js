var some = function (selector) {
  return `http://localhost:3000/${selector}`;
};

var loadPicker = function (command) {
  switch (command) {
    case 'FORM_ELEMENT':
      return some('frame');
    case 'CONTROLLER':
      return some('controller');
    case 'PAYMENT_REQUEST_ELEMENT':
      return some('elements-inner-payment-request.html');
    case 'PAYMENT_REQUEST':
      return some('payment-request-inner.html');
  }
};

function createIframe(options) {
  // var context = window.location.href.toString()
  // var ui = parse(context)
  var node = document.createElement('iframe');
  node.setAttribute('frameborder', '0');
  node.setAttribute('allowTransparency', 'true');
  node.setAttribute('scrolling', 'no');
  node.setAttribute('name', options.id || '_iframe1');
  node.setAttribute('allowpaymentrequest', 'true');
  node.src = loadPicker(options.type);
  return node;
}

function initStripesa(selector) {
  document.addEventListener('DOMContentLoaded', function (event) {
    document.body.appendChild(createIframe({
      type: 'CONTROLLER',
      id: '_frameController'
    }));
    document.querySelector(selector).appendChild(createIframe({
      type: 'FORM_ELEMENT',
      id: '_frameForm'
    }));
  });
}

function submitCardData() {
  window.frames._frameController.postMessage({action: 'submit', frame: '_frameForm'}, 'http://localhost:3000');
}

