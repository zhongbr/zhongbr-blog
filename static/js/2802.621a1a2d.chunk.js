"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2802],{2802:function(n,e,t){t.r(e),t.d(e,{default:function(){return y}});var o=t(920),a=t(2587),r=t(9299),c=t(9565),i=t(8135),u=t(279),s=t(2413),l=t(2860),d="container_CJP8Y",f="selected-tags_tS_Dz",p="passages-container_Pg1B9",v="passage-operations_dToIs",h=t(6498),g=new Map([[a.uo.tiny,1],[a.uo.mid,2],[a.uo.normal,3],[a.uo.large,3]]),m=function(n){var e=n.onEnterPassage,t=n.catalogue,r=(0,a.s0)(),m=(0,a.e0)(),w=m.onReplaceTags,x=m.onRemoveTag,j=m.onSelectTag,Z=m.tags,b=(0,a.Gm)(),k=b.screenWidth,C=b.widthLevel,y=g.get(C||a.uo.normal)||3,I=Math.min(1416,k||window.innerWidth),M=Math.floor((I-40-10*(y-1)-2*y)/y),R=(0,o.useMemo)((function(){return Object.values(t||{}).filter((function(n){return n.visible}))}),[t]),N=function(n){null===e||void 0===e||e(n),r("/passage/".concat(encodeURIComponent(n["json-path"])))},P=function(){var n=(0,i.Z)((0,c.Z)().mark((function n(e){return(0,c.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,(0,l.J)("".concat(window.location.protocol,"//").concat(window.location.host,"/#/passage/").concat(encodeURIComponent(e["json-path"])));case 2:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return(0,h.jsxs)("div",{className:d,style:{"--passages-list-width":"".concat(I,"px")},children:[!!Z.length&&(0,h.jsxs)("div",{className:(0,u.Z)("blur","border-radius-normal",f),children:[null===Z||void 0===Z?void 0:Z.map((function(n){return(0,h.jsx)(s.Vp,{selected:!0,onRemove:function(){return x(n)},children:n})})),(0,h.jsx)(s.Vp,{hideIcon:!0,onClick:function(){return w([])},children:"\u6e05\u9664"})]}),(0,h.jsx)("div",{className:p,children:R.map((function(n){var e,t;return(0,h.jsx)(s.Zb,{width:"".concat(M,"px"),onClickImage:function(){return N(n)},title:n.title,icon:n.icon,headerImage:n.cover,extraInfoHover:n.mdate,extraInfo:(0,h.jsx)("div",{children:null===n||void 0===n||null===(e=n.tags)||void 0===e||null===(t=e.map)||void 0===t?void 0:t.call(e,(function(n){return(0,h.jsx)(s.Vp,{onClick:function(){return j(n)},children:n},n)}))}),hoverContent:(0,h.jsxs)("div",{className:v,children:[(0,h.jsx)(s.JO,{className:"rp-faxian",text:"\u9605\u8bfb",onClick:function(){return N(n)}}),(0,h.jsx)(s.JO,{className:"rp-fuzhi",text:"\u590d\u5236",onClick:function(){return P(n)}})]})})}))})]})},w=t(9641),x=t(6495),j=t(3114),Z=t(810),b={tagsMap:new Map,catalogue:{}};function k(n){var e=n.onReady,t=(0,a.il)(Z.Z),r=(0,j.Z)(t,3),u=r[0],s=r[1],l=r[2],d=(0,a.e0)().tags,f=(0,a.gz)(b),p=(0,j.Z)(f,2),v=p[0],h=p[1],g=(0,a.tG)((function(n){return Object.keys(n).reduce((function(e,t){var o,a=n[t];return 0===d.length||null!==(o=a.tags)&&void 0!==o&&o.some((function(n){return d.includes(n)}))?(0,x.Z)((0,x.Z)({},e),{},(0,w.Z)({},t,a)):e}),{})}));return(0,a.bd)((0,i.Z)((0,c.Z)().mark((function n(){var t,o,a;return(0,c.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,u();case 2:t=n.sent,o=t.data,a=new Map,Object.values(o).reduce((function(n,e){var t=e.tags;return(void 0===t?[]:t).forEach((function(t){var o=n.get(t)||[];o.push(e),n.set(t,o)})),n}),a),h({tagsMap:a,catalogue:g(o)}),null===e||void 0===e||e();case 8:case"end":return n.stop()}}),n)}))),[d.join(","),g,h]),(0,o.useEffect)((function(){var n=(null===s||void 0===s?void 0:s.data)||{};h({catalogue:g(n)})}),[g,null===s||void 0===s?void 0:s.data,h]),(0,x.Z)({loading:l},v)}var C=function(){var n=(0,a.Gm)(),e=n.setStates,t=k({onReady:n.onPageReady}).catalogue;return(0,o.useEffect)((function(){null===e||void 0===e||e({title:r.TN,footer:{showICP:!0,showCopyRight:!0,showPublicSecurity:!0}})}),[e]),(0,h.jsx)(m,{catalogue:t})},y=(0,o.memo)(C)},810:function(n,e,t){t.d(e,{Z:function(){return i}});var o=t(9565),a=t(8135),r=t(902),c=t.n(r);function i(){return u.apply(this,arguments)}function u(){return(u=(0,a.Z)((0,o.Z)().mark((function n(){return(0,o.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,c().get("/md/catalogue.json?r=".concat(Math.random()));case 2:return n.abrupt("return",n.sent);case 3:case"end":return n.stop()}}),n)})))).apply(this,arguments)}}}]);