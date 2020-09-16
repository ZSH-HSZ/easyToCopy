let originalXHR = window.XMLHttpRequest;
function get(source, path, defaultValue = undefined) {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  for (const p of paths) {
    result = Object(result)[p];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
}

let copyTargetJS;
let defaultDataJS;
let responseData;

let myXHR = function() {
  let xhr = new originalXHR();
  for (let attr in xhr) {
    if (attr === 'onreadystatechange') {
      xhr.onreadystatechange = (...args) => {
        if (this.readyState == 4) {
          let response = JSON.parse(this.responseText);
          if (copyTargetJS) {
            responseData = get(response, copyTargetJS, defaultDataJS);
          } else {
            responseData = response;
          }
          navigator.clipboard.writeText(JSON.stringify(responseData));
        }
        this.onreadystatechange && this.onreadystatechange.apply(this, args);
      };
      continue;
    }
    if (typeof xhr[attr] === 'function') {
      this[attr] = xhr[attr].bind(xhr);
    } else {
      // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this['_' + attr]上
      if (attr === 'responseText' || attr === 'response') {
        Object.defineProperty(this, attr, {
          get: () => (this['_' + attr] == undefined ? xhr[attr] : this['_' + attr]),
          set: val => (this['_' + attr] = val),
          enumerable: true,
        });
      } else {
        Object.defineProperty(this, attr, {
          get: () => xhr[attr],
          set: val => (xhr[attr] = val),
          enumerable: true,
        });
      }
    }
  }
};
window.addEventListener(
  'message',
  function(event) {
    let { data } = event;
    let { target, type, status, copyTarget, defaultData } = data;
    if (status) {
      copyTargetJS = copyTarget;
      defaultDataJS = defaultData;
      window.XMLHttpRequest = myXHR;
    } else {
      window.XMLHttpRequest = originalXHR;
    }
  },
  false
);
