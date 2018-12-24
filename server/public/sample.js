var isArray = function (val) {
  return /^http(s)?:\/\//.test(val)
}

var isFunction = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (lineStringProperty) {
  return typeof lineStringProperty
} : function (obj) {
  return obj && 'function' == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
}

function makeArray(array) {
  if (Array.isArray(array)) {
    /** @type {number} */
    var i = 0
    /** @type {!Array} */
    var ret = Array(array.length)
    for (; i < array.length; i++) {
      ret[i] = array[i]
    }
    return ret
  }
  return Array.from(array)
}

var parse = function (a) {
  if (!isArray(a)) {
    return null
  }
  var data = document.createElement('a')
  data.href = a
  var protocol = data.protocol
  var key = data.host
  var o = /:80$/
  var i = /:443$/
  return 'http:' === protocol && o.test(key) ? key = key.replace(o, '') : 'https:' === protocol && i.test(key) && (key = key.replace(i, '')), {
    host: key,
    protocol: protocol,
    origin: protocol + '//' + key
  }
}

var some = function (selector) {
  return `http://localhost:3000/${selector}`
}

var loadPicker = function (command) {
  switch (command) {
    case 'FORM_ELEMENT':
      return some('frame')
    case 'CONTROLLER':
      return some('controller')
    case 'PAYMENT_REQUEST_ELEMENT':
      return some('elements-inner-payment-request.html')
    case 'PAYMENT_REQUEST':
      return some('payment-request-inner.html')
  }
}

function update(val, m) {
  var set = []
  return Object.keys(val).forEach(function (n) {
    var value = val[n]
    var k = m ? m + '[' + n + ']' : n
    if (value && 'object' === (void 0 === value ? 'undefined' : isFunction(value))) {
      var v = update(value, k)
      if ('' !== v) {
        set = [].concat(makeArray(set), [v])
      }
    } else {
      if (void 0 !== value && null !== value) {
        set = [].concat(makeArray(set), [k + '=' + encodeURIComponent(String(value))])
      }
    }
  }), set.join('&').replace(/%20/g, '+')
}

function createIframe(options) {
  /** @type {string} */
  var context = window.location.href.toString()
  var ui = parse(context)
  var origin = ui ? ui.origin : ''
  update(Object.assign({}, options, {
    origin: origin,
    referrer: context,
    controllerId: 'controllerId'
  }))
  var node = document.createElement('iframe')
  node.setAttribute('frameborder', '0')
  node.setAttribute('allowTransparency', 'true')
  node.setAttribute('scrolling', 'no')
  node.setAttribute('name', options.id || '_iframe1')
  node.setAttribute('allowpaymentrequest', 'true')
  node.src = loadPicker(options.type)
  return node
}

function initStripesa(selector) {
  document.addEventListener('DOMContentLoaded', function (event) {
    document.body.appendChild(createIframe({
      type: 'CONTROLLER',
      id: '_frameController'
    }))
    document.querySelector(selector).appendChild(createIframe({
      type: 'FORM_ELEMENT',
      id: '_frameForm'
    }))
  })
}

function submitCardData() {
  window.frames._frameController.postMessage({action: 'submit', frame: '_frameForm'}, 'http://localhost:3000')
}

