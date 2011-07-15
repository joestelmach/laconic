// Laconic simplifies the generation of DOM content.
(function() {

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
  // gen('div', {'class' : 'foo'}, 'bar');
  var gen = function() {
    // create a new element of the requested type
    var tagName = arguments.length === 0 ? 'div' : arguments[0];
    var el = document.createElement(tagName);
    
    // walk through the rest of the arguments
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i=0; i<args.length; i++) {
      var arg = args[i];

      // if the argument is a dom node, we simply append it
      if(arg.nodeType === 1) {
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

    // Add the appendTo method to the newly created element, which will allow
    // the DOM insertion to be method chained to the creation.  For example:
    // $el.div('foo').appendTo(document.body);
    el.appendTo = appendTo;
    
    return el;
  };

  // Generic function that appends the invoked object to the given parent node 
  var appendTo = function(parentNode) {
    if(parentNode.nodeType === 1 && this.nodeType === 1) {
      parentNode.appendChild(this);
    }
  };

  // Object describing the explicit laconic methods that should be added
  // to the $el namespace
  var laconic = {
    registerTag : function(name, renderer) {
      if(!$el[name]) {
        $el[name] = function() {
          var el = gen('div', {'class' : name});
          renderer.apply(el, Array.prototype.slice.call(arguments));
          return el;
        };
      }
    }
  };

  // list of html 4 tags not valid in html 5 that should be added as methods 
  // to the $el namespace
  var deprecatedTags = ['acronym', 'applet', 'basefont', 'big', 'center', 'dir',
    'font', 'frame', 'frameset', 'noframes', 'strike', 'tt', 'u', 'xmp'];

  // list all valid html 5 tags that should be added as methods to the
  // $el namespace, as well as the above deprecated tags
  var tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b',
    'base', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
    'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del',
    'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
    'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img',
    'input', 'ins', 'keygen', 'kbd', 'label', 'legend', 'li', 'link', 'map',
    'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
    'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp',
    'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small',
    'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
    'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
    'ul', 'var', 'video', 'wbr'].concat(deprecatedTags);

  // create the laconic $el namespace
  window.$el = window.$el || {};

  // add our laconic methods to the $el namespace 
  for(var key in laconic) {
    window.$el[key] = laconic[key];
  }

  // add our tag methods to the $el namespace 
  for(var i=0; i<tags.length; i++) {
    $el[tags[i]] = (function(tagName) {
      return function() {
        return gen.apply(this, 
          [tagName].concat(Array.prototype.slice.call(arguments)));
      };
    })(tags[i]);
  }
})();
