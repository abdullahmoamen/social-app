(this.webpackJsonpundefined=this.webpackJsonpundefined||[]).push([[7],{294:function(e,t,s){"use strict";s.r(t);var r=s(3),n=s.n(r),c=s(7),a=s(9),o=s(1),i=s(15),l=s(18),u=s(4),h=s.n(u),d=s(22),f=s(0);t.default=function(){var e=Object(o.useContext)(i.a),t=Object(l.a)({searchTerm:"",results:[],show:"neither",requestCounter:0}),s=Object(a.a)(t,2),r=s[0],u=s[1];function j(t){27==t.keyCode&&e({type:"closeSearch"})}return Object(o.useEffect)((function(){if(r.searchTerm.trim()){u((function(e){e.show="loading"}));var e=setTimeout((function(){u((function(e){e.requestCounter++}))}),400);return function(){return clearTimeout(e)}}u((function(e){e.show="neither"}))}),[r.searchTerm]),Object(o.useEffect)((function(){if(r.requestCounter){var e=function(){var e=Object(c.a)(n.a.mark((function e(){var s;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,h.a.post("/search",{searchTerm:r.searchTerm},{cancelToken:t.token});case 3:s=e.sent,u((function(e){e.results=s.data,e.show="results"})),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("error !");case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}(),t=h.a.CancelToken.source();return e(),function(){return t.cancel()}}}),[r.requestCounter]),Object(o.useEffect)((function(){return document.addEventListener("keyup",j),function(){return document.removeEventListener("keyup",j)}}),[]),Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)("div",{className:"search-overlay-top shadow-sm",children:Object(f.jsxs)("div",{className:"container container--narrow",children:[Object(f.jsx)("label",{htmlFor:"live-search-field",className:"search-overlay-icon",children:Object(f.jsx)("i",{className:"fas fa-search"})}),Object(f.jsx)("input",{onChange:function(e){var t=e.target.value;u((function(e){e.searchTerm=t}))},autoFocus:!0,type:"text",autoComplete:"off",id:"live-search-field",className:"live-search-field",placeholder:"What are you interested in?"}),Object(f.jsx)("span",{onClick:function(t){t.preventDefault(),e({type:"closeSearch"})},className:"close-live-search",children:Object(f.jsx)("i",{className:"fas fa-times-circle"})})]})}),Object(f.jsx)("div",{className:"search-overlay-bottom",children:Object(f.jsxs)("div",{className:"container container--narrow py-3",children:[Object(f.jsx)("div",{className:"circle-loader "+("loading"==r.show?"circle-loader--visible":"")}),Object(f.jsxs)("div",{className:"live-search-results "+("results"==r.show?"live-search-results--visible":""),children:[Boolean(r.results.length)&&Object(f.jsxs)("div",{className:"list-group shadow-sm",children:[Object(f.jsxs)("div",{className:"list-group-item active",children:[Object(f.jsx)("strong",{children:"Search Results"})," (",r.results.length," ",r.results.length>1?"items":"item"," )found"]}),r.results.map((function(t){return Object(f.jsx)(d.a,{post:t,onClick:function(){return e({type:"closeSearch"})}},t._id)}))]}),!Boolean(r.results.length)&&Object(f.jsx)("p",{className:"text-center alert-danger alert shadow-sm",children:"Whoops !, We couldn't find any results for this search \ud83d\ude44"})]})]})})]})}}}]);
//# sourceMappingURL=7.b36389dd.chunk.js.map