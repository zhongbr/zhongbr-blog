"use strict";(self.webpackChunk_zhongbr_webpage=self.webpackChunk_zhongbr_webpage||[]).push([[3047],{22156:function(e){function n(e){!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,r,o){if(t.language===a){var u=t.tokenStack=[];t.code=t.code.replace(r,(function(e){if("function"===typeof o&&!o(e))return e;for(var r,c=u.length;-1!==t.code.indexOf(r=n(a,c));)++c;return u[c]=e,r})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var r=0,o=Object.keys(t.tokenStack);!function u(c){for(var i=0;i<c.length&&!(r>=o.length);i++){var g=c[i];if("string"===typeof g||g.content&&"string"===typeof g.content){var p=o[r],s=t.tokenStack[p],l="string"===typeof g?g:g.content,f=n(a,p),k=l.indexOf(f);if(k>-1){++r;var h=l.substring(0,k),m=new e.Token(a,e.tokenize(s,t.grammar),"language-"+a,s),b=l.substring(k+f.length),d=[];h&&d.push.apply(d,u([h])),d.push(m),b&&d.push.apply(d,u([b])),"string"===typeof g?c.splice.apply(c,[i,1].concat(d)):g.content=d}}else g.content&&u(g.content)}return c}(t.tokens)}}}})}(e)}e.exports=n,n.displayName="markupTemplating",n.aliases=[]}}]);