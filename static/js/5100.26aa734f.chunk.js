"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5100],{5100:function(e,n,r){r.r(n),r.d(n,{default:function(){return be}});var t,a,i=r(9641),c=r(9565),l=r(8135),o=r(3114),s=r(920),u=r(6116),d=r(279),h=r(4531),v=r(6805),f=r(2413);!function(e){e.Document="Document",e.Header="Header",e.Paragraph="Paragraph",e.CodeBlock="CodeBlock",e.BlockQuote="BlockQuote",e.Table="Table",e.TableRow="TableRow",e.TableCell="TableCell",e.Html="Html",e.Image="Image",e.Link="Link",e.Yaml="Yaml",e.Str="Str",e.Strong="Strong",e.Emphasis="Emphasis",e.List="List",e.ListItem="ListItem",e.HorizontalRule="HorizontalRule",e.Delete="Delete",e.InlineMath="InlineMath",e.Math="Math"}(t||(t={})),function(e){e.Left="left",e.Right="right",e.Center="center"}(a||(a={}));var m=r(6495),p="title_nB5XL",x=r(6498),g=function(e){var n=e.node,r=e.children,t=(0,h.s0)(),a={id:n.key,className:p,onClick:function(){t("#".concat(n.key))}};switch(n.depth){case 1:return(0,x.jsx)("h1",(0,m.Z)((0,m.Z)({},a),{},{children:r}));case 2:return(0,x.jsx)("h2",(0,m.Z)((0,m.Z)({},a),{},{children:r}));case 3:return(0,x.jsx)("h3",(0,m.Z)((0,m.Z)({},a),{},{children:r}));case 4:return(0,x.jsx)("h4",(0,m.Z)((0,m.Z)({},a),{},{children:r}));case 5:return(0,x.jsx)("h5",(0,m.Z)((0,m.Z)({},a),{},{children:r}));default:return(0,x.jsx)("h6",(0,m.Z)((0,m.Z)({},a),{},{children:r}))}},j=function(e){var n=e.node;return(0,x.jsx)("span",{id:n.key,children:n.value})},k="strong_IlM1z",y=function(e){var n=e.node,r=e.children;return(0,x.jsx)("span",{id:n.key,className:k,children:r})},Z="emphasis_vw7W3",w=function(e){var n=e.node,r=e.children;return(0,x.jsx)("span",{id:n.key,className:Z,children:r})},N="delete_RLp88",b=function(e){var n=e.node,r=e.children;return(0,x.jsx)("span",{id:n.key,className:N,children:r})},C="paragraph_dCWzg",_=function(e){var n=e.node,r=e.children;return(0,x.jsx)("div",{id:n.key,className:C,children:r})},L=r(9482),R=r(2860),S="container_zux4R",I="footer_tFCco",M="item_CyOQe",A="copy_FuU09",B=function(e){var n=e.node,r=(0,s.useState)(!1),t=(0,o.Z)(r,2),a=t[0],i=t[1],u="dark-theme"===(0,h.Gm)().theme?L.Cf:L.bW,v=function(){var e=(0,l.Z)((0,c.Z)().mark((function e(){return(0,c.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,R.J)(n.value);case 2:i(!0);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,x.jsxs)("div",{id:n.key,className:S,children:[(0,x.jsx)(L.EK,{showLineNumbers:!0,text:n.value,language:n.lang,theme:(0,m.Z)((0,m.Z)({},u),{},{backgroundColor:"transparent"}),wrapLongLines:!0,codeBlock:!0}),n.lang&&(0,x.jsxs)("div",{className:I,children:[(0,x.jsxs)("div",{className:M,children:[(0,x.jsx)(f.JO,{className:"rp-faxian"}),n.lang]}),(0,x.jsxs)("div",{className:(0,d.Z)(M,A),onClick:v,children:[(0,x.jsx)(f.JO,{className:"rp-fuzhi"}),a?"\u5df2\u590d\u5236":"\u590d\u5236"]})]})]})},T="block-quote_gPVZ9",H=function(e){var n=e.node,r=e.children;return(0,x.jsx)("div",{id:n.key,className:T,children:r})},O=r(9614);function P(e){if(!e||(0,O.isAbsolute)(e))return e;var n=decodeURIComponent(window.location.hash);return(0,O.join)((0,O.dirname)(n.replace(/^#\/passage/,"/md")),e)}var z=function(e){var n=e.node,r=e.children,t=P(n.url);return(0,x.jsx)("a",{id:n.key,href:t,children:r})},F="img_Bpjcz",E=function(e){var n=e.node,r=P(n.url);return(0,x.jsx)("img",{id:n.key,className:F,src:r,alt:n.alt})},D=function(e){var n=e.node;return(0,x.jsx)("div",{id:n.key,dangerouslySetInnerHTML:{__html:n.value}})},G="table_mP6iA",q=function(e){var n=e.node,r=e.children;return(0,x.jsx)("table",{id:n.key,className:G,children:r})},U="header_jCqx2",Q=function(e){var n=e.node,r=e.children,t=n.parent;return(0,s.useMemo)((function(){var e;return 0===(null===t||void 0===t||null===(e=t.children)||void 0===e?void 0:e.indexOf(n))}),[null===t||void 0===t?void 0:t.children,n])?(0,x.jsx)("thead",{id:n.key,className:U,children:(0,x.jsx)("tr",{children:r})}):(0,x.jsx)("tr",{id:n.key,children:r})},Y="table-cell_Ggw9_",J="header_eEtYh",W=function(e){var n=e.node,r=e.children,t=n.parent,a=null===t||void 0===t?void 0:t.parent,c=(0,s.useMemo)((function(){var e;if(!t||!a)return"center";var r=t.children.indexOf(n);return(null===(e=a.align)||void 0===e?void 0:e[r])||"center"}),[n,t,a]),l=(0,s.useMemo)((function(){var e;return!(!t||!a)&&0===(null===a||void 0===a||null===(e=a.children)||void 0===e?void 0:e.indexOf(t))}),[t,a]);return(0,x.jsx)("td",{id:n.key,className:(0,d.Z)([Y],(0,i.Z)({},J,l)),style:{textAlign:l?"center":c},children:r})},X="container_Ofr4h",K="code-block_OFD1u",V=function(e){var n=e.node;return(0,x.jsx)("div",{id:n.key,className:X,children:(0,x.jsx)("div",{className:K,children:n.value})})},$=function(e){var n=e.node,r=e.children;return n.ordered?(0,x.jsx)("ol",{id:n.key,children:r}):(0,x.jsx)("ul",{id:n.key,children:r})},ee=function(e){var n=e.node,r=e.children;return(0,x.jsx)("li",{id:n.key,children:r})},ne="horizontal-rule_hqd5R",re=function(e){var n=e.node;return(0,x.jsx)("div",{id:n.key,className:ne})},te=function(e){var n=e.node;return(0,x.jsx)("div",{children:(0,x.jsx)(f.NI,{latex:n.value})})},ae="inline-math_Os9Bh",ie=function(e){var n=e.node;return(0,x.jsx)("span",{className:ae,children:(0,x.jsx)(f.NI,{latex:n.value})})},ce=new Map([[t.Header,g],[t.Str,j],[t.Strong,y],[t.Emphasis,w],[t.Delete,b],[t.Paragraph,_],[t.CodeBlock,B],[t.BlockQuote,H],[t.Link,z],[t.Image,E],[t.Html,D],[t.Table,q],[t.TableRow,Q],[t.TableCell,W],[t.Yaml,V],[t.List,$],[t.ListItem,ee],[t.HorizontalRule,re],[t.Math,te],[t.InlineMath,ie]]),le=function e(n){var r,a=n.node;if(!a)return(0,x.jsx)(f.hX,{texts:"\ud83d\ude80\ud83d\ude80\u6587\u7ae0\u52a0\u8f7d\u4e2d..."});var i=null===(r=a.children)||void 0===r?void 0:r.map((function(n){return(0,x.jsx)(e,{node:n},n.key)}));if(a.type===t.Document)return(0,x.jsx)(x.Fragment,{children:i});var c=ce.get(a.type);return c?(0,x.jsx)(c,{node:a,children:i}):(0,x.jsx)(x.Fragment,{children:i})},oe=(0,s.memo)(le);function se(e,n){var r=e.getBoundingClientRect(),t=r.width,a=r.height,i=r.top;return t||a?i-n.getBoundingClientRect().top:i}function ue(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:450,t=function(e){var n=e.time,r=e.startAxis,t=n,a=e.targetAxis-r;return(t/=e.duration/2)<1?a/2*t*t*t+r:a/2*((t-=2)*t*t+2)+r};return new Promise((function(a){var i=performance.now(),c=n.scrollTop;requestAnimationFrame((function l(o){var s=o-i;n.scrollTop=t({time:Math.min(s,r),startAxis:c,targetAxis:e,duration:r}),s<r?requestAnimationFrame(l):a(void 0)}))}))}var de="container_Gs76A",he="title_AfoNg",ve="item_RLSwA",fe="sharp_eXvmU",me=function(e){var n=e.sketch,r=(0,h.Gm)().scrollRef,t=function(){var e=(0,l.Z)((0,c.Z)().mark((function e(n){var t,a,i;return(0,c.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=r.current,!(a=document.getElementById(n))||!t){e.next=6;break}return i=se(a,t),e.next=6,ue(i,t);case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();return(0,x.jsxs)("div",{className:de,children:[(0,x.jsx)("div",{className:he,children:"\u76ee\u5f55"}),n.map((function(e){return(0,x.jsxs)("div",{onClick:function(){return t(e.key)},className:ve,style:{marginLeft:"".concat(20*(e.depth-1),"px")},children:[(0,x.jsx)("span",{className:fe,children:"#"}),e.text]},e.text)}))]})},pe=r(7629),xe=function(e){return String.fromCharCode.apply(String,(0,pe.Z)(e.toString().split("").map((function(e){return Number("a".charCodeAt(0)+Number(e))}))))};function ge(e,n){var r,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0;if(e.key="".concat(t?t+"-":"").concat(xe(a)),n&&(e.parent=n),null!==e&&void 0!==e&&null!==(r=e.children)&&void 0!==r&&r.length)for(var i=0;i<e.children.length;i++)e.children[i-1]&&(e.children[i].previousSibling=e.children[i-1]),e.children[i+1]&&(e.children[i].nextSibling=e.children[i+1]),ge(e.children[i],e,e.key,i)}function je(e){var n=[];return function e(r){var a;r.type===t.Header&&n.push({text:r.raw.replace(/#+\s*/g,""),depth:r.depth||0,key:r.key||""}),null!==(a=r.children)&&void 0!==a&&a.length&&r.children.forEach(e)}(e),n}var ke="passage-container_FGelG",ye="passage_yFK6h",Ze="sketch_RjCip",we="display_lC13A",Ne=function(){var e,n,r,t,a,m,p=(0,h.Gm)(),g=p.setStates,j=p.rate,k=void 0===j?0:j,y=p.onPageReady,Z=p.widthLevel,w=(0,u.UO)().path,N=(0,h.il)(v.passage),b=(0,o.Z)(N,2),C=b[0],_=b[1],L=(0,s.useState)([]),R=(0,o.Z)(L,2),S=R[0],I=R[1],M=(0,s.useState)(),A=(0,o.Z)(M,2),B=A[0],T=A[1],H=(0,h.e0)().onOpenTags;return(0,s.useEffect)((function(){var e,n;null===g||void 0===g||g({title:null===_||void 0===_||null===(e=_.data)||void 0===e||null===(n=e.catalogue)||void 0===n?void 0:n.title,footer:{showICP:!1,showCopyRight:!0,showPublicSecurity:!1}})}),[g,null===_||void 0===_||null===(e=_.data)||void 0===e||null===(n=e.catalogue)||void 0===n?void 0:n.title]),(0,h.bd)((0,l.Z)((0,c.Z)().mark((function e(){var n,r,t,a,i,l,s;return(0,c.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(w){e.next=2;break}return e.abrupt("return");case 2:return r=decodeURIComponent(w),e.next=5,Promise.all([C({path:r}),v.catalogue()]);case 5:t=e.sent,a=(0,o.Z)(t,2),i=a[0],l=a[1],T(null===l||void 0===l||null===(n=l.data)||void 0===n?void 0:n[r.replace(/\.json$/,".md")]),ge(i.data.ast),s=je(i.data.ast),I(s),null===y||void 0===y||y();case 14:case"end":return e.stop()}}),e)}))),[C,w]),(0,x.jsxs)("div",{className:ke,children:[(0,x.jsx)("div",{className:(0,d.Z)(Ze,(0,i.Z)({},we,[h.uo.normal,h.uo.large].includes(Z||h.uo.normal))),style:{top:"".concat(155-75*k,"px")},children:(0,x.jsx)(me,{sketch:S})}),(0,x.jsx)("div",{className:ye,children:(0,x.jsxs)("div",{className:(0,d.Z)("content","blur"),children:[(0,x.jsx)("div",{className:"tags",children:null===_||void 0===_||null===(r=_.data)||void 0===r||null===(t=r.catalogue)||void 0===t||null===(a=t.tags)||void 0===a?void 0:a.map((function(e){return(0,x.jsx)(f.Vp,{onClick:function(){return H([e])},children:e},e)}))}),(null===B||void 0===B?void 0:B.cover)&&(0,x.jsx)("img",{alt:"cover",className:"cover-image",src:B.cover}),(0,x.jsx)(oe,{node:null===_||void 0===_||null===(m=_.data)||void 0===m?void 0:m.ast})]})})]})},be=(0,s.memo)(Ne)},810:function(e,n,r){r.d(n,{Z:function(){return l}});var t=r(9565),a=r(8135),i=r(902),c=r.n(i);function l(){return o.apply(this,arguments)}function o(){return(o=(0,a.Z)((0,t.Z)().mark((function e(){return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c().get("/md/catalogue.json?r=".concat(Math.random()));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},6805:function(e,n,r){r.r(n),r.d(n,{catalogue:function(){return t.Z},passage:function(){return o},topics:function(){return u}});var t=r(810),a=r(9565),i=r(8135),c=r(902),l=r.n(c);function o(e){return s.apply(this,arguments)}function s(){return(s=(0,i.Z)((0,a.Z)().mark((function e(n){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l().get("/md/".concat(n.path,"?r=").concat(Math.random()));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function u(){return d.apply(this,arguments)}function d(){return(d=(0,i.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l().get("/md/topic.json?r=".concat(Math.random()));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}}}]);