// Laconic simplifies the generation of DOM content.
!function(context) {

  // The laconic function serves as a generic method for generating
  // DOM content, and also as a placeholder for helper functions.
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
  function laconic() {
    // create a new element of the requested type
    var tagName = arguments.length === 0 ? 'div' : arguments[0];
    var el = document.createElement(tagName);
    
    // walk through the rest of the arguments
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i=0; i<args.length; i++) {
      var arg = args[i];
      if(arg === null || arg === undefined) continue;

      // if the argument is a dom node, we simply append it
      if(arg.nodeType === 1) {
        el.appendChild(arg); 
      }

      // if the argument is an array, we append each element
      else if(Object.prototype.toString.call(arg) === '[object Array]') {
        for(var j=0; j<arg.length; j++) {
          var child = arg[j];
          if(child.nodeType === 1) {
            el.appendChild(child);
          }
        }
      }

      // if the argument is a string or a number, we append it as
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
          var value = arg[key];
          if(value !== null && value !== undefined) {
            // If we're setting a dom event, or the not-so-ie-supported classname
            // attribuet, we add the value as a direct property of the element
            if(key.substring(0, 2).toLowerCase() === 'on' || key.toLowerCase() === 'classname') {
              el[key] = value;
            }

            // otherwise, we set the value as an attribute
            else {
              el.setAttribute(key, value);
            }
          }
        }
      }
    }

    // Add an appendTo method to the newly created element, which will allow
    // the DOM insertion to be method chained to the creation.  For example:
    // $el.div('foo').appendTo(document.body);
    el.appendTo = function(parentNode) {
      if(parentNode.nodeType === 1 && this.nodeType === 1) {
        parentNode.appendChild(this);
      }
      return el;
    };
    
    return el;
  }

  laconic.registerTag = function(name, renderer) {
    if(!laconic[name]) {
      laconic[name] = function() {
        var el = laconic('div', {'class' : name});
        renderer.apply(el, Array.prototype.slice.call(arguments));
        return el;
      };
    }
  };

  // list of html 4 tags 
  var deprecatedTags = ['acronym', 'applet', 'basefont', 'big', 'center', 'dir',
    'font', 'frame', 'frameset', 'noframes', 'strike', 'tt', 'u', 'xmp'];

  // list html 5 tags
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

  // add our tag methods to the laconic object 
  for(var i=0; i<tags.length; i++) {
    laconic[tags[i]] = (function(tagName) {
      return function() {
        return laconic.apply(this, 
          [tagName].concat(Array.prototype.slice.call(arguments)));
      };
    })(tags[i]);
  }

  // If we're in a CommonJS environment, we export our laconic methods
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = laconic;
  } 

  // otherwise, we attach them to the top level $.el namespace
  else {
    var dollar = context['$'] || {};
    dollar['el'] = laconic;
    context['$'] = dollar;
  }
  
}(this);


