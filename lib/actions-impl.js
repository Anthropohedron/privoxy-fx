/*jslint vars: true, white: true, plusplus: true, todo: true */
"use strict";

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
  for (prop in props) {
    if (props.hasOwnProperty(prop)) {
      this[prop] = props[prop];
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

function AddHeader(param) {
  this.param = param;
  //TODO
}
AddHeader.ordering = 1000;
AddHeader.onRequest = true;
AddHeader.type = "multi";
AddHeader.prototype = new AbstractAction(AddHeader, {
  //TODO
});

function Block(param) {
  this.param = param;
  //TODO
}
Block.ordering = 100;
Block.reprocess = true;
Block.onRequest = true;
Block.type = "param";
Block.prototype = new AbstractAction(Block, {
  //TODO
});

function ClientHeaderFilter(param) {
  this.param = param;
  //TODO
}
ClientHeaderFilter.ordering = 400;
ClientHeaderFilter.onRequest = true;
ClientHeaderFilter.type = "multi";
ClientHeaderFilter.prototype = new AbstractAction(ClientHeaderFilter, {
  //TODO
});

function ClientHeaderTagger(param) {
  this.param = param;
  //TODO
}
ClientHeaderTagger.ordering = 1;
ClientHeaderTagger.onRequest = true;
ClientHeaderTagger.type = "multi";
ClientHeaderTagger.prototype = new AbstractAction(ClientHeaderTagger, {
  //TODO
});

function ContentTypeOverwrite(param) {
  this.param = param;
  //TODO
}
ContentTypeOverwrite.ordering = 500;
ContentTypeOverwrite.type = "param";
ContentTypeOverwrite.prototype = new AbstractAction(ContentTypeOverwrite, {
  //TODO
});

function CrunchClientHeader(param) {
  this.param = param;
  //TODO
}
CrunchClientHeader.ordering = 500;
CrunchClientHeader.onRequest = true;
CrunchClientHeader.type = "multi";
CrunchClientHeader.prototype = new AbstractAction(CrunchClientHeader, {
  //TODO
});

function CrunchIfNoneMatch() {
  //TODO
}
CrunchIfNoneMatch.ordering = 500;
CrunchIfNoneMatch.onRequest = true;
CrunchIfNoneMatch.type = "bool";
CrunchIfNoneMatch.prototype = new AbstractAction(CrunchIfNoneMatch, {
  //TODO
});

function CrunchIncomingCookies() {
  //TODO
}
CrunchIncomingCookies.ordering = 500;
CrunchIncomingCookies.type = "bool";
CrunchIncomingCookies.prototype = new AbstractAction(CrunchIncomingCookies, {
  //TODO
});

function CrunchServerHeader(param) {
  this.param = param;
  //TODO
}
CrunchServerHeader.ordering = 500;
CrunchServerHeader.type = "multi";
CrunchServerHeader.prototype = new AbstractAction(CrunchServerHeader, {
  //TODO
});

function CrunchOutgoingCookies() {
  //TODO
}
CrunchOutgoingCookies.ordering = 500;
CrunchOutgoingCookies.onRequest = true;
CrunchOutgoingCookies.type = "bool";
CrunchOutgoingCookies.prototype = new AbstractAction(CrunchOutgoingCookies, {
  //TODO
});

function DeanimateGifs(param) {
  this.param = param;
  //TODO
}
DeanimateGifs.ordering = 3000;
DeanimateGifs.type = "param";
DeanimateGifs.prototype = new AbstractAction(DeanimateGifs, {
  //TODO
});

function FastRedirects(param) {
  this.param = param;
  //TODO
}
FastRedirects.ordering = 50;
FastRedirects.reprocess = true;
FastRedirects.onRequest = true;
FastRedirects.type = "param";
FastRedirects.prototype = new AbstractAction(FastRedirects, {
  //TODO
});

function Filter(param) {
  this.param = param;
  //TODO
}
Filter.ordering = 3000;
Filter.type = "multi";
Filter.prototype = new AbstractAction(Filter, {
  //TODO
});

function ForceTextMode() {
  //TODO
}
ForceTextMode.ordering = 10;
ForceTextMode.type = "bool";
ForceTextMode.prototype = new AbstractAction(ForceTextMode, {
  //TODO
});

function HandleAsEmptyDocument() {
  //TODO
}
HandleAsEmptyDocument.ordering = 10;
HandleAsEmptyDocument.type = "bool";
HandleAsEmptyDocument.prototype = new AbstractAction(HandleAsEmptyDocument, {
  //TODO
});

function HandleAsImage() {
  //TODO
}
HandleAsImage.ordering = 10;
HandleAsImage.type = "bool";
HandleAsImage.prototype = new AbstractAction(HandleAsImage, {
  //TODO
});

function HideAcceptLanguage(param) {
  this.param = param;
  //TODO
}
HideAcceptLanguage.ordering = 500;
HideAcceptLanguage.onRequest = true;
HideAcceptLanguage.type = "param";
HideAcceptLanguage.prototype = new AbstractAction(HideAcceptLanguage, {
  //TODO
});

function HideContentDisposition(param) {
  this.param = param;
  //TODO
}
HideContentDisposition.ordering = 500;
HideContentDisposition.type = "param";
HideContentDisposition.prototype = new AbstractAction(HideContentDisposition, {
  //TODO
});

function HideIfModifiedSince(param) {
  this.param = param;
  //TODO
}
HideIfModifiedSince.ordering = 500;
HideIfModifiedSince.onRequest = true;
HideIfModifiedSince.type = "param";
HideIfModifiedSince.prototype = new AbstractAction(HideIfModifiedSince, {
  //TODO
});

function HideReferrer(param) {
  this.param = param;
  //TODO
}
HideReferrer.ordering = 500;
HideReferrer.onRequest = true;
HideReferrer.type = "param";
HideReferrer.prototype = new AbstractAction(HideReferrer, {
  //TODO
});

function HideUserAgent(param) {
  this.param = param;
  //TODO
}
HideUserAgent.ordering = 500;
HideUserAgent.onRequest = true;
HideUserAgent.type = "param";
HideUserAgent.prototype = new AbstractAction(HideUserAgent, {
  //TODO
});

function LimitCookieLifetime(param) {
  this.param = param;
  //TODO
}
LimitCookieLifetime.ordering = 600;
LimitCookieLifetime.type = "param";
LimitCookieLifetime.prototype = new AbstractAction(LimitCookieLifetime, {
  //TODO
});

function OverwriteLastModified(param) {
  this.param = param;
  //TODO
}
OverwriteLastModified.ordering = 500;
OverwriteLastModified.onRequest = true;
OverwriteLastModified.type = "param";
OverwriteLastModified.prototype = new AbstractAction(OverwriteLastModified, {
  //TODO
});

function PreventCompression() {
  //TODO
}
PreventCompression.ordering = 500;
PreventCompression.onRequest = true;
PreventCompression.type = "bool";
PreventCompression.prototype = new AbstractAction(PreventCompression, {
  //TODO
});

function Redirect(param) {
  this.param = param;
  //TODO
}
Redirect.ordering = 200;
Redirect.reprocess = true;
Redirect.onRequest = true;
Redirect.type = "param";
Redirect.prototype = new AbstractAction(Redirect, {
  //TODO
});

function ServerHeaderFilter(param) {
  this.param = param;
  //TODO
}
ServerHeaderFilter.ordering = 400;
ServerHeaderFilter.type = "multi";
ServerHeaderFilter.prototype = new AbstractAction(ServerHeaderFilter, {
  //TODO
});

function ServerHeaderTagger(param) {
  this.param = param;
  //TODO
}
ServerHeaderTagger.ordering = 1;
ServerHeaderTagger.type = "multi";
ServerHeaderTagger.prototype = new AbstractAction(ServerHeaderTagger, {
  //TODO
});

function SessionCookiesOnly() {
  //TODO
}
SessionCookiesOnly.ordering = 600;
SessionCookiesOnly.type = "bool";
SessionCookiesOnly.prototype = new AbstractAction(SessionCookiesOnly, {
  //TODO
});

function SetImageBlocker(param) {
  this.param = param;
  //TODO
}
SetImageBlocker.ordering = 10;
SetImageBlocker.type = "param";
SetImageBlocker.prototype = new AbstractAction(SetImageBlocker, {
  //TODO
});

exports.actionsMap = {
  "add-header":               AddHeader,
  "block":                    Block,
  "client-header-filter":     ClientHeaderFilter,
  "client-header-tagger":     ClientHeaderTagger,
  "content-type-overwrite":   ContentTypeOverwrite,
  "crunch-client-header":     CrunchClientHeader,
  "crunch-if-none-match":     CrunchIfNoneMatch,
  "crunch-incoming-cookies":  CrunchIncomingCookies,
  "crunch-server-header":     CrunchServerHeader,
  "crunch-outgoing-cookies":  CrunchOutgoingCookies,
  "deanimate-gifs":           DeanimateGifs,
  "fast-redirects":           FastRedirects,
  "filter":                   Filter,
  "force-text-mode":          ForceTextMode,
  "handle-as-empty-document": HandleAsEmptyDocument,
  "handle-as-image":          HandleAsImage,
  "hide-accept-language":     HideAcceptLanguage,
  "hide-content-disposition": HideContentDisposition,
  "hide-if-modified-since":   HideIfModifiedSince,
  "hide-referrer":            HideReferrer,
  "hide-user-agent":          HideUserAgent,
  "limit-cookie-lifetime":    LimitCookieLifetime,
  "overwrite-last-modified":  OverwriteLastModified,
  "prevent-compression":      PreventCompression,
  "redirect":                 Redirect,
  "server-header-filter":     ServerHeaderFilter,
  "server-header-tagger":     ServerHeaderTagger,
  "session-cookies-only":     SessionCookiesOnly,
  "set-image-blocker":        SetImageBlocker
};

