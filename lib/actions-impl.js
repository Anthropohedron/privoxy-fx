/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

var actionsMap = {};

var dashedRE = /(?:^|-)([a-z])/g;
/*jslint unparam: true */
function dashedToCap(unused, letter) {
  return letter.toUpperCase();
}
/*jslint unparam: false */

function AbstractAction(Class, props) {
  var prop;
  var onResponse = Class.hasOwnProperty("onResponse") ?
    !!Class.onResponse : !Class.onRequest;
  var onRequest  = Class.hasOwnProperty("onRequest") ?
    !!Class.onRequest  : !Class.onResponse;

  this.Class         = Class;
  this.ordering      = Class.ordering || 10000;
  this.onResponse    = onResponse;
  Class.onResponse   = onResponse;
  this.onRequest     = onRequest;
  Class.onRequest    = onRequest;
  this.type          = Class.type;
  this.reprocess     = !!Class.reprocess;
  this.unimplemented = !Class.implemented;
  if (props) {
    for (prop in props) {
      if (props.hasOwnProperty(prop)) {
        this[prop] = props[prop];
      }
    }
  }
}
AbstractAction.prototype = {
  actOnRequest: function unimplementedOnRequest() {
    if (this.unimplemented) { return; }
    throw new Error("Attempted to call unimplemented " +
        this.Class.name + ".actOnRequest()");
  },
  actOnResponse: function unimplementedOnRequest() {
    if (this.unimplemented) { return; }
    throw new Error("Attempted to call unimplemented " +
        this.Class.name + ".actOnResponse()");
  }
};

var boolActionTpl = [
  "(function() { return function ",
  null,
  "() {}; }());"
];
var paramActionTpl = [
  "(function() { return function ",
  null,
  "(param) { this.param = param; }; }());"
];
function implementAction(action, classProps, instanceProps) {
  var fnTpl = (classProps.type === "bool") ?
    boolActionTpl : paramActionTpl;
  var prop, name = action.replace(dashedRE, dashedToCap);
  fnTpl[1] = name;
  /*jslint evil: true */
  var Class = eval(fnTpl.join(""));
  /*jslint evil: false */

  Class.actionName = action;
  actionsMap[action] = Class;
  if (classProps) {
    for (prop in classProps) {
      if (classProps.hasOwnProperty(prop)) {
        Class[prop] = classProps[prop];
      }
    }
  }
  Class.prototype = new AbstractAction(Class, instanceProps);
}
function createUnimplemented(action, type) {
  implementAction(action, {
    type: type || "param",
    ordering:   999999,
    onRequest:  false,
    onResponse: false
  });
}

createUnimplemented("change-x-forwarded-for", "param");
createUnimplemented("downgrade-http-version", "bool" );
createUnimplemented("external-filter",        "multi");
createUnimplemented("forward-override",       "param");
createUnimplemented("hide-from-header",       "param");
createUnimplemented("limit-connect",          "param");

implementAction("add-header", {
  ordering: 1000,
  onRequest: true,
  type: "multi",
}, {
  //TODO
});

implementAction("block", {
  ordering: 100,
  reprocess: true,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("client-header-filter", {
  ordering: 400,
  onRequest: true,
  type: "multi"
}, {
  //TODO
});

implementAction("client-header-tagger", {
  ordering: 1,
  onRequest: true,
  type: "multi"
}, {
  //TODO
});

implementAction("content-type-overwrite", {
  ordering: 500,
  type: "param"
}, {
  //TODO
});

implementAction("crunch-client-header", {
  ordering: 500,
  onRequest: true,
  type: "multi"
}, {
  //TODO
});

implementAction("crunch-if-none-match", {
  ordering: 500,
  onRequest: true,
  type: "bool"
}, {
  //TODO
});

implementAction("crunch-incoming-cookies", {
  ordering: 500,
  type: "bool"
}, {
  //TODO
});

implementAction("crunch-server-header", {
  ordering: 500,
  type: "multi"
}, {
  //TODO
});

implementAction("crunch-outgoing-cookies", {
  ordering: 500,
  onRequest: true,
  type: "bool"
}, {
  //TODO
});

implementAction("deanimate-gifs", {
  ordering: 3000,
  type: "param"
}, {
  //TODO
});

implementAction("fast-redirects", {
  ordering: 50,
  reprocess: true,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("filter", {
  ordering: 3000,
  type: "multi"
}, {
  //TODO
});

implementAction("force-text-mode", {
  ordering: 10,
  type: "bool"
}, {
  //TODO
});

implementAction("handle-as-empty-document", {
  ordering: 10,
  type: "bool"
}, {
  //TODO
});

implementAction("handle-as-image", {
  ordering: 10,
  type: "bool"
}, {
  //TODO
});

implementAction("hide-accept-language", {
  ordering: 500,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("hide-content-disposition", {
  ordering: 500,
  type: "param"
}, {
  //TODO
});

implementAction("hide-if-modified-since", {
  ordering: 500,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("hide-referrer", {
  ordering: 500,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("hide-user-agent", {
  ordering: 500,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("limit-cookie-lifetime", {
  ordering: 600,
  type: "param"
}, {
  //TODO
});

implementAction("overwrite-last-modified", {
  ordering: 500,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("prevent-compression", {
  ordering: 500,
  onRequest: true,
  type: "bool"
}, {
  //TODO
});

implementAction("redirect", {
  ordering: 200,
  reprocess: true,
  onRequest: true,
  type: "param"
}, {
  //TODO
});

implementAction("server-header-filter", {
  ordering: 400,
  type: "multi"
}, {
  //TODO
});

implementAction("server-header-tagger", {
  ordering: 1,
  type: "multi"
}, {
  //TODO
});

implementAction("session-cookies-only", {
  ordering: 600,
  type: "bool"
}, {
  //TODO
});

implementAction("set-image-blocker", {
  ordering: 10,
  type: "param"
}, {
  //TODO
});

exports.actionsMap = actionsMap;

