'use strict';

/*********************************************************************************
* Author: Kashif Iqbal Khan
* Email: kashiif@gmail.com
* Mozilla Developer profile: https://addons.mozilla.org/en-US/firefox/user/1803731/
* License: MIT
*********************************************************************************/

var selectElement = {
  oldTarget:null,

	init: function(evt) {

	},


  doSelect: function() {

    var answer = prompt ("Enter tag","");

    if (!answer)
      return;

    var wnd = gBrowser.selectedBrowser;
    var doc = wnd.contentDocument;

    var found = null;

    if (answer.charAt(0) == '#')
      found = doc.getElementById(answer.substr(1));
    else
      found = selectElement.evaluateXPath(doc, answer);

    if (found) {
      found[0].style.border = 'dashed 2px blue';
    }
    else {
      alert('Nothing found for this tag');
    }

  },


evaluateXPath: function (aNode, aExpr) {
  var xpe = new XPathEvaluator();
  var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
    aNode.documentElement : aNode.ownerDocument.documentElement);
  var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
  var found = [];
  var res;
  while (res = result.iterateNext())
    found.push(res);
  return found;
},


	perform: function() {
		var wnd = gBrowser.selectedBrowser;

		var doc = wnd.contentDocument;


    // insert css file
    var nodeToInsert = doc.createElement('link');
    nodeToInsert.setAttribute('rel', 'stylesheet');
    nodeToInsert.setAttribute('type', 'text/css');
    nodeToInsert.setAttribute('href', 'resource://select-element/cs-client.css');
    doc.head.appendChild(nodeToInsert);

    doc.addEventListener('mousemove', selectElement.mouseMoved);
    doc.addEventListener('click', selectElement.elementClicked);

	},

  mouseMoved: function(event) {
    var target = event.srcElement || event.target;

    if (selectElement.oldTarget)
      selectElement.oldTarget.classList.remove('box');
    target.classList.add('box');
    selectElement.oldTarget = target;

  },

  elementClicked: function(event) {

    var wnd = gBrowser.selectedBrowser;
    var doc = wnd.contentDocument;

    var target = selectElement.oldTarget;
    selectElement.oldTarget = null;

    doc.removeEventListener('mousemove', selectElement.mouseMoved);
    doc.removeEventListener('click', selectElement.elementClicked);

    var xpath = null;
    if (selectElement.id)
      xpath = '#' + selectElement.id;
    else {
      xpath = selectElement.getXPathForElement(target, doc);
    }

    alert(xpath);

  },

  getXPathForElement: function (el, xml) {
      var xpath = '';
      var pos, tempitem2;

      while(el !== xml.documentElement) {
          pos = 0;
          tempitem2 = el;
          while(tempitem2) {
              if (tempitem2.nodeType === 1 && tempitem2.nodeName === el.nodeName) {
                  // If it is ELEMENT_NODE of the same name
                  pos += 1;
              }
              tempitem2 = tempitem2.previousSibling;
          }

          xpath = "*[name()='"+el.nodeName+"']["+pos+']'+'/'+xpath;

          el = el.parentNode;
      }
      xpath = '/*'+"[name()='"+xml.documentElement.nodeName+"']"+'/'+xpath;
      xpath = xpath.replace(/\/$/, '');
      return xpath;
    }

};

window.addEventListener
(
  "load",
  function (e) { selectElement.init(e); },
  false
);