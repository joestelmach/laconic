// Laconic attempts to simplify the generation of DOM content.
(function() {
  var laconic = {

    // Generic function for generating a dom element.
    //
    // The first parameter MUST be a string specifying the element's 
    // tag name.  
    // 
    // An optional object of element attributs may follow directly 
    // after the tag name.  
    // 
    // Additional arguments will be considered children of the new 
    // element and may consist of elements, strings, or numbers.
    // 
    // for example:
    // $.el('div', {'class' : 'foo'}, 'bar');
    el : function() {
      // create a new element of the requested type
      var tagName = arguments.length === 0 ? 'div' : arguments[0];
      var el = document.createElement(tagName);
      
      // walk through the rest of the arguments
      var args = Array.prototype.slice.call(arguments, 1);
      for(var i=0; i<args.length; i++) {
        var arg = args[i];

        // if the argument is a dom node, we simply append it
        if(arg.nodeType == 1) {
          el.appendChild(arg); 
        }

        // if the argument is a string or a number, we create and append 
        // a new text node
        else if(
            (!!(arg === '' || (arg && arg.charCodeAt && arg.substr))) ||
            (!!(arg === 0 || (arg && arg.toExponential && arg.toFixed)))) {

          el.appendChild(document.createTextNode(arg));
        }

        // if the argument is a plain-old object, and we're processing the first 
        // argument, then we apply the object's values as element attributes
        else if(i === 0 && typeof(arg) === 'object') {
          for(var key in arg) {
            el.setAttribute(key, arg[key]);
          }
        }
      }
      
      return el;
    }
  };

  // add laconic to the $ namespace
  window.$ = window.$ || {};
  for(var key in laconic) {
    $[key] = laconic[key];
  }

  // add all HTML 5 element tag names as convenience methods
  var tagNames = ['a', 'abbr', 'address', 'are', 'article', 'aside', 'audio', 
    'b', 'base', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 
    'caption', 'cite', 'code', 'col', 'colgroup', 'command', 'datalist',
    'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'h1', 'head', 'header', 'hgroup',
    'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'keygen', 'kbd', 'label',
    'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 
    'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
    'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
    'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary',
    'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
    'title', 'tr', 'ul', 'var', 'video', 'wbr'
  ];
  for(var i=0; i<tagNames.length; i++) {
    $[tagNames[i]] = (function(tagName) {
      return function() {
        return laconic.el.apply(this, 
          [tagName].concat(Array.prototype.slice.call(arguments)));
      };
    })(tagNames[i]);
  }

})();
