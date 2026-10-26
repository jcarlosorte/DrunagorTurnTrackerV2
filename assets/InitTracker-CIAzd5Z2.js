import{o as Qo,G as We,R as ue,r as T,j as e,a as jt,c as eo,e as rs,d as Bs,h as to,F as Yo,l as Jo,k as Zo,A as Ds,b as so,u as en,f as tn,i as sn,w as an,p as on,v as Qe,q as nn,s as Va,t as Fa,C as rn,I as ln,x as cn,y as dn,z as un,B as mn}from"./index-CfJzVuRB.js";import{d as ba,E as Fe,e as xn,f as ut,g as Ga,h as ao,i as ya,j as fn,k as pn,l as gn,m as hn,n as bn,o as oo,p as yn,q as ha,r as vn,s as jn,t as wn,u as Nn,v as _n,w as Cn,x as Tn,y as En,z as An,A as kn,B as In,C as $n,D as Rn,H as Xa,F as Dt,I as Sn,J as Mn}from"./index-Dqb8Ft95.js";import{m as os,P as Pn}from"./PageTransition-CkFuAve3.js";var On=Qo();function Wa(a){return We({attr:{viewBox:"0 0 24 24",fill:"currentColor"},child:[{tag:"path",attr:{d:"M17.0004 5.82843V13C17.0004 16.3137 14.3141 19 11.0004 19C7.68672 19 5.00043 16.3137 5.00043 13V4H3.00043V13C3.00043 17.4183 6.58215 21 11.0004 21C15.4187 21 19.0004 17.4183 19.0004 13V5.82843L21.536 8.36396L22.9502 6.94975L18.0004 2L13.0507 6.94975L14.4649 8.36396L17.0004 5.82843Z"},child:[]}]})(a)}function Ka(a){return We({attr:{viewBox:"0 0 24 24",fill:"currentColor"},child:[{tag:"path",attr:{d:"M17.0004 18.1716L14.4649 15.636L13.0507 17.0503L18.0004 22L22.9502 17.0503L21.536 15.636L19.0004 18.1716V11C19.0004 6.58172 15.4187 3 11.0004 3C6.58215 3 3.00043 6.58172 3.00043 11V20H5.00043V11C5.00043 7.68629 7.68672 5 11.0004 5C14.3141 5 17.0004 7.68629 17.0004 11V18.1716Z"},child:[]}]})(a)}function no(a){var c,b,j="";if(typeof a=="string"||typeof a=="number")j+=a;else if(typeof a=="object")if(Array.isArray(a)){var N=a.length;for(c=0;c<N;c++)a[c]&&(b=no(a[c]))&&(j&&(j+=" "),j+=b)}else for(b in a)a[b]&&(j&&(j+=" "),j+=b);return j}function At(){for(var a,c,b=0,j="",N=arguments.length;b<N;b++)(a=arguments[b])&&(c=no(a))&&(j&&(j+=" "),j+=c);return j}var is=a=>typeof a=="number"&&!isNaN(a),kt=a=>typeof a=="string",xt=a=>typeof a=="function",Bn=a=>kt(a)||is(a),va=a=>kt(a)||xt(a)?a:null,Dn=(a,c)=>a===!1||is(a)&&a>0?a:c,ja=a=>T.isValidElement(a)||kt(a)||xt(a)||is(a);function Ln(a,c,b=300){let{scrollHeight:j,style:N}=a;requestAnimationFrame(()=>{N.minHeight="initial",N.height=j+"px",N.transition=`all ${b}ms`,requestAnimationFrame(()=>{N.height="0",N.padding="0",N.margin="0",setTimeout(c,b)})})}function zn({enter:a,exit:c,appendPosition:b=!1,collapse:j=!0,collapseDuration:N=300}){return function({children:I,position:C,preventExitTransition:V,done:z,nodeRef:G,isIn:Q,playToast:J}){let x=b?`${a}--${C}`:a,ce=b?`${c}--${C}`:c,de=T.useRef(0);return T.useLayoutEffect(()=>{let K=G.current,D=x.split(" "),Y=S=>{S.target===G.current&&(J(),K.removeEventListener("animationend",Y),K.removeEventListener("animationcancel",Y),de.current===0&&S.type!=="animationcancel"&&K.classList.remove(...D))};K.classList.add(...D),K.addEventListener("animationend",Y),K.addEventListener("animationcancel",Y)},[]),T.useEffect(()=>{let K=G.current,D=()=>{K.removeEventListener("animationend",D),j?Ln(K,z,N):z()};Q||(V?D():(de.current=1,K.className+=` ${ce}`,K.addEventListener("animationend",D)))},[Q]),ue.createElement(ue.Fragment,null,I)}}function Qa(a,c){return{content:ro(a.content,a.props),containerId:a.props.containerId,id:a.props.toastId,theme:a.props.theme,type:a.props.type,data:a.props.data||{},isLoading:a.props.isLoading,icon:a.props.icon,reason:a.removalReason,status:c}}function ro(a,c,b=!1){return T.isValidElement(a)&&!kt(a.type)?T.cloneElement(a,{closeToast:c.closeToast,toastProps:c,data:c.data,isPaused:b}):xt(a)?a({closeToast:c.closeToast,toastProps:c,data:c.data,isPaused:b}):a}function Un({closeToast:a,theme:c,ariaLabel:b="close"}){return ue.createElement("button",{className:`Toastify__close-button Toastify__close-button--${c}`,type:"button",onClick:j=>{j.stopPropagation(),a(!0)},"aria-label":b},ue.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},ue.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function qn({delay:a,isRunning:c,closeToast:b,type:j="default",hide:N,className:I,controlledProgress:C,progress:V,rtl:z,isIn:G,theme:Q}){let J=N||C&&V===0,x={animationDuration:`${a}ms`,animationPlayState:c?"running":"paused"};C&&(x.transform=`scaleX(${V})`);let ce=At("Toastify__progress-bar",C?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${Q}`,`Toastify__progress-bar--${j}`,{"Toastify__progress-bar--rtl":z}),de=xt(I)?I({rtl:z,type:j,defaultClassName:ce}):At(ce,I),K={[C&&V>=1?"onTransitionEnd":"onAnimationEnd"]:C&&V<1?null:()=>{G&&b()}};return ue.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":J},ue.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${Q} Toastify__progress-bar--${j}`}),ue.createElement("div",{role:"progressbar","aria-hidden":J?"true":"false","aria-label":"notification timer","aria-valuenow":C?Math.round(V*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:de,style:x,...K}))}var Hn=1,io=()=>`${Hn++}`;function Vn(a,c,b){let j=1,N=0,I=[],C=[],V=c,z=new Map,G=new Set,Q=S=>(G.add(S),()=>G.delete(S)),J=()=>{C=Array.from(z.values()),G.forEach(S=>S())},x=({containerId:S,toastId:E,updateId:X})=>{let me=S?S!==a:a!==1,q=z.has(E)&&X==null;return me||q},ce=(S,E)=>{z.forEach(X=>{var me;(E==null||E===X.props.toastId)&&((me=X.toggle)==null||me.call(X,S))})},de=S=>{var E,X;S.isActive&&((X=(E=S.props)==null?void 0:E.onClose)==null||X.call(E,S.removalReason),S.isActive=!1,b(Qa(S,"removed")))},K=S=>{if(S==null)z.forEach(de);else{let E=z.get(S);E&&de(E)}J()},D=()=>{N-=I.length,I=[]},Y=S=>{var E,X;let{toastId:me,updateId:q}=S.props,se=q==null;S.staleId&&z.delete(S.staleId),S.isActive=!0,z.set(me,S),J(),b(Qa(S,se?"added":"updated")),se&&((X=(E=S.props).onOpen)==null||X.call(E))};return{id:a,props:V,observe:Q,toggle:ce,removeToast:K,toasts:z,clearQueue:D,buildToast:(S,E)=>{if(x(E))return;let{toastId:X,updateId:me,data:q,staleId:se,delay:re}=E,d=me==null;d&&N++;let _e={...V,style:V.toastStyle,key:j++,...Object.fromEntries(Object.entries(E).filter(([ee,Te])=>Te!=null)),toastId:X,updateId:me,data:q,isIn:!1,className:va(E.className||V.toastClassName),progressClassName:va(E.progressClassName||V.progressClassName),autoClose:E.isLoading?!1:Dn(E.autoClose,V.autoClose),closeToast(ee){let Te=z.get(X);Te&&(Te.removalReason=ee,K(X))},deleteToast(){if(z.get(X)!=null){if(z.delete(X),N--,N<0&&(N=0),I.length>0){Y(I.shift());return}J()}}};_e.closeButton=V.closeButton,E.closeButton===!1||ja(E.closeButton)?_e.closeButton=E.closeButton:E.closeButton===!0&&(_e.closeButton=ja(V.closeButton)?V.closeButton:!0);let ve={content:S,props:_e,staleId:se};V.limit&&V.limit>0&&N>V.limit&&d?I.push(ve):is(re)?setTimeout(()=>{Y(ve)},re):Y(ve)},setProps(S){V=S},setToggle:(S,E)=>{let X=z.get(S);X&&(X.toggle=E)},isToastActive:S=>{var E;return(E=z.get(S))==null?void 0:E.isActive},getSnapshot:()=>C}}var Re=new Map,ns=[],wa=new Set,Fn=a=>wa.forEach(c=>c(a)),lo=()=>Re.size>0;function Gn(){ns.forEach(a=>uo(a.content,a.options)),ns=[]}var Xn=(a,{containerId:c})=>{var b;return(b=Re.get(c||1))==null?void 0:b.toasts.get(a)};function co(a,c){var b;if(c)return!!((b=Re.get(c))!=null&&b.isToastActive(a));let j=!1;return Re.forEach(N=>{N.isToastActive(a)&&(j=!0)}),j}function Wn(a){if(!lo()){ns=ns.filter(c=>a!=null&&c.options.toastId!==a);return}if(a==null||Bn(a))Re.forEach(c=>{c.removeToast(a)});else if(a&&("containerId"in a||"id"in a)){let c=Re.get(a.containerId);c?c.removeToast(a.id):Re.forEach(b=>{b.removeToast(a.id)})}}var Kn=(a={})=>{Re.forEach(c=>{c.props.limit&&(!a.containerId||c.id===a.containerId)&&c.clearQueue()})};function uo(a,c){ja(a)&&(lo()||ns.push({content:a,options:c}),Re.forEach(b=>{b.buildToast(a,c)}))}function Qn(a){var c;(c=Re.get(a.containerId||1))==null||c.setToggle(a.id,a.fn)}function mo(a,c){Re.forEach(b=>{(c==null||!(c!=null&&c.containerId)||(c==null?void 0:c.containerId)===b.id)&&b.toggle(a,c==null?void 0:c.id)})}function Yn(a){let c=a.containerId||1;return{subscribe(b){let j=Vn(c,a,Fn);Re.set(c,j);let N=j.observe(b);return Gn(),()=>{N(),Re.delete(c)}},setProps(b){var j;(j=Re.get(c))==null||j.setProps(b)},getSnapshot(){var b;return(b=Re.get(c))==null?void 0:b.getSnapshot()}}}function Jn(a){return wa.add(a),()=>{wa.delete(a)}}function Zn(a){return a&&(kt(a.toastId)||is(a.toastId))?a.toastId:io()}function ls(a,c){return uo(a,c),c.toastId}function Ls(a,c){return{...c,type:c&&c.type||a,toastId:Zn(c)}}function zs(a){return(c,b)=>ls(c,Ls(a,b))}function ge(a,c){return ls(a,Ls("default",c))}ge.loading=(a,c)=>ls(a,Ls("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...c}));function er(a,{pending:c,error:b,success:j},N){let I;c&&(I=kt(c)?ge.loading(c,N):ge.loading(c.render,{...N,...c}));let C={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},V=(G,Q,J)=>{if(Q==null){ge.dismiss(I);return}let x={type:G,...C,...N,data:J},ce=kt(Q)?{render:Q}:Q;return I?ge.update(I,{...x,...ce}):ge(ce.render,{...x,...ce}),J},z=xt(a)?a():a;return z.then(G=>V("success",j,G)).catch(G=>V("error",b,G)),z}ge.promise=er;ge.success=zs("success");ge.info=zs("info");ge.error=zs("error");ge.warning=zs("warning");ge.warn=ge.warning;ge.dark=(a,c)=>ls(a,Ls("default",{theme:"dark",...c}));function tr(a){Wn(a)}ge.dismiss=tr;ge.clearWaitingQueue=Kn;ge.isActive=co;ge.update=(a,c={})=>{let b=Xn(a,c);if(b){let{props:j,content:N}=b,I={delay:100,...j,...c,toastId:c.toastId||a,updateId:io()};I.toastId!==a&&(I.staleId=a);let C=I.render||N;delete I.render,ls(C,I)}};ge.done=a=>{ge.update(a,{progress:1})};ge.onChange=Jn;ge.play=a=>mo(!0,a);ge.pause=a=>mo(!1,a);function sr(a){var c;let{subscribe:b,getSnapshot:j,setProps:N}=T.useRef(Yn(a)).current;N(a);let I=(c=T.useSyncExternalStore(b,j,j))==null?void 0:c.slice();function C(V){if(!I)return[];let z=new Map;return a.newestOnTop&&I.reverse(),I.forEach(G=>{let{position:Q}=G.props;z.has(Q)||z.set(Q,[]),z.get(Q).push(G)}),Array.from(z,G=>V(G[0],G[1]))}return{getToastToRender:C,isToastActive:co,count:I==null?void 0:I.length}}function ar(a){let[c,b]=T.useState(!1),[j,N]=T.useState(!1),I=T.useRef(null),C=T.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:V,pauseOnHover:z,closeToast:G,onClick:Q,closeOnClick:J}=a;Qn({id:a.toastId,containerId:a.containerId,fn:b}),T.useEffect(()=>{if(a.pauseOnFocusLoss)return x(),()=>{ce()}},[a.pauseOnFocusLoss]);function x(){document.hasFocus()||Y(),window.addEventListener("focus",D),window.addEventListener("blur",Y)}function ce(){window.removeEventListener("focus",D),window.removeEventListener("blur",Y)}function de(se){if(a.draggable===!0||a.draggable===se.pointerType){S();let re=I.current;C.canCloseOnClick=!0,C.canDrag=!0,re.style.transition="none",a.draggableDirection==="x"?(C.start=se.clientX,C.removalDistance=re.offsetWidth*(a.draggablePercent/100)):(C.start=se.clientY,C.removalDistance=re.offsetHeight*(a.draggablePercent===80?a.draggablePercent*1.5:a.draggablePercent)/100)}}function K(se){let{top:re,bottom:d,left:_e,right:ve}=I.current.getBoundingClientRect();se.pointerType==="mouse"&&a.pauseOnHover&&se.clientX>=_e&&se.clientX<=ve&&se.clientY>=re&&se.clientY<=d?Y():D()}function D(){b(!0)}function Y(){b(!1)}function S(){C.didMove=!1,document.addEventListener("pointermove",X),document.addEventListener("pointerup",me)}function E(){document.removeEventListener("pointermove",X),document.removeEventListener("pointerup",me)}function X(se){let re=I.current;if(C.canDrag&&re){C.didMove=!0,c&&Y(),a.draggableDirection==="x"?C.delta=se.clientX-C.start:C.delta=se.clientY-C.start,C.start!==se.clientX&&(C.canCloseOnClick=!1);let d=a.draggableDirection==="x"?`${C.delta}px, var(--y)`:`0, calc(${C.delta}px + var(--y))`;re.style.transform=`translate3d(${d},0)`,re.style.opacity=`${1-Math.abs(C.delta/C.removalDistance)}`}}function me(){E();let se=I.current;if(C.canDrag&&C.didMove&&se){if(C.canDrag=!1,Math.abs(C.delta)>C.removalDistance){N(!0),a.closeToast(!0),a.collapseAll();return}se.style.transition="transform 0.2s, opacity 0.2s",se.style.removeProperty("transform"),se.style.removeProperty("opacity")}}let q={onPointerDown:de,onPointerUp:K};return V&&z&&(q.onMouseEnter=Y,a.stacked||(q.onMouseLeave=D)),J&&(q.onClick=se=>{Q&&Q(se),C.canCloseOnClick&&G(!0)}),{playToast:D,pauseToast:Y,isRunning:c,preventExitTransition:j,toastRef:I,eventHandlers:q}}var xo=typeof window<"u"?T.useLayoutEffect:T.useEffect,Us=({theme:a,type:c,isLoading:b,...j})=>ue.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:a==="colored"?"currentColor":`var(--toastify-icon-color-${c})`,...j});function or(a){return ue.createElement(Us,{...a},ue.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function nr(a){return ue.createElement(Us,{...a},ue.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function rr(a){return ue.createElement(Us,{...a},ue.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function ir(a){return ue.createElement(Us,{...a},ue.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function lr(){return ue.createElement("div",{className:"Toastify__spinner"})}var Na={info:nr,warning:or,success:rr,error:ir,spinner:lr},cr=a=>a in Na;function dr({theme:a,type:c,isLoading:b,icon:j}){let N=null,I={theme:a,type:c};return j===!1||(xt(j)?N=j({...I,isLoading:b}):T.isValidElement(j)?N=T.cloneElement(j,I):b?N=Na.spinner():cr(c)&&(N=Na[c](I))),N}var ur=a=>{let{isRunning:c,preventExitTransition:b,toastRef:j,eventHandlers:N,playToast:I}=ar(a),{closeButton:C,children:V,autoClose:z,onClick:G,type:Q,hideProgressBar:J,closeToast:x,transition:ce,position:de,className:K,style:D,progressClassName:Y,updateId:S,role:E,progress:X,rtl:me,toastId:q,deleteToast:se,isIn:re,isLoading:d,closeOnClick:_e,theme:ve,ariaLabel:ee}=a,Te=At("Toastify__toast",`Toastify__toast-theme--${ve}`,`Toastify__toast--${Q}`,{"Toastify__toast--rtl":me},{"Toastify__toast--close-on-click":_e}),xe=xt(K)?K({rtl:me,position:de,type:Q,defaultClassName:Te}):At(Te,K),Me=dr(a),Je=!!X||!z,Ge={closeToast:x,type:Q,theme:ve},Ae=null;return C===!1||(xt(C)?Ae=C(Ge):T.isValidElement(C)?Ae=T.cloneElement(C,Ge):Ae=Un(Ge)),ue.createElement(ce,{isIn:re,done:se,position:de,preventExitTransition:b,nodeRef:j,playToast:I},ue.createElement("div",{id:q,tabIndex:0,onClick:G,"data-in":re,className:xe,...N,style:D,ref:j,...re&&{role:E,"aria-label":ee}},Me!=null&&ue.createElement("div",{className:At("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!d})},Me),ro(V,a,!c),Ae,!a.customProgressBar&&ue.createElement(qn,{...S&&!Je?{key:`p-${S}`}:{},rtl:me,theme:ve,delay:z,isRunning:c,isIn:re,closeToast:x,hide:J,type:Q,className:Y,controlledProgress:Je,progress:X||0})))},mr=(a,c=!1)=>({enter:`Toastify--animate Toastify__${a}-enter`,exit:`Toastify--animate Toastify__${a}-exit`,appendPosition:c}),xr=zn(mr("bounce",!0)),fr={position:"top-right",transition:xr,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:a=>a.altKey&&a.code==="KeyT"};function pr(a){let c={...fr,...a},b=a.stacked,[j,N]=T.useState(!0),I=T.useRef(null),{getToastToRender:C,isToastActive:V,count:z}=sr(c),{className:G,style:Q,rtl:J,containerId:x,hotKeys:ce}=c;function de(D){let Y=At("Toastify__toast-container",`Toastify__toast-container--${D}`,{"Toastify__toast-container--rtl":J});return xt(G)?G({position:D,rtl:J,defaultClassName:Y}):At(Y,va(G))}function K(){b&&(N(!0),ge.play())}return xo(()=>{var D;if(b){let Y=I.current.querySelectorAll('[data-in="true"]'),S=12,E=(D=c.position)==null?void 0:D.includes("top"),X=0,me=0;Array.from(Y).reverse().forEach((q,se)=>{let re=q;re.classList.add("Toastify__toast--stacked"),se>0&&(re.dataset.collapsed=`${j}`),re.dataset.pos||(re.dataset.pos=E?"top":"bot");let d=X*(j?.2:1)+(j?0:S*se),_e=Math.max(.5,1-(j?me:0));re.style.setProperty("--y",`${E?d:d*-1}px`),re.style.setProperty("--g",`${S}`),re.style.setProperty("--s",`${_e}`),X+=re.offsetHeight,me+=.025})}},[j,z,b]),T.useEffect(()=>{function D(Y){var S;let E=I.current;ce(Y)&&((S=E==null?void 0:E.querySelector('[tabIndex="0"]'))==null||S.focus(),N(!1),ge.pause()),Y.key==="Escape"&&(document.activeElement===E||E!=null&&E.contains(document.activeElement))&&(N(!0),ge.play())}return document.addEventListener("keydown",D),()=>{document.removeEventListener("keydown",D)}},[ce]),ue.createElement("section",{ref:I,className:"Toastify",id:x,onMouseEnter:()=>{b&&(N(!1),ge.pause())},onMouseLeave:K,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":c["aria-label"]},C((D,Y)=>{let S=Y.length?{...Q}:{...Q,pointerEvents:"none"};return ue.createElement("div",{tabIndex:-1,className:de(D),"data-stacked":b,style:S,key:`c-${D}`},Y.map(({content:E,props:X})=>ue.createElement(ur,{...X,stacked:b,collapseAll:K,isIn:V(X.toastId,X.containerId),key:`t-${X.key}`},E)))}))}var gr=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,Ya=new Map,hr=(a,c)=>{xo(()=>{if(typeof document>"u")return;let b=document,j=Ya.get(b);if(j){c&&j.setAttribute("nonce",c);return}let N=b.createElement("style");N.textContent=a,c&&N.setAttribute("nonce",c),b.head.appendChild(N),Ya.set(b,N)},[c])};function br(a){return hr(gr,a.nonce),ue.createElement(pr,{...a})}const _a=[{id:"runa1",cara:"A",posicion:"abajo",nombre:"Runa",accion:"Roba",numRunas:1,tipo:"runa"},{id:"runa1",cara:"B",posicion:"abajo",nombre:"Runa",accion:"Roba",numRunas:2,tipo:"runa"}],yr=[{id:"runa2",cara:"B",posicion:"abajo",nombre:"Runa",accion:"Roba",numRunas:2,tipo:"runa"}],Ca=[{id:"asalto1",cara:"A",posicion:"abajo",nombre:"Asalto_1",accion:"Emerge",accion2:"Asalto",numRunas:1,tipo:"asalto"},{id:"asalto1",cara:"B",posicion:"abajo",nombre:"Asalto_1",accion:"Desciende",accion2:"Asalto",numRunas:1,tipo:"asalto"}],Ta=[{id:"incru1",cara:"A",posicion:"arriba",nombre:"Incru_1",accion:"Manifiesta",numRunas:1,tipo:"incursion"},{id:"incru1",cara:"B",posicion:"arriba",nombre:"Incru_2",accion:"Manifiesta",numRunas:1,tipo:"incursion"}],Ea=[{id:"defen1",cara:"A",posicion:"arriba",nombre:"Defen_1",accion:"Roba",numRunas:1,tipo:"defensa",carta:"aldeano"},{id:"defen1",cara:"B",posicion:"arriba",nombre:"Defen_2",accion:"Roba",numRunas:1,tipo:"defensa",carta:"errantes"}],fo="/DrunagorTurnTrackerV2/assets/derribo-UjyQ6d6n.png",vr="/DrunagorTurnTrackerV2/assets/montaraz-CC7JE6JG.png",po="/DrunagorTurnTrackerV2/assets/sigilo-DHkSgnjb.png",go="/DrunagorTurnTrackerV2/assets/aturdimiento-BMgkfUOQ.png",ho="/DrunagorTurnTrackerV2/assets/lentitud-Yufku8Fy.png",bo="/DrunagorTurnTrackerV2/assets/hemorragia-CwYggX2T.png",yo="/DrunagorTurnTrackerV2/assets/veneno-B2qs8qNO.png",vo="/DrunagorTurnTrackerV2/assets/intimidar-D1LVUWl2.png",jo="/DrunagorTurnTrackerV2/assets/quemadura--jy37yB-.png",jr="/DrunagorTurnTrackerV2/assets/escudo-CwA9lrIA.png",wr="/DrunagorTurnTrackerV2/assets/tiempo-BdoWm4Vy.png",Nr="/DrunagorTurnTrackerV2/assets/grande-CuoTfVn5.png",_r="/DrunagorTurnTrackerV2/assets/evento-BJ54qoiN.png",Ne=[{id:"DERRIBO_I",texto:"derribo",accion:"derribo",reduce:"si",numReduce:1,turno:"principio",daño:0,max:1,imagen:fo,mostrar:"si",prevenible:"si"},{id:"MARCA_DE_MONTARAZ",texto:"marca",accion:"marca",reduce:"no",numReduce:0,turno:"",daño:0,max:1,imagen:vr,mostrar:"si",prevenible:"si"},{id:"SIGILO_I",texto:"sigilo",accion:"sigilo",reduce:"si",numReduce:1,turno:"principio",daño:0,max:1,imagen:po,mostrar:"si",prevenible:"si"},{id:"ATURDIMIENTO_I",texto:"aturdimiento",accion:"aturdimiento",reduce:"si",numReduce:1,turno:"principio",daño:0,max:1,imagen:go,mostrar:"si",prevenible:"si"},{id:"LENTITUD_I",texto:"lentitud",accion:"lentitud",reduce:"si",numReduce:1,turno:"principio",daño:0,max:1,imagen:ho,mostrar:"si",prevenible:"si"},{id:"HEMORRAGIA_I",texto:"hemorragia",accion:"hemorragia",reduce:"si",numReduce:4,turno:"principio",daño:1,max:4,imagen:bo,mostrar:"si",prevenible:"no"},{id:"VENENO_I",texto:"veneno",accion:"veneno",reduce:"no",numReduce:0,turno:"principio",daño:1,max:4,imagen:yo,mostrar:"si",prevenible:"no"},{id:"INTIMIDAR_I",texto:"intimidar",accion:"intimidar",reduce:"si",numReduce:4,turno:"final",daño:0,max:4,imagen:vo,mostrar:"si",prevenible:"si"},{id:"QUEMADURA_I",texto:"quemadura",accion:"quemadura",reduce:"si",numReduce:1,turno:"principio",daño:1,max:4,imagen:jo,mostrar:"si",prevenible:"no"},{id:"ESCUDO",texto:"escudo",accion:"escudo",reduce:"no",numReduce:0,turno:"principio",daño:0,max:4,imagen:jr,mostrar:"si",prevenible:"si"},{id:"TIEMPO",texto:"tiempo",accion:"tiempo",reduce:"si",numReduce:1,turno:"principio",daño:0,max:4,imagen:wr,mostrar:"no",prevenible:"si"}],Cr=[{id:"DERRIBO_I",imagen:fo},{id:"SIGILO_I",imagen:po},{id:"ATURDIMIENTO_I",imagen:go},{id:"LENTITUD_I",imagen:ho},{id:"HEMORRAGIA_I",imagen:bo},{id:"VENENO_I",texto:"veneno",imagen:yo},{id:"INTIMIDAR_I",imagen:vo},{id:"QUEMADURA_I",imagen:jo},{id:"GRANDE",imagen:Nr}],wo=[{id:"evento",max:0,imagen:_r}],mt=[{type:"hero",role:"defensor",position:"arriba",index:0},{type:"enemy",rune:"naranja",position:"arriba",index:1},{type:"enemy",rune:"verde",position:"arriba",index:3},{type:"hero",role:"lider",position:"arriba",index:4},{type:"enemy",rune:"azul",position:"arriba",index:5},{type:"enemy",rune:"rojo",position:"arriba",index:7},{type:"hero",role:"controlador",position:"arriba",index:8},{type:"enemy",rune:"gris",position:"arriba",index:9},{type:"rune",position:"arriba",index:10},{type:"enemy",rune:"naranja",position:"abajo",index:1},{type:"hero",role:"apoyo",position:"abajo",index:2},{type:"enemy",rune:"verde",position:"abajo",index:3},{type:"enemy",rune:"azul",position:"abajo",index:5},{type:"hero",role:"agresor",position:"abajo",index:6},{type:"enemy",rune:"rojo",position:"abajo",index:7},{type:"enemy",rune:"gris",position:"abajo",index:9},{type:"rune",position:"abajo",index:10}];function Tr(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 8a2 2 0 0 1-2 2h-2v2h4v2H9v-4a2 2 0 0 1 2-2h2V9H9V7h4a2 2 0 0 1 2 2z"},child:[]}]})(a)}function Er(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-5 14h-2V9h-2V7h4z"},child:[]}]})(a)}function Ar(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M11 15h2v-2h-2zm8-12H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 6h-4v2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4z"},child:[]}]})(a)}function kr(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 6h-4v2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H9v-2h4v-2H9V7h6z"},child:[]}]})(a)}function Ir(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 14h-2v-4H9V7h2v4h2V7h2z"},child:[]}]})(a)}function $r(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M.01 0h24v24h-24z"},child:[]},{tag:"path",attr:{d:"M19.01 3h-14c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 7.5c0 .83-.67 1.5-1.5 1.5.83 0 1.5.67 1.5 1.5V15a2 2 0 0 1-2 2h-4v-2h4v-2h-2v-2h2V9h-4V7h4a2 2 0 0 1 2 2z"},child:[]}]})(a)}function Rr(a){return We({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"},child:[]}]})(a)}const Lt=24,Sr={II:[[1,1,1,1]],I:[[1,1]],T:[[0,1,0],[1,1,1]],L:[[1,0],[1,1]],J:[[0,1],[0,1],[1,1]],S:[[1,1,0],[0,1,1]],Z:[[1,1,0],[0,1,0],[0,1,1]],U:[[1,0,1],[1,1,1]],Y:[[1,0,1],[1,1,1],[0,1,0]]},Mr=({type:a="T",color:c="bg-blue-500"})=>{const b=Sr[a];return e.jsx("div",{className:"inline-block leading-none",children:b.map((j,N)=>e.jsx("div",{className:"flex",style:{height:`${Lt}px`},children:j.map((I,C)=>I?e.jsx("div",{className:`flex items-center justify-center ${c}`,style:{width:`${Lt}px`,height:`${Lt}px`,lineHeight:0,padding:0,margin:0},children:e.jsx(ba,{size:Lt,className:"text-white",style:{display:"block",lineHeight:0,margin:0,padding:0}})},C):e.jsx("div",{style:{width:`${Lt}px`,height:`${Lt}px`,padding:0,margin:0}},C))},N))})};function Pr(a){return We({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"},child:[]}]})(a)}const Or={rojo:"bg-red-600",azul:"bg-blue-600",verde:"bg-green-600",naranja:"bg-orange-500",gris:"bg-gray-500"},No=({tile:a,tipo:c="add",onClose:b=()=>{}})=>{if(!(a!=null&&a.runa))return null;const{translations:j}=jt(),N=j.trackerInit||{},I=c==="remove"?`−1 ${N.rune}: ${N.colores[a.runa]}`:c==="show"?`🔮 ${N.manifestar||"Manifestar"}: ${N.colores[a.runa]}`:c==="retira"?`❌ ${N.retira||"Retirada"}: ${N.colores[a.runa]}`:`+1 ${N.rune}: ${N.colores[a.runa]}`;return e.jsxs("div",{className:`relative flex flex-col items-center justify-center p-4 rounded-xl shadow-2xl text-white ${Or[a.runa]} border-2 border-white`,children:[e.jsx("button",{onClick:b,className:"absolute top-1 right-1 bg-black bg-opacity-40 rounded-full p-1 hover:bg-opacity-70","aria-label":"Cerrar",children:e.jsx(Pr,{className:"text-white"})}),e.jsx("div",{className:"text-xs font-bold mb-2",children:I}),e.jsx(Mr,{type:a.dibujo,color:"text-white"})]})},Br=({onAddEnemy:a,onSelectCommander:c,onSelectBoss:b,onAddManual:j,behaviors:N,onSelectRuneCard:I,onTileDraw:C})=>{var Cs;const[V,z]=T.useState(!1),{language:G,setLanguage:Q,translations:J}=jt(),x=(J==null?void 0:J.trackerInit)||{},{resetPlacedEnemies:ce,activaHuesped:de,desactivaHuesped:K,huespedActivo:D,activaAcecho:Y,desactivaAcecho:S,acechoActivo:E,activaInvadidos:X,desactivaInvadidos:me,invadidosActivo:q,oscuridadActivo:se,activaOscuridad:re,desactivaOscuridad:d,asaltoActivo:_e,activaAsalto:ve,desactivaAsalto:ee}=eo(),[Te,xe]=T.useState(""),[Me,Je]=T.useState(""),[Ge,Ae]=T.useState(!1),[ft,Ue]=T.useState(!1),[It,ke]=T.useState(!1),[cs,Pe]=T.useState(!1),[ds,Ie]=T.useState(!1),[us,Ee]=T.useState(!1),[wt,Oe]=T.useState(null),{runes:$e,addRune:$t,removeRune:zt,getRuneCount:ms,clearRunes:pt,availableTiles:Ke,usedTiles:Ze,showTileToast:Be,setTileToasts:Rt,tileToasts:gt,drawTileByColor:et,drawTilePreviewByColor:Nt,drawMultipleTiles:xs,discardedTiles:fs,discardTileByColor:_t,discardTileRandom:qs,restoreDiscardedTile:Hs,pilas:Ut,setPilas:qt,addNewPila:Ht,activarPila:Vt,removeTileFromPila:je,addRunesCascade:B,addTileToPilaConcentrada:U,addTileToPila:fe,pilasConcentrada:te,setPilasConcentrada:oe,addNewPilaConcentrada:ie,activarPilaConcentrada:we,removeTileFromPilaConcentrada:be,removeSingleTileFromPilaConcentrada:Se,codigosPilas:tt,setCodigosPilas:Ct,handleCodigoChange:Tt,resetTiles:St,tileWarning:Mt,setTileWarning:ps,deleteAvailableTileByColor:Vs,deleteAvailableTileRandom:Fs,scenarioMonster:De,placeTilesFromPilaConcentradaToTrack:Aa,placeTilesFromPilaToTrack:gs,setScenarioMonster:Ft,setSpawnPoints:Gs,spawnPoints:hs,initializeSpawnPoints:bs,removeSpawnPoint:ys,controlPoints:Xs,setControlPoints:vs,initializeControlPoints:Ws,removeControlPoint:Ks,setRuneKeys:ka,runeKeys:Qs,initializeRuneKeys:st,removeRuneKey:Ys,setRescue:Js,rescue:js,initializeRescue:ws,removeRescue:Zs,initializeDecks:Ns,drawCardFromDeck:ea,showCardToast:at,manifestTile:ta}=rs(),{placedRunes:sa,resetPlacedRunes:_s}=Bs(),[Et,Gt]=T.useState(null),ht=T.useRef(null),aa=T.useRef(null),Xt=T.useRef(null),oa=T.useRef(null),{selectedExpansions:Wt}=to(),qe={rojo:"bg-red-700 hover:bg-red-600",azul:"bg-blue-700 hover:bg-blue-600",verde:"bg-green-700 hover:bg-green-600",naranja:"bg-orange-700 hover:bg-orange-600",gris:"bg-gray-600 hover:bg-gray-500"},ot=l=>{Gt(w=>w===l?null:l)};T.useEffect(()=>{const l=w=>{ht.current&&!ht.current.contains(w.target)&&Gt(null)};return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[]);const Kt=l=>{const w=l.target.value;w&&(w==="comandante"?c():a(w),xe(""))},na=l=>{const w=l.target.value;w&&(j(w),Je(w))},ra=Array.from(new Map(Fe.filter(l=>l.scenario==="escenario").map(l=>[l.id,l])).values()),Ce=(l,w=!1)=>{const pe=l.tipo;if(sa.some(Xe=>Xe.rune.tipo===pe)){alert(x.yaExiste);return}I(l,w)};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{ref:ht,className:"fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-80 backdrop-blur-xl shadow-lg",children:[e.jsxs("div",{className:"flex justify-between items-center px-4 py-2 max-w-screen-xl mx-auto",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>ot("enemies"),"aria-expanded":Et==="enemies",className:"bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700",children:e.jsx(xn,{size:24})}),e.jsx("button",{onClick:()=>ot("runes"),"aria-expanded":Et==="runes",className:"bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700",children:e.jsx(ut,{size:24})}),e.jsx("button",{onClick:()=>ot("scenario"),"aria-expanded":Et==="scenario",className:"bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700",children:e.jsx(Ga,{size:24})})]}),e.jsx("div",{className:"text-white font-bold text-lg",children:x.menu||"Menú"}),e.jsxs("div",{className:"flex items-center gap-2 text-white text-sm",children:[e.jsx(Yo,{className:"text-blue-300"}),e.jsxs("label",{htmlFor:"lang",children:[x.language||"Idioma",":"]}),e.jsx("select",{id:"lang",value:G,onChange:l=>Q(l.target.value),className:"bg-gray-800 text-white border border-gray-600 rounded px-2 py-1",children:Jo.map(l=>e.jsx("option",{value:l,children:Zo[l]},l))})]})]}),e.jsx(Ds,{children:Et==="enemies"&&e.jsxs(os.div,{ref:aa,initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.25},className:"px-4 pb-4 pt-2 flex flex-col gap-4 text-white",children:[e.jsxs("div",{className:"bg-gray-800 rounded-lg p-3 shadow-md justify-center",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(ao,{className:"text-blue-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.addEnemies||"Enemigos aleatorios"})]}),e.jsx("div",{className:"grid grid-cols-3 sm:grid-cols-6 gap-2",children:[{key:"blanco",label:x.addWhiteEnemies,color:"text-white"},{key:"gris",label:x.addGrayEnemies,color:"text-gray-400"},{key:"negro",label:x.addBlackEnemies,color:"text-black bg-white rounded"},{key:"comandante",label:x.addCommanders,color:"text-yellow-500"}].map(({key:l,label:w,color:pe})=>e.jsxs("button",{onClick:()=>{xe(l),Kt({target:{value:l}})},className:`flex flex-col items-center gap-1 px-2 py-2 text-sm rounded-lg font-semibold hover:bg-blue-500 transition ${Te===l?"bg-blue-600":"bg-gray-700"}`,children:[e.jsx(ya,{className:`text-2xl ${pe}`}),e.jsx("span",{className:"text-xs text-center",children:w})]},l))})]}),e.jsxs("div",{className:"bg-gray-800 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(Rr,{className:"text-purple-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.addManualEnemy||"Enemigos manuales"})]}),e.jsx("div",{className:"grid grid-cols-3 sm:grid-cols-9 gap-2",children:[{key:"esbirro",label:x.addMinionEnemies,color:"text-cyan-300"},{key:"blanco",label:x.addWhiteEnemies,color:"text-white"},{key:"gris",label:x.addGrayEnemies,color:"text-gray-400"},{key:"negro",label:x.addBlackEnemies,color:"text-black bg-white rounded"},{key:"comandante",label:x.addCommanders,color:"text-yellow-500"},{key:"overlord",label:x.selectOverlord,color:"text-red-400"},{key:"jefe",label:x.selectBosses,color:"text-purple-400"},{key:"hero",label:x.selectHeroFall,color:"text-orange-400"},{key:"escenario",label:x.selectScenario,color:"text-cyan-600"}].map(({key:l,label:w,color:pe})=>e.jsx(ue.Fragment,{children:e.jsxs("button",{onClick:()=>{Je(l),na({target:{value:l}})},className:`flex flex-col items-center gap-1 px-2 py-2 text-sm rounded-lg font-semibold hover:bg-purple-500 transition ${Me===l?"bg-purple-600":"bg-gray-700"}`,children:[e.jsx(ya,{className:`text-2xl ${pe}`}),e.jsx("span",{className:"text-xs text-center",children:w})]})},l))})]}),e.jsxs("div",{className:"flex justify-center gap-4 mt-2",children:[e.jsx("button",{onClick:ce,className:"px-4 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-full text-sm",children:x.resetEnemies||"Resetear enemigos"}),e.jsx("button",{onClick:ot,className:"px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm",children:x.close||"Cerrar"})]})]})}),e.jsx(Ds,{children:Et==="runes"&&e.jsx(os.div,{ref:Xt,initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.25},className:"px-4 pb-4 pt-2 flex flex-col gap-4 text-white",children:e.jsxs("div",{className:"flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500",children:[e.jsxs("div",{className:"flex flex-col md:flex-row gap-4",children:[e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md ",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(fn,{className:"text-indigo-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.cartas})]}),e.jsx("div",{className:"mb-2",children:e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center items-center",children:[e.jsx(ut,{className:"text-indigo-300 text-xl"}),se?e.jsx("button",{onClick:()=>{d(),_s(),Ae(!1)},className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.delRunes}):e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>{re(),_a.filter(w=>w.cara==="A").forEach(w=>Ce(w))},className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:x.addRunes}),e.jsx("button",{onClick:()=>Ae(l=>!l),className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.addRunesCara}),Ge&&e.jsxs("div",{className:"flex gap-2 flex-wrap mt-2 justify-center",children:[_a.map((l,w)=>e.jsxs("button",{onClick:()=>{re(),Ce(l)},className:"bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded",children:[x.cara," (",l.cara,")"]},`${l.id}-${l.cara}-${w}`)),e.jsxs("button",{onClick:()=>{re(),yr.filter(w=>w.cara==="B").forEach(w=>Ce(w))},className:"bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded",children:[x.addRunes2," (B)"]})]})]})]})}),Wt.includes("infernal_desert")&&e.jsx("div",{className:"mb-2",children:e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[e.jsx(pn,{className:"text-indigo-300 text-xl"}),_e?e.jsx("button",{onClick:()=>{ee(),_s(),Ue(!1)},className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.delRunes_w}):e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>{ve(),Ca.filter(w=>w.cara==="A").forEach(w=>Ce(w))},className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:x.addRunes_w}),e.jsx("button",{onClick:()=>Ue(l=>!l),className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.addRunesCara_w}),ft&&e.jsx("div",{className:"flex gap-2 flex-wrap mt-2 justify-center",children:Ca.map((l,w)=>e.jsxs("button",{onClick:()=>{ve(),Ce(l)},className:"bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded",children:[x.cara," (",l.cara,")"]},`${l.id}-${l.cara}-${w}`))})]})]})}),e.jsx("div",{className:"mb-2",children:e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center items-center",children:[e.jsx(gn,{className:"text-indigo-300 text-xl"}),E?e.jsx("button",{onClick:S,className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.desactivaAcecho}):e.jsx("button",{onClick:()=>Ie(l=>!l),className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:x.activaAcecho})]}),!E&&ds&&e.jsxs("div",{className:"flex gap-2 flex-wrap justify-center",children:[e.jsx("button",{onClick:()=>{Y(),b("undead_king_boss_Acecho_1"),Ie(!1)},className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded",children:"Embrujo 0"}),e.jsx("button",{onClick:()=>{Y(),b("undead_king_boss_Acecho_1"),Ie(!1)},className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded",children:"Embrujo I"}),e.jsx("button",{onClick:()=>{Y(),b("undead_king_boss_Acecho_1"),Ie(!1)},className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded",children:"Embrujo II"}),e.jsx("button",{onClick:()=>{Y(),b("undead_king_boss_Acecho_2"),Ie(!1)},className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded",children:"Embrujo III"})]})]})}),Wt.includes("undead_dragon")&&e.jsx("div",{className:"mb-2",children:e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[e.jsx(hn,{className:"text-indigo-300 text-xl"}),D?e.jsx("button",{onClick:K,className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.desactivaHuesped}):e.jsx("button",{onClick:de,className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:x.activaHuesped})]})}),e.jsx("div",{className:"mb-2",children:e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[e.jsx(bn,{className:"text-indigo-300 text-xl"}),q?e.jsx("button",{onClick:()=>{me(),Ft(l=>(l==null?void 0:l.id)==="dark_vampire"?null:"dark_vampire")},className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.desactivaInvadidos}):e.jsx("button",{onClick:()=>{X(),Ft(l=>(l==null?void 0:l.id)==="dark_vampire"?null:"dark_vampire")},className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:x.activaInvadidos})]})})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(oo,{className:"text-yellow-300 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:x.estadoBolsa||"Estado de la Bolsa de Runas"})]}),e.jsxs("div",{className:"text-sm text-white justify-center",children:[x.extraidas,": ",e.jsx("b",{children:Ze.length}),e.jsx("br",{}),x.total,": ",e.jsx("b",{children:Ke.length+Ze.length})]}),e.jsx("div",{className:"flex items-center gap-2 text-xs justify-center",children:[{id:"naranja",color:"#ff8c00"},{id:"verde",color:"#00aa00"},{id:"azul",color:"#0077cc"},{id:"rojo",color:"#cc0000"},{id:"gris",color:"#999999"}].map(({id:l,color:w})=>{const pe=Ze.filter(Xe=>Xe.runa===l).length,Le=Ke.filter(Xe=>Xe.runa===l).length;return e.jsxs("div",{className:"px-2 py-1 rounded font-semibold",style:{backgroundColor:w,color:"white"},children:[x.colores[l]||l,": ",pe,"/",pe+Le]},l)})})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex flex-row items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-blue-400 text-xl inline-block"}),e.jsx("span",{className:"font-semibold whitespace-nowrap",children:x.manifestarTitulo||"Manifestar Runa"})]}),e.jsx("div",{className:"flex flex-wrap gap-2 justify-center",children:e.jsx("button",{onClick:()=>{ta()},className:"bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded",children:x.manifestar||"Manifestar"})})]})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4",children:[e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ba,{className:"text-green-300 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.fichas})]}),e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[["naranja","verde","azul","rojo","gris"].map(l=>e.jsx("button",{onClick:()=>{const w=et(l);w&&C?C(w):alert(`${x.aviso2} ${x.colores[l]}`)},className:`${qe[l]} text-white text-xs px-2 py-1 rounded-full`,children:x.colores[l]},l)),e.jsxs("button",{onClick:()=>{const l=["naranja","verde","azul","rojo","gris"],w=l[Math.floor(Math.random()*l.length)],pe=et(w);pe&&C?C(pe):alert(`${x.aviso2} ${x.colores[w]}`)},className:"bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full",children:["🎲 ",x.fichaAleatoria||"Aleatoria"]})]})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-purple-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.oscuridadCascada})]}),e.jsx("div",{className:"flex flex-wrap gap-2 justify-center",children:[1,2,3,4].map(l=>e.jsxs("button",{onClick:()=>B(l),className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded-full",children:["➕ ",l]},l))})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ba,{className:"text-red-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.removeTiles||"Eliminar fichas de runa"})]}),e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[["naranja","verde","azul","rojo","gris"].map(l=>e.jsx("button",{onClick:()=>{const w=zt(l);w?Be(w,"remove"):alert(`${x.noTilesToRemove}`)},className:`${qe[l]} text-white text-xs px-2 py-1 rounded-full`,children:x.colores[l]},l)),e.jsxs("button",{onClick:()=>{const l=["naranja","verde","azul","rojo","gris"].filter(Le=>$e[Le]>0);if(l.length===0){alert(x.noTilesToRemove||"No hay fichas para eliminar.");return}const w=l[Math.floor(Math.random()*l.length)],pe=zt(w);pe&&pe.runa?Be(pe,"remove"):alert(x.noTilesToRemove)},className:"bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full",children:["🎲 ",x.removeRandom||"Aleatoria"]})]})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(yn,{className:"text-red-400 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:x.eliminarDirecto})]}),e.jsxs("div",{className:"flex flex-wrap gap-2 justify-center",children:[["naranja","verde","azul","rojo","gris"].map(l=>e.jsx("button",{onClick:()=>{const w=Vs(l);w?Be(w,"remove"):alert(`${x.noTilesToRemove} ${x.colores[l]}`)},className:`${qe[l]} text-white text-xs px-2 py-1 rounded-full`,children:x.colores[l]},l)),e.jsxs("button",{onClick:()=>{const l=Fs();l?Be(l,"remove"):alert(x.noTilesToRemove||"No hay fichas para eliminar.")},className:"bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white text-xs px-2 py-1 rounded-full",children:["🎲 ",x.removeRandom||"Aleatoria"]})]})]})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 mt-4",children:[e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ha,{className:"text-purple-500 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:x.gestionPila})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 justify-center",children:[e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ha,{className:"text-purple-400 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:x.gestionPilas})]}),e.jsxs("button",{disabled:!["rojo","azul","verde","naranja","gris"].every(l=>Ke.some(w=>w.runa===l)),onClick:Ht,className:"mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50",children:["➕ ",x.addPila]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-2 justify-center",children:Ut.map(l=>e.jsx("div",{className:"bg-gray-800 p-2 rounded text-center text-white border border-yellow-500",children:l.estado==="reserva"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-2",children:[x.pila," 🗃️"]}),e.jsxs("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>Vt(l.id),children:["✅ ",x.activaPila||"Activar Pila"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-1",children:[e.jsxs("span",{children:[x.pila," 🗃️"]}),e.jsx("input",{type:"text",maxLength:5,value:tt[l.id]||"",onChange:w=>Tt(l.id,w.target.value),className:"bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center",placeholder:"ABC12",title:x.codigoPila})]}),e.jsxs("div",{className:"text-xs text-gray-300 mb-2",children:[x.tamano,": ",l.tiles.length]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{fe(l.id)},children:x.addRunaToPila}),e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{const w=je(l.id);w&&w.length>0?w.forEach(pe=>Be(pe,"retira")):alert(x.emptyPila)},children:x.devolver}),e.jsxs("button",{className:"bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs relative group",onClick:()=>{const w=gs(l.id);if(!w||w.length===0){alert(x.emptyPila);return}},children:[x.combateEstrecho_pila,e.jsx("span",{className:"absolute left-1/2 -bottom-6 -translate-x-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap",children:x.helperCombateEstrecho||"Los Token sobrantes irán al medidor de iniciativa"})]})]})]})},l.id))})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ha,{className:"text-purple-400 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:x.gestionPilas2})]}),e.jsxs("button",{onClick:ie,className:"mb-2 text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50",children:["➕ ",x.addNodo]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-2 justify-center",children:te.map(l=>e.jsx("div",{className:"bg-gray-800 p-2 rounded text-center text-white border border-yellow-500",children:l.estado==="reserva"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-2",children:[x.nodo||"Nodo"," 🗃️"]}),e.jsxs("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>we(l.id),children:["✅ ",x.activaNodo||"Activar Nodo"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-1",children:[e.jsxs("span",{children:[x.nodo||"Nodo"," 🗃️"]}),e.jsx("input",{type:"text",maxLength:5,value:tt[l.id]||"",onChange:w=>Tt(l.id,w.target.value),className:"bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center",placeholder:"ABC12",title:x.codigoPila})]}),e.jsxs("div",{className:"text-xs text-gray-300 mb-2",children:[x.tamano,": ",l.tiles.length]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{U(l.id)},children:x.addRunaToPila}),e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs","aria-expanded":wt===l.id,onClick:()=>Oe(w=>w===l.id?null:l.id),children:x.devolverNodo}),wt===l.id&&e.jsxs("div",{className:"mt-1 p-2 rounded bg-gray-900 border border-red-700 flex flex-wrap justify-center gap-1",children:[e.jsx("div",{className:"w-full text-[11px] text-gray-300 mb-1",children:x.eliminarPorColor||"Eliminar una runa:"}),["naranja","verde","azul","rojo","gris"].filter(w=>l.tiles.some(pe=>pe.runa===w)).map(w=>{var pe;return e.jsx("button",{className:`${qe[w]} text-white px-2 py-1 rounded text-xs`,onClick:()=>{const Le=Se(l.id,w);Le?Be(Le,"retira"):alert(x.emptyPila),Oe(null)},children:((pe=x.colores)==null?void 0:pe[w])||w},w)}),e.jsxs("button",{className:"bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white px-2 py-1 rounded text-xs",onClick:()=>{const w=Se(l.id);w?Be(w,"retira"):alert(x.emptyPila),Oe(null)},children:["🎲 ",x.removeRandom||"Aleatoria"]})]}),e.jsxs("button",{className:"bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs relative group",onClick:()=>{const w=Aa(l.id);if(!w||w.length===0){alert(x.emptyPila);return}},children:[x.combateEstrecho,e.jsx("span",{className:"absolute left-1/2 -bottom-6 -translate-x-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap",children:x.helperCombateEstrecho||"Los Token sobrantes irán al medidor de iniciativa"})]})]})]})},l.id))})]})]})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-cyan-500 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.controlAreas})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-cyan-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.barricadas})]}),e.jsxs("div",{className:"flex gap-2 flex-wrap justify-center",children:[e.jsxs("button",{onClick:()=>Ws(),className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded",children:["➕ ",x.addControlAreas]}),e.jsxs("button",{onClick:()=>vs([]),className:"bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded",children:["✕ ",x.removeCA]})]})]}),e.jsxs("div",{className:"bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-cyan-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.spawnPoints})]}),e.jsxs("div",{className:"flex gap-2 flex-wrap justify-center",children:[e.jsxs("button",{onClick:()=>bs("runa"),className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded",children:["➕ ",x.addSpawnPoints," ",x.runes]}),e.jsxs("button",{onClick:()=>bs("evento"),className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded",children:["➕ ",x.addSpawnPoints," ",x.PAevento]}),e.jsxs("button",{onClick:()=>Gs([]),className:"bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded",children:["✕ ",x.removeSP]})]})]}),e.jsxs("div",{className:"bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-cyan-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.runeKey})]}),e.jsxs("div",{className:"flex gap-2 flex-wrap justify-center",children:[e.jsxs("button",{onClick:()=>st(),className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded",children:["➕ ",x.addRuneKeys]}),e.jsxs("button",{onClick:()=>ka([]),className:"bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded",children:["✕ ",x.removeRK]})]})]}),e.jsxs("div",{className:"bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(ut,{className:"text-cyan-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.rescue})]}),e.jsxs("div",{className:"flex gap-2 flex-wrap justify-center",children:[e.jsxs("button",{onClick:()=>ws(),className:"bg-purple-700 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded",children:["➕ ",x.addRescue]}),e.jsxs("button",{onClick:()=>Js([]),className:"bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded",children:["✕ ",x.removeRV]})]})]}),e.jsx("div",{className:"bg-gray-700 rounded-lg p-3 shadow-md col-span-1 md:col-span-2",children:e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center flex-wrap",children:[Xs.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-700 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:x.activeBarricade}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:Xs.map(l=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${qe[l.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:x.colores[l.runa]}),e.jsx("button",{onClick:()=>Ks(l.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},l.uuid))})]}),hs.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-700 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:x.activeSpawnPoints}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:hs.map(l=>{if(l.runa==="evento"){const w=wo.find(pe=>pe.id==="evento");return e.jsxs("div",{className:"px-3 py-1 rounded bg-gray-800 text-white flex items-center gap-2",children:[(w==null?void 0:w.imagen)&&e.jsx("img",{src:w.imagen,alt:"Evento",className:"w-6 h-6 object-contain"}),e.jsx("span",{children:x.evento||"Evento"}),e.jsx("button",{onClick:()=>ys(l.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},l.uuid)}return e.jsxs("div",{className:`px-3 py-1 rounded text-white ${qe[l.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:x.colores[l.runa]}),e.jsx("button",{onClick:()=>ys(l.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},l.uuid)})})]}),Qs.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-700 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:x.activeRuneKeys}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:Qs.map(l=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${qe[l.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:x.colores[l.runa]}),e.jsx("button",{onClick:()=>Ys(l.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},l.uuid))})]}),js.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-700 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:x.activeRescue}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:js.map(l=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${qe[l.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:x.colores[l.runa]}),e.jsx("button",{onClick:()=>Zs(l.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},l.uuid))})]})]})})]})]})]}),e.jsxs("div",{className:"flex justify-center gap-4 mt-2",children:[e.jsx("button",{onClick:()=>{_s(),St(),S(),K(),d(),ee()},className:"px-4 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-full text-sm",children:x.resetRunes}),e.jsx("button",{onClick:ot,className:"px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm",children:x.close})]})]})})}),e.jsx(Ds,{children:Et==="scenario"&&e.jsx(os.div,{ref:oa,initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.25},className:"px-4 pb-4 pt-2 flex flex-col gap-4 text-white",children:e.jsxs("div",{className:"flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500",children:[e.jsxs("div",{className:"bg-gray-800 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(vn,{className:"text-red-400 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.monstruoEscenario})]}),e.jsx("div",{className:"flex flex-wrap gap-2 justify-start",children:ra.map(l=>{var pe;const w=(De==null?void 0:De.id)===l.id;return e.jsxs("div",{onClick:()=>Ft(Le=>(Le==null?void 0:Le.id)===l.id?null:l),className:`relative w-24 h-24 rounded border-2 cursor-pointer transition-transform transform hover:scale-105
                          ${w?"border-green-500 ring-2 ring-green-300":"border-gray-600"}
                        `,children:[e.jsx("img",{src:l.imagen,alt:l.id,className:"object-cover w-full h-full rounded"}),e.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white text-center px-1 py-0.5",children:((pe=J.enemies.escenario)==null?void 0:pe[l.id])||l.id})]},l.id)})}),De&&e.jsxs("div",{className:"mt-2 text-xs text-gray-300",children:["✅ ",x.monstruoSeleccionado,": ",e.jsx("strong",{children:((Cs=J.enemies.escenario)==null?void 0:Cs[De.id])||De.id})]})]}),e.jsxs("div",{className:"bg-gray-800 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(Ga,{className:"text-yellow-300 text-xl"}),e.jsx("span",{className:"font-semibold",children:x.escenario||"Cartas de Escenario"})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 mt-4",children:[e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex text-orange font-semibold p-2 mb-2",children:[e.jsx(jn,{className:"text-blue text-xl"}),e.jsxs("span",{className:"font-semibold",children:[" ",x.incru1]})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs("button",{disabled:!De,onClick:()=>{const l=Ta.find(w=>w.cara==="A");l&&Ce(l)},className:`bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded 
                          ${De?"":"opacity-50 cursor-not-allowed"}
                        `,children:[x.addScenario," (",x.caraA,")"]}),e.jsx("button",{disabled:!De,onClick:()=>Ee(l=>({...l,incursion:!l.incursion})),className:`bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded 
                          ${De?"":"opacity-50 cursor-not-allowed"}
                        `,children:x.addScenarioCara})]}),us.incursion&&e.jsx("div",{className:"flex gap-2 flex-wrap mt-2",children:Ta.map((l,w)=>e.jsxs("button",{onClick:()=>Ce(l),className:"bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded",children:[x.cara," (",l.cara,")"]},`${l.id}-${l.cara}-${w}`))})]}),e.jsxs("div",{className:"flex-1 bg-gray-700 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex text-white font-semibold p-2 mb-2",children:[e.jsx(wn,{className:"text-blue text-xl"}),e.jsxs("span",{className:"font-semibold",children:[" ",x.defen1]})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs("button",{onClick:()=>{const l=Ea.find(w=>w.cara==="A");l&&Ce(l,!0)},className:"bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1 rounded",children:[x.addScenario," (",x.caraT,")"]}),e.jsx("button",{onClick:()=>Ee(l=>({...l,defensa:!l.defensa})),className:"bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded",children:x.addScenarioCara})]}),us.defensa&&e.jsx("div",{className:"flex gap-2 flex-wrap mt-2",children:Ea.map((l,w)=>e.jsxs("button",{onClick:()=>Ce(l),className:"bg-indigo-800 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded",children:[x.cara," (",l.cara,")"]},`${l.id}-${l.cara}-${w}`))})]})]})]}),e.jsx("div",{className:"flex justify-center gap-4 mt-2",children:e.jsx("button",{onClick:ot,className:"px-4 py-1 bg-red-500 hover:bg-red-600 rounded-full text-sm",children:x.close||"Cerrar"})})]})})})]}),e.jsx("div",{className:"fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2 pointer-events-none",children:gt.map(l=>e.jsx(No,{tile:l,tipo:l.tipo},l.uuid))})]})};function Dr({enemyData:a,t:c}){var ce,de,K,D,Y;const b={blanco:"bg-white text-black",gris:"bg-gray-600 text-white",negro:"bg-black text-white",jefe:"bg-red-500 text-white",blue:"bg-blue-700 text-white",green:"bg-green-700 text-white",comandante:"bg-yellow-600 text-black",purple:"bg-purple-500 text-white",escenario:"bg-cyan-600 text-white",esbirro:"bg-cyan-300 text-white"},j={blanco:"text-black",gris:"text-gray-300",negro:"text-white",jefe:"text-red-400",blue:"text-blue-400",green:"text-green-400",comandante:"text-yellow-400",purple:"text-purple-400",escenario:"text-cyan-600",esbirro:"text-cyan-300"},N=b[a.color]||"bg-black text-white",I=j[a.color]||"text-white",C=a.color==="escenario"?((de=(ce=c==null?void 0:c.enemies)==null?void 0:ce.escenario)==null?void 0:de[a.id])||a.id:((K=c==null?void 0:c.enemies)==null?void 0:K[a.id])||a.id,V=a.vida,z=(D=c==null?void 0:c.enemies)==null?void 0:D.categoria[a.categoria],G=(Y=c==null?void 0:c.trackerSelect)==null?void 0:Y.comportamientos[a.comportamiento],Q=a.imagen,J=a.movimiento,x=a.ataque;return e.jsxs(os.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.3},className:`inline-flex flex-col sm:flex-row items-center sm:items-start gap-2 rounded-xl shadow-2xl font-semibold px-2 py-2 text-base ${N}`,children:[e.jsx("img",{src:Q,alt:C,className:"w-24 h-24 sm:w-36 sm:h-36 object-cover rounded-md border border-white shadow-md"}),e.jsxs("div",{className:"flex flex-col items-center justify-center gap-2 text-center sm:text-left",children:[e.jsx(ya,{className:`text-2xl sm:text-3xl ${I}`}),e.jsx("div",{className:"flex items-center justify-center sm:justify-start gap-2",children:e.jsx("span",{className:"font-bold text-lg font-fantasy",children:C})}),e.jsx("div",{className:"text-center text-sm",children:z}),e.jsxs("div",{className:"fst-italic text-center text-xs",children:["— ",G," —"]}),e.jsxs("div",{className:"flex items-center text-center sm:justify-start gap-4 text-sm mt-2",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Nn,{})," ",V]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(_n,{})," ",J]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(Cn,{})," ",x]})]})]})]})}const Lr=({onConfirm:a})=>{const[c,b]=T.useState(""),{language:j,translations:N}=jt(),I=N.trackerInit||{},C=N.trackerSelect||{},V=()=>{const z=parseInt(c,10);isNaN(z)||z<=0?a(1):a(z)};return e.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-yellow-400 text-white p-4 rounded-xl shadow-lg",children:[e.jsx("h2",{className:"text-lg font-bold mb-2",children:I.PC}),e.jsx("input",{type:"number",min:"1",value:c,onChange:z=>b(z.target.value),className:"text-black p-1 w-full rounded"}),e.jsx("div",{className:"flex justify-end gap-2 mt-3",children:e.jsx("button",{className:"bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded",onClick:V,children:C.confirm})})]})})};function Ja(a){return We({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"},child:[]},{tag:"line",attr:{x1:"12",y1:"16",x2:"12",y2:"12"},child:[]},{tag:"line",attr:{x1:"12",y1:"8",x2:"12.01",y2:"8"},child:[]}]})(a)}const zr=["ESCUDO X","SANAR X","FATIGA X","INTIMIDAR X","EMPUJON X","REGENERACION X","HEMORRAGIA X","QUEMADURA X","ABSORBER SALUD X"],Ye=(a,c,b)=>Array.isArray(a)?a.map(j=>{if(zr.includes(j)){const N=b(c);return j.replace("X",`${N}`)}return j}):(console.warn("⚠️ capacidades no es un array:",a),[]),Ur=({uuid:a,enemy:c,onClose:b,onDelete:j,onVidaChange:N,overhealedEnemies:I,setOverhealedEnemies:C,onEstadoChange:V,getEffectiveStats:z})=>{var Ht,Vt,je;const[G,Q]=T.useState((c==null?void 0:c.vida)||0),[J,x]=T.useState((c==null?void 0:c.vidaMax)||0),[ce,de]=T.useState((c==null?void 0:c.estadosAlterados)||[]),{language:K,translations:D}=jt();I==null||I.has(a);const[Y,S]=T.useState([]),E=D.trackerInit||{};D.roles,D.enemies;const X=((Ht=D.enemies)==null?void 0:Ht.categoria)||{},me=((Vt=D.trackerSelect)==null?void 0:Vt.comportamientos)||{},q=D.condiciones_t||{},se=D.condiciones_d||{},re=D.estadosAlterados||{},d=D.cartas_ataque||{},_e=D.defensaCard.cartas_trad||{},{getRuneCount:ve}=rs();if(T.useEffect(()=>{c&&(Q(c.vida),x(c.vidaMax),de(c.estadosAlterados||[]))},[c]),!c)return;const{id:ee,name:Te,rune:xe,imagen:Me,vida:Je,vidaMax:Ge,movimiento:Ae,ataque:ft,color:Ue,comportamiento:It,categoria:ke,inmunidad:cs,tipo_ataque:Pe,capacidades:ds,capacidadesOriginales:Ie,estadosAlterados:us}=c,Ee=[e.jsx(Er,{},"1"),e.jsx(Tr,{},"2"),e.jsx($r,{},"3"),e.jsx(Ir,{},"4"),e.jsx(kr,{},"5"),e.jsx(Ar,{},"6")],wt=Ye(Ie,xe,ve),Oe=z(a),$e=Array.from(new Set([...cs||[],...Oe.inmunidades||[]])),$t=B=>{S(U=>[...U,B]),setTimeout(()=>{S(U=>U.slice(1))},2e3)},zt=(B,U,fe)=>{var ie;const te=fe(U);let oe=(ie=d.capacidad)==null?void 0:ie[B];return oe?(oe=oe.replaceAll("{X}",te).replaceAll("{2*X}",te*2).replaceAll("{3*X}",te*3).replaceAll("{4*X}",te*4).replaceAll("{X+1}",te+1).replaceAll("{X+2}",te+2),oe.replace(/\{([^}]+)\}/g,(we,be)=>_e[be]||be)):""},ms=(B,U,fe,te,oe)=>{const ie=fe(U);if(B==="X")return ie;if(typeof B=="string"&&B.startsWith("X+")){const we=parseInt(B.slice(2),10);if(te==="esbirro"){if(oe==="M"){if(ie<=1)return 3;if(ie>=2)return 4}else if(oe==="A")return Math.min(ie,3)}else return we+ie}return B},pt=ms(Ae,xe,ve,ke,"M"),Ke=ms(ft,xe,ve,ke,"A"),Ze={blanco:"border-blanco",gris:"border-gris",negro:"border-negro",comandante:"border-dorado",hero:"border-dorado",jefe:"",overlord:"border-morado",esbirro:"border-cyan",escenario:"border-blue"},Be={esbirro:"bg-cyan-300",blanco:"bg-white",gris:"bg-gray-500",negro:"bg-black",comandante:"bg-yellow-400",hero:"bg-orange-400",jefe:"bg-purple-500",overlord:"bg-purple-800",escenario:"bg-cyan-600"},Rt={blanco:"bg-white/70",gris:"bg-gray-500/70",negro:"bg-black/70",comandante:"bg-yellow-400/70",hero:"bg-orange-400/70",jefe:"bg-purple-500/70",overlord:"bg-purple-700/70"},gt={bisoño:"glow-bisono",soldado:"glow-soldado",veterano:"glow-veterano",campeon:"glow-campeon",comandante:"glow-commander",esbirro:"glow-escenario",escenario:"glow-escenario",overlord:"glow-commander",jefe:"glow-commander"},et=B=>{let U=G+B;if(B<0){const fe=c.estadosAlterados.find(oe=>oe.id==="ESCUDO");let te=0;if(fe&&fe.count>0){let oe=Math.abs(B),ie=fe.count;for(;oe>0&&ie>0;)ie--,oe--,te++;const we=c.estadosAlterados.map(be=>be.id==="ESCUDO"?{...be,count:ie}:be);te>0&&$t(`${E.consume} ${te} ${E.escudos}`),V&&V(c.uuid,we),U=G-oe}}if(U<0&&(U=0),U>c.vidaMax&&!I.has(a)){if(!window.confirm(`${U} ${E==null?void 0:E.vidaExcedida}`))return;C(te=>new Set(te).add(a)),N&&N(c.uuid,U,U)}else Q(U),N&&N(c.uuid,U)},Nt={cuerpo:e.jsx(An,{className:"text-white text-2xl cursor-help",title:E.tipo_ataque.cuerpo||""}),distancia:e.jsx(En,{className:"text-white text-2xl cursor-help",title:E.tipo_ataque.distancia||""}),magia:e.jsx(Tn,{className:"text-white text-2xl cursor-help",title:E.tipo_ataque.magia||""})},xs={distancia:"bg-red-600",cuerpo:"bg-orange-500",magia:"bg-blue-600"},fs=(B,U,fe)=>{var oe,ie;const te=B.match(/^([A-Z_ ]+?)\s+(\d+)$/);if(te){const we=te[1].trim().replace(/\s+/g,"_"),be=te[2],Se=`${we}_X`,tt=((oe=U[Se])==null?void 0:oe.replace("{x}",be))||B,Ct=((ie=fe[Se])==null?void 0:ie.replace("{x}",be))||"";return{claveGeneral:Se,texto:tt,detalle:Ct}}return{claveGeneral:B,texto:U[B]||B,detalle:fe[B]||""}},_t=["ESCUDO_X","REGENERACION_X","MANDO","EVOLUCION","SANAR_X","VORAGINE","HASTA 2 MOSTRUOS MAS DEBILES"],qs=["SANGUINARIO","IMPLACABLE","DESAFIO","SALTO","VENGATIVO","CODICIA","BRUTAL"],Hs=(B,U,fe,te)=>{if(!Array.isArray(B)||B.length===0)return null;const oe=[];let ie=[];return B.forEach(we=>{we===";"?ie.length>0&&(oe.push(ie),ie=[]):[":",",","Y"].includes(we)||ie.push(we)}),ie.length>0&&oe.push(ie),e.jsxs("div",{className:"flex items-start gap-2 mt-1",children:[e.jsx(Rn,{className:"text-green-700 mt-1 text-2xl cursor-help",title:te.capacidades||""}),e.jsx("div",{className:"flex flex-col gap-1",children:oe.map((we,be)=>e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-xl text-gray-600",children:Ee[be]||`${be+1}.`}),e.jsx("div",{className:"flex flex-wrap gap-2",children:we.map((Se,tt)=>{const{claveGeneral:Ct,texto:Tt,detalle:St}=fs(Se,U,fe),Mt=_t.includes(Ct)?"text-pink-500 font-semibold":qs.includes(Ct)?"text-blue-500 font-semibold":"";return e.jsxs("span",{className:`inline-flex items-center gap-1 mr-2 ${Mt}`,children:[Tt,St&&e.jsx(Ja,{title:St,className:"text-gray-500 hover:text-gray-800 cursor-help"})]},Se+tt)})})]},`accion-${be}`))})]})},Ut=()=>{var B,U,fe;return Ue==="escenario"?(U=(B=D.enemies)==null?void 0:B.escenario)==null?void 0:U[ee]:(fe=D.enemies)==null?void 0:fe[ee]},qt=(B,U)=>{const fe=ce.map(te=>{if(te.id===B){const oe=Ne.find(Se=>Se.id===te.id),ie=te.max||(oe==null?void 0:oe.max)||1,be=(te.count||0)+U;return U>0&&be>ie?window.confirm(`${re[te.texto]} ${E==null?void 0:E.estadoExcedido_1} (${ie}). ${E==null?void 0:E.estadoExcedido_2}`)?{...te,count:be,max:be}:te:{...te,count:Math.max(0,be)}}return te});de(fe),V&&V(c.uuid,fe)};return e.jsxs("div",{className:"fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4",children:[e.jsxs("div",{className:`${Be[Ue]||""} rounded-lg shadow-lg w-full max-w-xl relative border-4 ${Ze[Ue]||""}`,children:[e.jsx("button",{onClick:b,className:"absolute top-2 right-2 text-white hover:text-black bg-red-600 hover:bg-red-700 text-xl rounded-full font-bold","aria-label":"Cerrar modal",children:"X"}),j&&e.jsxs("button",{onClick:()=>{j(a),b()},className:"absolute top-2 left-2 text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-1 text-xs",children:["🗑 ",E.remove]}),e.jsxs("div",{className:"flex flex-col gap-1 items-center p-6",children:[e.jsx("h2",{className:`text-2xl font-bold text-center text-white px-1 py-0 rounded ${Rt[Ue]||""} ${gt[ke]||""}`,children:Ut()}),e.jsxs("div",{className:"flex gap-1 text-sm",children:[ke&&ke!="jefe"&&e.jsxs("span",{className:`${Rt[Ue]||""} ${gt[ke]||""}`,children:[X[ke]||ke,":"]}),It&&ke!="jefe"&&e.jsx("span",{className:`italic ${Rt[Ue]||""} ${gt[ke]||""}`,children:me[It]||It})]}),e.jsxs("div",{className:"flex w-full items-center gap-1 mt-2",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:Me,alt:Te,className:`w-32 h-32 object-cover rounded border-2 ${Ze[Ue]||""}`}),e.jsx("div",{className:"absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1",children:ce.filter(B=>B.count>0).map(B=>{const U=Ne.find(fe=>fe.id===B.id);return U?e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:U.imagen,alt:U.texto,className:"w-6 h-6 border border-white rounded-full shadow-md"}),B.count>1&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full",children:B.count})]},B.id):null})})]}),e.jsxs("div",{className:"flex-1 grid grid-cols-1 gap-1 text-gray-800 font-semibold text-sm bg-gray-200 rounded-lg",children:[ke!=="jefe"&&e.jsxs("div",{className:"flex items-center text-center gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(kn,{className:"text-red-600 text-2xl cursor-help",title:E.health||""}),J]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(In,{className:"text-blue-600 text-2xl cursor-help",title:typeof Ae=="string"&&Ae.includes("X")?`${E.runeBasedValue}: ${pt}`:E.movement}),pt]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx("span",{className:`w-7 h-7 flex items-center justify-center rounded-full border-2 border-white ${xs[Pe]||"bg-gray-500"}`,title:typeof ft=="string"&&ft.includes("X")?`${E.runeBasedValue}: ${Ke}`:(je=E.tipo_ataque)==null?void 0:je.label,children:Nt[Pe]||e.jsx(ao,{className:"text-white text-lg"})}),Ke,Oe.ataqueModificado!==Ke&&Oe.categoria!=="esbirro"&&e.jsxs("span",{children:["/",e.jsx("span",{className:"text-blue-500 font-bold cursor-help",title:zt(Oe.idCartaEspecial,xe,ve),children:Oe.ataqueModificado})]})]})]}),e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx($n,{className:"text-purple-700 mt-1 text-2xl cursor-help",title:E.inmunidad||""}),e.jsx("div",{className:"flex flex-wrap gap-2",children:Array.isArray($e)&&$e.length>0?$e.map((B,U)=>e.jsxs("span",{className:"inline-flex items-center gap-1 mr-2",children:[q[B]||B,e.jsx(Ja,{title:se[B]||"",className:"text-gray-500 hover:text-gray-800 cursor-help"})]},B)):q.none})]}),Hs(wt,q,se,E)]})]}),e.jsx("div",{className:"w-full bg-gray-800 rounded-lg p-2 mt-2 flex flex-row flex-nowrap gap-2 justify-around items-center",children:ce.filter(B=>!($e!=null&&$e.includes(B.id))&&!($e!=null&&$e.includes("GRANDE")&&["DERRIBO_I","ATURDIMIENTO_I"].includes(B.id))).filter(B=>{const U=Ne.find(fe=>fe.id===B.id);return U&&U.mostrar==="si"}).map(B=>{const U=Ne.find(be=>be.id===B.id);if(!U)return null;const[fe,te]=ue.useState(!1),oe=B.max||U.max||1,ie=ce.length;let we="w-8 h-8";return ie>6&&ie<=10&&(we="w-6 h-6"),ie>10&&(we="w-5 h-5"),e.jsxs("div",{className:"flex flex-col items-center w-14",children:[e.jsx("button",{onClick:()=>qt(B.id,1),disabled:oe===1&&(B.count||0)>=oe,className:"bg-green-600 text-white rounded px-1 mb-1 text-xs hover:bg-green-700 disabled:opacity-50",children:"+"}),e.jsxs("div",{className:"relative cursor-help flex items-center justify-center",onMouseEnter:()=>te(!0),onMouseLeave:()=>te(!1),children:[e.jsx("img",{src:U.imagen,alt:U.texto,className:`${we} flex-shrink`}),fe&&e.jsx("div",{className:`absolute right-full top-1/2 -translate-y-1/2 mr-2 \r
                                        bg-black text-white text-[0.65rem] rounded px-2 py-1 \r
                                        whitespace-nowrap z-20`,children:e.jsx("strong",{children:re[U.texto]})})]}),oe>1&&e.jsx("div",{className:"text-white text-sm font-bold",children:B.count||0}),e.jsx("button",{onClick:()=>qt(B.id,-1),disabled:(B.count||0)<=0,className:"bg-red-600 text-white rounded px-1 mt-1 text-xs hover:bg-red-700 disabled:opacity-50",children:"−"})]},B.id)})}),e.jsxs("div",{className:"flex items-center w-full h-5 mt-2 gap-2",children:[e.jsx("button",{onClick:()=>et(-1),className:"w-5 h-5 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700",children:"−"}),e.jsxs("div",{className:"flex-1 relative h-full",children:[e.jsxs("div",{className:"absolute inset-0 flex items-center justify-center text-white text-[0.65rem] font-bold z-10",children:[G," / ",Ge]}),e.jsx("div",{className:"w-full h-full bg-red-900 rounded",children:e.jsx("div",{className:"h-full bg-red-500 rounded",style:{width:`${G/Ge*100}%`}})})]}),e.jsx("button",{onClick:()=>et(1),className:"w-5 h-5 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700",children:"+"})]})]})]}),e.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 z-50",children:Y.map((B,U)=>e.jsx("div",{className:"bg-black/90 text-white text-sm px-4 py-2 rounded shadow-lg animate-fade-in",children:B},U))})]})},qr=()=>{const{tileWarning:a,setTileWarning:c}=rs(),{translations:b}=jt(),j=b.trackerInit||{},N=T.useRef(null);return T.useEffect(()=>{var C;if(!a)return;(C=N.current)==null||C.focus();const I=V=>{V.key==="Escape"&&c(null)};return document.addEventListener("keydown",I),()=>document.removeEventListener("keydown",I)},[a,c]),a?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",role:"presentation",children:e.jsxs("div",{className:"w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl",role:"dialog","aria-modal":"true","aria-labelledby":"tile-warning-title",children:[e.jsx("h2",{id:"tile-warning-title",className:"mb-2 text-lg font-bold text-gray-800",children:j.aviso1||"Aviso"}),e.jsx("p",{className:"mb-4 text-sm text-gray-800",children:a}),e.jsx("button",{ref:N,type:"button",className:"min-h-11 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300",onClick:()=>c(null),children:j.close||"Cerrar"})]})}):null},Hr=({carta:a,onClose:c})=>{var x,ce;const{translations:b}=jt(),{getRuneCount:j}=rs(),{trackerData:N}=so(),I=b.cartas_ataque||{},C=b.defensaCard.cartas_trad||{},V=N.heroes,z=Math.min(V.length,4),G=j(a.rune),Q=((x=I.nombre)==null?void 0:x[a.id])||a.nombre;let J=((ce=I.capacidad)==null?void 0:ce[a.id])||a.capacidad;if(J){J=J.replaceAll("{X_H}",z).replaceAll("{X+2}",G+2).replaceAll("{X}",G).replaceAll("{2*X}",G*2).replaceAll("{3*X}",G*3).replaceAll("{4*X}",G*4);const de=/\{([^}]+)\}/g,K=[];let D=0,Y;for(;(Y=de.exec(J))!==null;){const[E,X]=Y,me=Y.index;if(!X.includes("X")){me>D&&K.push(J.substring(D,me));const q=C[X]||X;K.push(e.jsxs("span",{className:"text-blue-400 font-bold",children:[" ",q," "]},me)),D=me+E.length}}D<J.length&&K.push(J.substring(D));const S=[];K.forEach((E,X)=>{typeof E=="string"?E.split(/(\.)/).forEach((q,se)=>{q==="."?(S.push(q),S.push(e.jsx("br",{},`br-${X}-${se}`))):q.trim()!==""&&S.push(q)}):S.push(E)}),J=S}return On.createPortal(e.jsx("div",{className:"fixed inset-0 bg-black/70 flex justify-center items-center z-50",children:e.jsxs("div",{className:"bg-orange-900 text-white p-6 rounded-lg max-w-sm border-2 border-yellow-400 shadow-xl relative",children:[e.jsx("button",{onClick:c,className:"absolute top-1 right-2 text-sm bg-red-500 hover:bg-red-600 px-2 rounded",children:"✕"}),e.jsx("div",{className:"text-lg text-yellow-300 text-center mb-2",style:{fontFamily:"Impact, Charcoal, sans-serif"},children:Q}),e.jsx("div",{className:"text-sm whitespace-pre-line text-center leading-tight",children:J})]})}),document.body)},Vr=({carta:a})=>{var ce;const{translations:c}=jt(),[b,j]=T.useState(!1),[N,I]=T.useState((a==null?void 0:a.estadosAlterados)||[]),C=c.cartas_ataque||{},V=c.estadosAlterados||{},z=((ce=C.nombre)==null?void 0:ce[a.id])||a.nombre,G=a.nombreEnemy,Q=a.categoria==="overlord"?"ring-4 ring-orange-400 animate-pulse":a.categoria==="comandante"||a.categoria==="hero"?"ring-4 ring-yellow-400 animate-pulse":a.categoria==="jefe"?"ring-4 ring-purple-400 animate-pulse":"",J=a.categoria==="overlord"?"border-orange-400":a.categoria==="comandante"||a.categoria==="hero"?"border-yellow-400":a.categoria==="jefe"?"border-purple-400":"border-gray-500",x=a.categoria==="overlord"?C.ataqueO:a.categoria==="comandante"?C.ataqueC:a.categoria==="hero"?C.ataqueF:a.categoria==="jefe"?C.ataqueB:"";return T.useEffect(()=>{I(a!=null&&a.estadosAlterados?[...a.estadosAlterados]:[])},[a==null?void 0:a.estadosAlterados]),e.jsxs("div",{className:"flex flex-col items-center mx-1",children:[e.jsx("div",{className:"relative w-full max-w-[140px]",children:e.jsxs("div",{onClick:()=>j(!0),className:`cursor-custom relative w-full aspect-square p-2 rounded-lg border-2 shadow-md hover:scale-105 transition
            ${a.highlight?Q:J}`,children:[e.jsx("div",{className:"fire-bg-inner"}),e.jsx("div",{className:"fire-sparks",children:Array.from({length:20}).map((de,K)=>e.jsx("span",{},K))}),e.jsxs("div",{className:"absolute inset-0 flex flex-col items-center justify-between z-10 p-2",children:[e.jsx("div",{className:"absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1",children:N.filter(de=>de.count>0).map(de=>{const K=Ne.find(D=>D.id===de.id);return K?e.jsxs("div",{className:"relative group cursor-help",children:[e.jsx("img",{src:K.imagen,alt:K.texto,className:"w-6 h-6 border border-white rounded-full shadow-md"}),de.count>1&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full",children:de.count}),e.jsx("div",{className:"absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap",children:V[K.texto]||K.texto})]},de.id):null})}),e.jsx("div",{className:"text-sm text-yellow-300 text-center",style:{fontFamily:"Impact, Charcoal, sans-serif"},children:z}),e.jsxs("div",{className:"text-[0.50rem] italic text-white-300 text-center",style:{fontFamily:"Impact, Charcoal, sans-serif"},children:[e.jsxs("div",{children:["-",x,"-"]}),e.jsx("div",{children:G})]})]})]})}),b&&e.jsx(Hr,{carta:a,onClose:()=>j(!1)})]})},Fr={defensor:0,apoyo:2,lider:4,agresor:6,controlador:8},ze={naranja:1,verde:3,azul:5,rojo:7,gris:9},Gr=["campeon","veterano","soldado","bisoño"],Xr=["movimiento","ataque","capacidades","inmunidad","tipo_ataque"],Wr=["undead_king_boss_Acecho_1","undead_king_boss_Acecho_2","corrupted_worm_esbirro"],Za=["dark_vampire_scenario_com"],Jr=()=>{var za,Ua,qa;const{trackerData:a,setTrackerData:c}=so(),{placedEnemies:b,setPlacedEnemies:j,placeEnemy:N,removeEnemyAt:I,removeEnemyByUUID:C,resetPlacedEnemies:V,assignColorToEnemy:z,releaseColor:G,usedColors:Q,setUsedColors:J,usedColorsBig:x,setUsedColorsBig:ce,enemyColorMap:de,setEnemyColorMap:K,avisos:D,removeAviso:Y,huespedActivo:S,acechoActivo:E,invadidosActivo:X}=eo(),{language:me,translations:q}=jt(),{selectedExpansions:se}=to(),re=en(),d=q.trackerInit||{},_e=q.roles||{},ve=((za=q.enemies)==null?void 0:za.categoria)||{},ee=q.enemies||{},Te=((Ua=q.trackerSelect)==null?void 0:Ua.comportamientos)||{},xe=q.cartas_ataque||{},Me=q.scenarioCard||{},Je=q.defensaCard||{},Ge=q.estadosAlterados||{},Ae=q.defensaCard.cartas_trad||{},ft=q.asalto_gusano||{},Ue=q.acecho||{},It=q.ira||{},ke=q.condiciones_t||{},cs=q.condiciones_d||{},Pe=tn("trackerSession",{},sn),ds=a.behaviors,Ie=a.enemies,Ee=a.heroes.length,[wt,Oe]=T.useState({open:!1,color:null}),[$e,$t]=T.useState({open:!1,color:null}),[zt,ms]=T.useState(""),[pt,Ke]=T.useState(null),[Ze,Be]=T.useState(null),Rt=["comandante","jefe","overlord","hero","esbirro","escenario"],{availableTiles:gt,usedTiles:et,manifestTile:Nt,tileToasts:xs,setTileToasts:fs,showTileToast:_t,drawTilePreviewByColor:qs,drawTileByColor:Hs,discardTileByColor:Ut,runes:qt,addRune:Ht,removeRune:Vt,getRuneCount:je,clearRunes:B,drawMultipleTiles:U,tileWarning:fe,setTileWarning:te,scenarioMonster:oe,spawnPoints:ie,removeSpawnPoint:we,controlPoints:be,removeControlPoint:Se,runeKeys:tt,removeRuneKey:Ct,rescue:Tt,removeRescue:St,pilas:Mt,pilasConcentrada:ps,activarPilaConcentrada:Vs,activarPila:Fs,codigosPilas:De,setCodigosPilas:Aa,handleCodigoChange:gs,addTileToPila:Ft,addTileToPilaConcentrada:Gs,initializeDecks:hs,drawCardFromDeck:bs,removeTileFromPila:ys,removeTileFromPilaConcentrada:Xs,removeSingleTileFromPilaConcentrada:vs,placeTilesFromPilaConcentradaToTrack:Ws,placeTilesFromPilaToTrack:Ks}=rs(),[ka,Qs]=T.useState(()=>Pe.selectedRuneCards||[]),{placedRunes:st,placeRune:Ys,removeRuneByUUID:Js,resetPlacedRunes:js,setPlacedRunes:ws}=Bs(),{executedRunes:Zs,setExecutedRunes:Ns}=Bs(),[ea,at]=T.useState(null),[ta,sa]=T.useState(()=>new Set(Pe.overhealedEnemies||[])),[_s,Et]=T.useState([]),[Gt,ht]=T.useState([]),[aa,Xt]=T.useState([]),[oa,Wt]=T.useState(!1),[qe,ot]=T.useState(null),[Kt,na]=T.useState(()=>Pe.enemyEvolutions||[]),ra=s=>{var n;return((n=q.heroes)==null?void 0:n[s])||s},Ce=(s,n=null)=>{var r,i,u;return n==="escenario"?((i=(r=q.enemies)==null?void 0:r.escenario)==null?void 0:i[s])||s:((u=q.enemies)==null?void 0:u[s])||s},Cs=s=>{var r;const n=Xa.find(i=>i.id===s);return((r=q.heroes.profession)==null?void 0:r[n.profession])||n.profession},l=s=>Oe({open:!0,color:s}),w=s=>$t({open:!0,color:s}),pe=s=>nt(s,"jefe","jefe"),Le=s=>{var n;return(n=Object.entries(ze).find(([r,i])=>i===s))==null?void 0:n[0]},Xe=s=>{s&&_t(s,"add")},_o=s=>{const n=(s==null?void 0:s.uuid)??s;fs(r=>r.filter(i=>i.uuid!==n))},ia=s=>{const n=s.split(/(\{.*?\})/g);let r=null;const i=n.map((u,f)=>{var o;const p=u.match(/^\{(.*?)\}$/);if(p){const m=p[1],y=((o=Je.cartas_trad)==null?void 0:o[m])||m;return m==="MANIFIESTA"&&(r=Nt()),e.jsx("span",{className:"text-blue-400 font-semibold",children:y},`brace-${f}`)}return e.jsx("span",{children:u},`text-${f}`)});if(r!=null&&r.runa){const u=d.runaManifestada||"Runa manifestada",f=d.colores[r.runa];i.push(e.jsxs("span",{className:"block text-blue-400 mt-2",children:[u," ",f]},"manifested-color"))}return i},Pt=(s,n,r)=>{const i=new Set(s?r:n),f=(s?Fa:Va).find(p=>!i.has(p.id));return f?f.id:null},Co=(s,n)=>{var P,$,_,A,R,F;const r=Qe(),i=Je[`cartas_${n}`],u=((P=i.nombre)==null?void 0:P[s.id])||s.id,f=(($=i.accion)==null?void 0:$[s.id])||"",p=((_=i.accion2)==null?void 0:_[s.id])||"";let o=`
`,m=[...Q],y=[...x],h=!1;if(n==="errantes")for(let O=1;O<=Ee;O++){const H=(A=i.texto)==null?void 0:A[`${s.id}${O}`];H&&(o+=`${H}
`);const L=(R=i.texto2)==null?void 0:R[`${s.id}${O}`];if(L){const[W,M,ne]=L;for(let le=0;le<W;le++){const he=Fe.filter(vt=>Ie.includes(vt.id)&&vt.color===M&&vt.categoria===ne&&vt.cara!=="B");if(he.length===0){console.warn(`${d.noEnemyAvailableTo} ${M} - ${ne}`);continue}const ye=he[Math.floor(Math.random()*he.length)],lt=ye.size==="grande";let Ve=Pt(lt,m,y),ct="estandar";Array.isArray(ye.comportamientos)?ct=ye.comportamientos[Math.floor(Math.random()*ye.comportamientos.length)]:ye.comportamiento&&(ct=ye.comportamiento),Ve?lt?y.push(Ve):m.push(Ve):(h||(alert(d.noColorsAvailable),h=!0),Ve="noColor"),nt(ye.id,ct,ne,"NoShow",Ve,null,2)}}}else o=((F=i.texto)==null?void 0:F[s.id])||"";const g=ia(f),v=ia(p),k=ia(o);Xt(O=>[...O,{id:r,message:u,action:g,action2:v,extra:k}])},Ia=s=>{ot(()=>s),Wt(!0)},To=()=>{Wt(!1),ot(null)},Eo=Fe.filter(s=>se.includes(s.expansionId)),Ts=s=>{j(n=>n.map(r=>r.enemy.uuid===s?{...r,enemy:{...r.enemy,highlight:!1}}:r))},Ao=(s,n)=>{if(!n)return;const r=(n==null?void 0:n.size)==="grande";let i=[...Q],u=[...x],f=!1;for(let p=0;p<s;p++){let o=Pt(r,i,u);o?r?u.push(o):i.push(o):(f||(alert(d.noColorsAvailable),f=!0),o="noColor"),nt(n.id,n.comportamiento,n.categoria,"NoShow",o),ae(`${d.invoca} ${ee[n.id]}`)}},ko=(s,n,r)=>{var h;if(!n||s===0)return;const i=Fe.filter(g=>Ie.includes(g.id)&&g.id===n&&g.categoria===r);if(i.length===0)return;const f=b.filter(g=>g.enemy.id===n).length;(h=a.placedHeroes)!=null&&h.length;const p=Math.max(0,s-f);let o=[...Q],m=[...x],y=!1;for(let g=0;g<p;g++){const v=i[Math.floor(Math.random()*i.length)],k=v.size==="grande";let P=Pt(k,o,m);P?k?m.push(P):o.push(P):(y||(alert(d.noColorsAvailable),y=!0),P="noColor"),nt(v.id,v.comportamiento,v.categoria,"NoShow",P),ae(`${d.invoca} ${ee[v.id]}`)}},la=s=>{if(!E||s.length===0)return;const n=s[0];if(!n)return;const r=s.filter(v=>v.runa===n.runa).length,i=nn.find(v=>v.rune===n.runa||v.rune===n.color);if(!i)return;const u=i.lista_capacidad||[],f=b.find(v=>v.enemy.categoria==="jefe"),p=f==null?void 0:f.enemy;if(!p)return;const o=p.uuid;let m=je(n.runa)+r,y=(ee==null?void 0:ee[p.id])||p.nombre||p.id,h=Ue.texto[i.id],g=`${y}: ${h}`;g&&(g=g.replaceAll("{X}",m),g=g.replace(/\{([^}]+)\}/g,(v,k)=>Ae[k]),ae(g),u.forEach(v=>{if(v.startsWith("ESCUDO")){const k=v.split("_");k.includes("?");const P=k.includes("SI"),$=Ne.find(O=>O.id==="ESCUDO"),_=($==null?void 0:$.max)||1/0;let A=0;if(k.includes("X")&&(A=m),A<=0)return;const R=[...p.estadosAlterados],F=R.findIndex(O=>O.id==="ESCUDO");if(F>=0){let H=R[F].count+A;P||(H=Math.min(H,_)),R[F]={...R[F],count:H}}else{let O=A;P||(O=Math.min(O,_)),R.push({id:"ESCUDO",count:O})}ks(o,R)}}))},Io=(s,n)=>{if(s.length===0)return;const r=s[0];if(!r)return;const i=ln.find(g=>g.rune===r.runa||g.rune===r.color);if(!i)return;const u=i.lista_capacidad||[];let f=je(r.runa);const p=(ee==null?void 0:ee[n.id])||n.nombre||n.id;let o=It.texto[i.id],m=`${p}: ${o}`;if(!m)return;m=m.replaceAll("{X}",f),m=m.replace(/\{([^}]+)\}/g,(g,v)=>Ae[v]);const y=[m];let h=[...n.estadosAlterados||[]];return u.forEach(g=>{if(g.startsWith("ESCUDO")){const v=g.split("_"),k=Ne.find(A=>A.id==="ESCUDO"),P=(k==null?void 0:k.max)||1/0;let $=0;if(v.includes("X")&&($=f),$<=0)return;const _=h.findIndex(A=>A.id==="ESCUDO");if(_>=0){let R=h[_].count+$;R=Math.min(R,P),h[_]={...h[_],count:R}}else{let A=$;A=Math.min(A,P),h.push({id:"ESCUDO",count:A})}}}),{estados:h,logs:y}},$o=()=>{const s="dark_vampire",n="bisoño";let r=0;Ee<=2?r=1:Ee<=4?r=2:r=3;const u=b.filter(v=>v.enemy.id===s).length,p=Math.max(0,4-u),o=r-p;if(o>0)for(let v=0;v<o;v++)ae(`${d.invasionDamage}`);let m=[...Q],y=[...x],h=!1;const g=Math.min(r,p);for(let v=0;v<g;v++){const k=Fe.filter(P=>Ie.includes(P.id)&&P.id===s&&P.categoria===n);if(k.length>0){const P=k[Math.floor(Math.random()*k.length)],$=P.size==="grande";let _=Pt($,m,y);_?$?y.push(_):m.push(_):(h||(alert(d.noColorsAvailable||"No hay más colores disponibles para asignar"),h=!0),_="noColor"),nt(P.id,P.comportamiento,P.categoria,"NoShow",_),ae(`${d.invoca} ${ee[P.id]}`)}}},Ro=s=>{const n=wt.color;Oe({open:!1,color:null});const r=Fe.filter(g=>g.color===n&&g.categoria===s&&Ie.includes(g.id)&&g.cara!=="B"&&g.id!==(oe==null?void 0:oe.id));if(r.length===0)return;const i=r[Math.floor(Math.random()*r.length)],u=ze[i.rune],f=i.runePosition,p=Ye(i.capacidades,i.rune,je),o=Qe(),m=i.size==="grande",y=z(o,m),h=Ne.map(g=>({id:g.id,count:0}));Bt(i),N({enemy:{uuid:o,name:i.nombre,id:i.id,rune:i.rune,imagen:i.imagen,runePosition:f,position:u,categoria:i.categoria,comportamiento:i.comportamiento,vida:i.vida,vidaMax:i.vida,movimiento:i.movimiento,ataque:i.ataque,color:i.color,inmunidad:i.inmunidad,tipo_ataque:i.tipo_ataque,capacidades:p,capacidadesOriginales:i.capacidades,ringColor:y,cara:i.cara,estadosAlterados:h}})},nt=(s,n,r,i="show",u=null,f=null,p=null)=>{$t({open:!1,color:null});const o=Fe.find($=>$.id!==s||$.categoria!==r||!Ie.includes($.id)||$.cara==="B"?!1:r==="comandante"||r==="jefe"?!0:$.comportamiento===n);if(!o)return;const m=f||Qe(),y=o.size==="grande",h=u==="noColor"?void 0:z(m,y,u),g=Ne.map($=>({id:$.id,count:0}));if(o.categoria==="comandante"){const $=(_=null)=>{const A=Za.includes(o.id)?o.vida:o.vida*(_+Ee),R=ze[o.rune],F=o.runePosition,O=Ye(o.capacidades,o.rune,je),H={uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:F,position:R,categoria:r,comportamiento:n,vida:A,vidaMax:A,movimiento:o.movimiento,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:o.tipo_ataque,capacidades:O,capacidadesOriginales:o.capacidades,ringColor:h,cara:o.cara,estadosAlterados:g};i==="show"&&Bt(o),N({enemy:H}),Es(o,m)};Za.includes(o.id)?$():typeof p=="number"?$(p):Ia(_=>$(_));return}else if(o.categoria==="overlord"){const $=o.vida*Ee,_=ze[o.rune],A=o.runePosition,R=Ye(o.capacidades,o.rune,je),O={uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:A,position:_,categoria:r,comportamiento:n,vida:$,vidaMax:$,movimiento:o.movimiento,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:o.tipo_ataque,capacidades:R,capacidadesOriginales:o.capacidades,ringColor:null,cara:o.cara,estadosAlterados:g};i==="show"&&Bt(o),N({enemy:O}),$a(o,m);return}else if(o.categoria==="hero"){const $=o.vida*Ee,_=ze[o.rune],A=o.runePosition,R=Ye(o.capacidades,o.rune,je),F={uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:A,position:_,categoria:r,comportamiento:n,vida:$,vidaMax:$,movimiento:o.movimiento,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:o.tipo_ataque,capacidades:R,capacidadesOriginales:o.capacidades,ringColor:h,cara:o.cara,estadosAlterados:g};i==="show"&&Bt(o),N({enemy:F}),Es(o,m),Mo(o,m);return}else if(o.categoria==="jefe"){const $=ze[o.rune],_=o.runePosition,A=Ye(o.capacidades,o.rune,je);if(o.rune==="acecho"){const R=o.vida,F={uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:_,position:$,categoria:r,comportamiento:n,vida:R,vidaMax:R,movimiento:null,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:null,capacidades:A,capacidadesOriginales:o.capacidades,ringColor:null,cara:null,estadosAlterados:g};N({enemy:F});return}else if(o.rune==="jefe"){const F=(parseInt(window.prompt(`${d.cubosTrauma}`,"0"),10)||0)*o.cubo_T,H=(parseInt(window.prompt(`${d.cubosMaldicion}`,"0"),10)||0)*o.cubo_M,W=o.vida*Ee+F+H,M={uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:_,position:$,categoria:r,comportamiento:n,vida:W,vidaMax:W,movimiento:null,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:null,capacidades:A,capacidadesOriginales:o.capacidades,ringColor:null,cara:null,estadosAlterados:g};if(js(),V(),N({enemy:M}),Po(o,m),ko(o.numInvoca,o.invoca,o.catInvoca),o.robaRunas>0&&(U(o.robaRunas),ae(`⚡ ${d.consecuencias}: ${Ce(o.id)} ${d.Roba} ${o.robaRunas} ${d.runes}`)),o.consecuencias==="SI"){let ne=0;window.confirm(`${d.activaRompe}`)&&(ne+=15*Ee),window.confirm(`${d.activaAmantes}`)&&(ne+=15*Ee),window.confirm(`${d.activaDuo}`)&&ae(`${d.textoDuo}`),ne>0&&(M.vida=Math.max(0,M.vida-ne),ae(`⚡ ${d.consecuencias}: ${Ce(o.id)} ${d.pierde} ${ne} ${d.pH}`))}Fo();return}}const v=ze[o.rune],k=o.runePosition,P=Ye(o.capacidades,o.rune,je);N({enemy:{uuid:m,name:o.nombre,id:o.id,rune:o.rune,imagen:o.imagen,runePosition:k,position:v,categoria:r,comportamiento:n,vida:o.vida,vidaMax:o.vida,movimiento:o.movimiento,ataque:o.ataque,color:o.color,inmunidad:o.inmunidad,tipo_ataque:o.tipo_ataque,capacidades:P,capacidadesOriginales:o.capacidades,ringColor:h,cara:o.cara,estadosAlterados:g}}),i==="show"&&Bt(o)},So=()=>{const s=Fe.filter(p=>p.categoria==="comandante");if(s.length===0)return;const n=s[Math.floor(Math.random()*s.length)],r=Qe(),i=n.size==="grande",u=z(r,i),f=Ne.map(p=>({id:p.id,count:0}));Ia(p=>{const o=n.vida*(p+Ee),m=ze[n.rune],y=n.runePosition,h=Ye(n.capacidades,n.rune,je),g={uuid:r,name:n.nombre,id:n.id,rune:n.rune,imagen:n.imagen,runePosition:y,position:m,categoria:n.categoria,comportamiento:n.comportamiento,vida:o,vidaMax:o,movimiento:n.movimiento,ataque:n.ataque,color:n.color,inmunidad:n.inmunidad,tipo_ataque:n.tipo_ataque,capacidades:h,capacidadesOriginales:n.capacidades,ringColor:u,cara:n.cara,estadosAlterados:f};Bt(g),N({enemy:g}),Es(n,r)})},Es=(s,n,r=!1)=>{const i=s.id,u=s.color,f=s.categoria,p=[...mn].sort(()=>.5-Math.random()),o=Ne.map(v=>({id:v.id,count:0})),m=p.slice(0,Ee),y=Ce(i,u),h=m.map(v=>({enemy:{uuid:Qe(),id:v.id,nombre:v.nombre,capacidades:v.capacidades,lista_capacidad:v.lista_capacidad,rune:v.rune,runePosition:v.runePosition,categoria:f,position:ze[v.rune],tipo:"especial",sourceEnemyUUID:n,nombreEnemy:y,highlight:!0,estadosAlterados:o}})),g=d.voragineWarning.replace("{name}",y);r&&(at(g),setTimeout(()=>at(null),3e3)),j(v=>[...v,...h]),h.forEach(v=>{setTimeout(()=>Ts(v.enemy.uuid),1500)})},$a=(s,n,r=!1)=>{const i=s.id,u=s.color,f=s.categoria,p=[...un].sort(()=>.5-Math.random()),o=Ne.map(v=>({id:v.id,count:0})),m=p.slice(0,Ee),y=Ce(i,u),h=m.map(v=>({enemy:{uuid:Qe(),id:v.id,nombre:v.nombre,capacidades:v.capacidades,lista_capacidad:v.lista_capacidad,rune:v.rune,runePosition:v.runePosition,categoria:f,position:ze[v.rune],tipo:"especial",sourceEnemyUUID:n,nombreEnemy:y,highlight:!0,estadosAlterados:o}})),g=d.voragineWarning.replace("{name}",y);r&&(at(g),setTimeout(()=>at(null),3e3)),j(v=>[...v,...h]),h.forEach(v=>{setTimeout(()=>Ts(v.enemy.uuid),1500)})},Mo=(s,n,r=!1)=>{const i=s.id,u=s.color,f=s.categoria,p=Ce(i,u),o=Ne.map(y=>({id:y.id,count:0})),m=[];if(cn.forEach(y=>{const h=xe&&xe.nombre&&xe.nombre[y.id]||y.nombre||y.id;window.confirm(`${d.cumpleCondiciones} ${h}?`)&&m.push({enemy:{uuid:Qe(),id:y.id,nombre:y.nombre,capacidades:y.capacidades,lista_capacidad:y.lista_capacidad,rune:y.rune,runePosition:y.runePosition,categoria:f,position:ze[y.rune],tipo:"fallenHero",sourceEnemyUUID:n,nombreEnemy:p,highlight:!0,estadosAlterados:o}})}),m.length>0){const y=d.voragineWarning.replace("{name}",p);r&&(at(y),setTimeout(()=>at(null),3e3)),j(h=>[...h,...m]),m.forEach(h=>{setTimeout(()=>Ts(h.enemy.uuid),1500)})}},Po=(s,n,r=!1)=>{const i=s.id,u=s.color,f=s.categoria,p=dn.filter(g=>g.idJefe===i),o=Ne.map(g=>({id:g.id,count:0})),m=Ce(i,u),y=p.map(g=>({enemy:{uuid:Qe(),id:g.id,nombre:g.nombre,capacidades:g.capacidades,lista_capacidad:g.lista_capacidad,rune:g.rune,runePosition:g.runePosition,categoria:f,position:ze[g.rune],tipo:"especial",sourceEnemyUUID:n,nombreEnemy:m,highlight:!0,estadosAlterados:o}})),h=d.bossWarning?d.bossWarning.replace("{name}",m):`${m} ha revelado sus cartas de jefe`;r&&(at(h),setTimeout(()=>at(null),3e3)),j(g=>[...g,...y]),y.forEach(g=>{setTimeout(()=>Ts(g.enemy.uuid),1500)})},Oo=(s,n)=>{const r=Ne.map(u=>({id:u.id,count:0}));if(n){const u=r.findIndex(f=>f.id==="TIEMPO");r[u].count=2}const i={uuid:Qe(),id:s.id,nombre:s.nombre,cara:s.cara,posicion:s.posicion,accion:s.accion,numRunas:s.numRunas,tipo:s.tipo,carta:s.carta,colorIndex:10,estadosAlterados:r};s.accion2&&(i.accion2=s.accion2),Ys({rune:i}),i.tipo==="defensa"&&hs()},ca=s=>{C(s),G(s)},Ra=s=>{Ke(s)},As=(s,n,r)=>{j(i=>i.map(u=>{if(u.enemy.uuid===s){const f=u.enemy.vidaMax,p=r??Math.max(n,f);return{...u,enemy:{...u.enemy,vida:n,vidaMax:p}}}return u}))},ks=(s,n)=>{j(r=>r.map(i=>{var u;return((u=i.enemy)==null?void 0:u.uuid)===s?{...i,enemy:{...i.enemy,estadosAlterados:n}}:i}))},Bo=s=>{var o;const n=(o=b.find(m=>m.enemy.uuid===s))==null?void 0:o.enemy;if(!n)return null;let r=0;const i=je(n.rune);if(n.ataque==="X")r=i;else if(typeof n.ataque=="string"&&n.ataque.startsWith("X+")){const m=parseInt(n.ataque.slice(2),10)||0;r=i+m}else r=parseInt(n.ataque,10)||0;let u=[],f=null;return b.filter(m=>(m.enemy.tipo==="especial"||m.enemy.tipo==="fallenHero")&&m.enemy.sourceEnemyUUID===s&&!(Array.isArray(m.enemy.estadosAlterados)&&m.enemy.estadosAlterados.some(y=>y.id==="TIEMPO"&&y.count>0))).map(m=>m.enemy).forEach(m=>{if(Array.isArray(m.lista_capacidad)&&m.lista_capacidad.includes("PASIVA")){f=m.id;const y=m.lista_capacidad.indexOf("PASIVA"),h=m.lista_capacidad[y+2];if(h!=null&&h.startsWith("DAÑO_BASICO")){const g=h.split("_"),v=g[2]==="X"?je(m.rune):parseInt(g[2],10);r+=v}else h!=null&&h.endsWith("_I")&&u.push(h)}}),{...n,idCartaEspecial:f,ataqueModificado:r,inmunidades:[...n.inmunidad||[],...u]}},Qt=(s,n)=>{if(!s.estadosAlterados||s.estadosAlterados.length===0)return{enemy:s,logs:[]};let r=s.vida,i=[...s.estadosAlterados];const u=[];if(r===0)return{enemy:s,logs:[]};const f=i.find(m=>m.id==="ESCUDO");let p=f?f.count:0;const o=i.map(m=>{const y=Ne.find(h=>h.id===m.id);if(!y||m.count<=0||m.id==="TIEMPO")return m;if(n==="inicio"&&y.turno==="principio"||n==="fin"&&y.turno==="final"){let h="",g=0,v=0,k=0;if(y.daño>0&&(k=y.daño*m.count,k>0)){if(y.prevenir==="si"&&p>0){const $=Math.min(k,p);g=$,p-=$,k-=$}g>0&&(h+=` ${d.consume} ${g} ${d.escudos}`),k>0&&(r-=k,y.prevenir==="no"?h+=` ${d.inflige} ${k} ${d.daño_i} (${d.ignoraEscudos})`:h+=` ${d.inflige} ${k} ${d.daño_i}`)}let P=m.count;if(y.reduce==="si"){const $=y.numReduce;P=Math.max(0,m.count-$),v=m.count-P,v>0&&(h+=` (${d.reduce} ${v})`)}return(g>0||k>0||v>0)&&(h=`${Ge[y.texto]}${h}`,u.push(h)),{...m,count:P}}return m});return f&&(f.count-p,o.forEach(m=>{m.id==="ESCUDO"&&(m.count=p)})),{enemy:{...s,vida:Math.max(0,r),estadosAlterados:o},logs:u.length>0?u:[]}},da=(s,n)=>{let r=s.vida,i=[...s.estadosAlterados||[]];const u=[],f=Ye(s.capacidadesOriginales||[],s.rune,je);return f.forEach(p=>{if(p.startsWith("REGENERACION")){const o=p.split(" "),m=parseInt(o[1])||0;if(m>0){const y=r,h=Math.min(s.vidaMax,r+m);h>y&&(r=h,u.push(`${d.regenera} ${h-y} ${d.vida_i}`))}}if(p.startsWith("ESCUDO")){const o=p.split(" "),m=parseInt(o[1])||0;if(m>0){let y=[...i];const h=y.findIndex(k=>k.id==="ESCUDO"),g=Ne.find(k=>k.id==="ESCUDO"),v=(g==null?void 0:g.max)||1/0;if(h>=0){const k=y[h].count,P=Math.min(v,k+m);P>k&&(y[h]={...y[h],count:P},u.push(`${d.gana} ${P-k} ${d.escudos}`))}else{const k=Math.min(v,m);y.push({id:"ESCUDO",count:k}),k>0&&u.push(`${d.gana} ${k} ${d.escudos}`)}i=y}}if(p==="EVOLUCION"&&(na(o=>o.find(y=>y.uuid===s.uuid)?o.map(y=>y.uuid===s.uuid?{...y,count:y.count+1}:y):[...o,{uuid:s.uuid,count:1}]),u.push(`${d.evoluciona}: ${d.fuerzaAumenta}`)),p==="MANIFESTAR"){const o=Nt();if(o)if(f.includes("IRA")){const m=Io([o],s);m!=null&&m.estados&&(i=m.estados),m!=null&&m.logs&&u.push(...m.logs)}else u.push(`${d.Manifiesta} ${d.colores[o.runa]}`)}if(p.startsWith("HASTA")){const o=p.split(" "),m=parseInt(o[1])||0,y=f.indexOf(p),h=f[y+2]||"";if(h.startsWith("SANAR")){const g=h.split(" "),v=parseInt(g[1])||0;m>0&&v>0&&[...n.map(_=>_.enemy).filter(_=>_.vida>0)].sort((_,A)=>_.vida-A.vida).slice(0,m).forEach(_=>{const A=_.vida,R=Math.min(_.vidaMax,A+v);R>A&&(u.push(`${d.sanaA} ${ee[_.id]} ${R-A} ${d.vida_i}`),_.uuid!=s.uuid?As(_.uuid,R,_.vidaMax):r=R)})}}}),{vida:r,estados:[...i],logs:u.length>0?u:[]}},Do=s=>{const n=[],r=s.lista_capacidad||[],i=je(s.rune),u=Ee;let f=null;const p=s.sourceEnemyUUID,o=b.find(h=>h.enemy.uuid===p),m=o==null?void 0:o.enemy;let y=0;return m?(r.forEach(h=>{var g,v,k,P,$,_;if(h.startsWith("SANA")){const A=h.split("_"),R=A.includes("?"),F=A.includes("SI"),O=A.includes("CASILLAS");let H=1;const L=A.findIndex(lt=>!isNaN(lt));L!==-1&&(H=parseInt(A[L],10));let W=i;if(O){if(!window.confirm(`${d.numCasillas1}`))return;const Ve=parseInt(window.prompt(`${d.numCasillas2}`,"0"),10);!isNaN(Ve)&&Ve>0?W=Ve*u:W=0}const M=H*W;if(M<=0)return;let ne=m.vida+M,le=m.vidaMax;F&&ne>m.vidaMax?le=ne:ne=Math.min(ne,m.vidaMax);const he=ne-m.vida;if(R&&M>0&&!window.confirm(`${d.sanaPreg} ${he} ${d.preg}`))return;As(p,ne,le),y+=he;const ye=((g=xe==null?void 0:xe.nombre)==null?void 0:g[s.id])||s.nombre||s.id;n.push(`💚 ${ye} ${d.sana} ${he}`)}else if(h.startsWith("ESCUDO")){const A=h.split("_"),R=A.includes("?"),F=A.includes("SI"),O=Ne.find(le=>le.id==="ESCUDO"),H=(O==null?void 0:O.max)||1/0;let L=0;if(A.includes("X"))L=i;else if(R){const le=parseInt(prompt(d.cuantosEscudos),10);!isNaN(le)&&le>0&&(L=le)}if(L<=0)return;const W=[...m.estadosAlterados],M=W.findIndex(le=>le.id==="ESCUDO");if(M>=0){let he=W[M].count+L;F||(he=Math.min(he,H)),W[M]={...W[M],count:he}}else{let le=L;F||(le=Math.min(le,H)),W.push({id:"ESCUDO",count:le})}ks(p,W);const ne=((v=xe==null?void 0:xe.nombre)==null?void 0:v[s.id])||s.nombre||s.id;n.push(`🛡 ${ne} ${d.gana} ${L} ${d.escudos}`)}else if(h.startsWith("RECUPERA")){const A=h.split("_"),R=A.includes("SI");let F=1;const O=A.findIndex(ye=>!isNaN(ye));O!==-1&&(F=parseInt(A[O],10));const H=A.find(ye=>isNaN(ye)&&ye!=="RECUPERA"&&ye!=="SI");if(!H)return;const L=parseInt(prompt(`${d.cuantosRecursos} ${Ae[H]} ${d.sonAb}?`),10);if(isNaN(L)||L<=0)return;const W=L*F;if(W<=0)return;let M=m.vida+W,ne=m.vidaMax;R&&M>m.vidaMax?ne=M:M=Math.min(M,m.vidaMax);const le=M-m.vida;As(p,M,ne),y+=le;const he=((k=xe==null?void 0:xe.nombre)==null?void 0:k[s.id])||s.nombre||s.id;n.push(`💚 ${he} ${d.regenera} ${le} ${d.vida_i}`)}else if(h.startsWith("MANIFIESTA"))f=Nt(),f&&n.push(`🔮 ${d.runaManifestada} ${d.colores[f.runa]}`);else if(h.startsWith("ROBA")){const A=h.split("_"),R=parseInt(A[1],10)||0;if(R<=0)return;const F=U(R);F==null||F.forEach(O=>Xe(O))}else if(h.startsWith("CONDICIONES")){const A=(P=b.find(le=>le.enemy.uuid===s.sourceEnemyUUID))==null?void 0:P.enemy;if(!A)return;const{enemy:R,logs:F}=Qt(A,"inicio"),{vida:O,estados:H,logs:L}=da(R,b),W={...R,vida:O,estadosAlterados:H};if(W.vida<=0){ae(`☠ ${ee[W.id]} ${d.muere_1}`),C(W.uuid);return}const{enemy:M,logs:ne}=Qt(W,"fin");[...F,...L,...ne].forEach(le=>ae(`🌀 ${ee[M.id]}: ${le}`)),j(le=>le.map(he=>he.enemy.uuid===M.uuid?{...he,enemy:M}:he))}else if(h.startsWith("TIEMPO")){const A=h.split("_"),R=parseInt(A[1],10)||0;if(R<=0||!f)return;const F=f.runa;b.forEach(O=>{const H=O.enemy;if(H.uuid!==s.uuid&&H.uuid!==s.sourceEnemyUUID&&H.rune===F){const L=[...H.estadosAlterados||[]],W=L.findIndex(M=>M.id==="TIEMPO");W>=0?L[W]={...L[W],count:L[W].count+R}:L.push({id:"TIEMPO",count:R}),ks(H.uuid,L),n.push(`⏳ ${ee[H.id]||xe.nombre[H.id]} ${d.gana} ${R} ${d.tiempo}`)}})}else if(h.startsWith("ACTIVA")){const A=h.split("_");let R=s.sourceEnemyUUID;const F=(($=xe==null?void 0:xe.nombre)==null?void 0:$[s.id])||s.nombre||s.id,O=A[1]!==void 0?parseInt(A[1],10):null,H=A[2]||null;let L=!1;if(O===0?L=!0:H==="RUNA"?je(s.rune)>=O&&(L=!0):H==="SANA"?y>=O&&(L=!0):H==="ESBIRROS"?(b.filter(M=>M.enemy.categoria==="esbirro").forEach(M=>pa(M.enemy.uuid)),n.push(`⚡ ${F} ${d.activaTurnoEsbirros}`)):H==="CARTA"&&(pa(s.uuid),n.push(`⚡ ${F} ${d.activaTurnoCarta}`)),L&&R){pa(R);const W=((_=xe==null?void 0:xe.nombre)==null?void 0:_[s.id])||s.nombre||s.id;n.push(`⚡ ${W} ${d.activaTurno}`)}}else if(h.startsWith("INVOCA")){const A=r.indexOf(h),R=h.split("_");let F=R[1],O=1;F==="X"?O=u:O=parseInt(F,10)||1;let H=R[3],L=1/0;H!=="NO"&&(L=parseInt(H,10)||1/0);const W=r[A+1],M=r[A+2];if(W&&M){const ne=b.filter(ct=>ct.enemy.id===W&&ct.enemy.categoria===M).length,le=L===1/0?O:Math.max(0,L-ne),he=Math.min(O,le);if(he<=0){ae(`${d.noMasInvocar}`);return}let ye=[...Q],lt=[...x],Ve=!1;for(let ct=0;ct<he;ct++){const vt=Fe.filter(dt=>Ie.includes(dt.id)&&dt.id===W&&dt.categoria===M);if(vt.length>0){const dt=vt[Math.floor(Math.random()*vt.length)],Ha=dt.size==="grande";let as=Pt(Ha,ye,lt);as?Ha?lt.push(as):ye.push(as):(Ve||(alert(d.noColorsAvailable||"No hay más colores disponibles para asignar"),Ve=!0),as="noColor"),nt(dt.id,dt.comportamiento,dt.categoria,"NoShow",as),ae(`${d.invoca} ${ee[dt.id]}`)}}}}}),{logs:n}):{logs:n}},ua=s=>{if(!(s!=null&&s.estadosAlterados))return null;const n=s.estadosAlterados.findIndex(m=>m.id==="TIEMPO");if(n===-1)return null;const r=s.estadosAlterados[n];if(r.count<=0)return null;const i=Ne.find(m=>m.id==="TIEMPO"),u=(i==null?void 0:i.numReduce)||1;let f=r.count,p=r.count;(i==null?void 0:i.reduce)==="si"&&(f=Math.max(0,r.count-u));const o=[...s.estadosAlterados];return o[n]={...r,count:f},{skipped:p>0,nuevosEstados:o}},Lo=(s,n,r)=>{const i=je(n);let u=s;return u?(u=u.replaceAll("{X}",i).replaceAll("{2*X}",i*2).replaceAll("{3*X}",i*3).replaceAll("{4*X}",i*4),u=u.replace(/\{([^}]+)\}/g,(f,p)=>r[p]||p),u=u.replace(/\[([^\]]+)\]/g,(f,p)=>`<span style="color: #3B82F6; font-weight: bold;">${r[p]||p}</span>`),u):""},zo=(s,n)=>{!Array.isArray(s)||s.length===0||s.forEach(r=>{if(r.startsWith("INVOCA_")){const i=s.indexOf(r);let u=r.split("_")[1],f=1,p=[...Q],o=[...x];u==="X"?f=je(n):f=parseInt(u,10)||1;const m=s[i+1],y=s[i+2];let h=!1;if(m&&y)for(let g=0;g<f;g++){const v=Fe.filter(k=>Ie.includes(k.id)&&k.id===m&&k.categoria===y);if(v.length>0){const k=v[Math.floor(Math.random()*v.length)],P=k.size==="grande";let $=Pt(P,p,o);$?P?o.push($):p.push($):(h||(alert(d.noColorsAvailable||"No hay más colores disponibles para asignar"),h=!0),$="noColor"),nt(k.id,k.comportamiento,k.categoria,"NoShow",$),ae(`${d.invoca} ${ee[k.id]}`)}}}if(r.startsWith("ROBA_")){const i=parseInt(r.split("_")[1],10)||1,u=U(i);u==null||u.forEach(f=>Xe(f)),u||te(d.aviso),ae(`${d.Roba} ${i} ${d.rune}`),Ut(n),la(u)}})},Uo=(s,n,r=null)=>{const i=Array.from(new Set(s.map(u=>u.id)));return Fe.filter(u=>i.includes(u.id)&&u.color===n&&(r?u.comportamiento===r:!0))},qo=s=>{if(!yt.current.has(s.uuid)){yt.current.add(s.uuid);const n=ua(s);if(n!=null&&n.skipped){j(i=>i.map(u=>u.enemy.uuid===s.uuid?{...u,enemy:{...u.enemy,estadosAlterados:n.nuevosEstados}}:u));const r=(ee==null?void 0:ee[s.id])||s.nombre||s.id;return ae(`⏳ ${r} ${d.saltaTurnoPorTiempo}`),!1}}if(!Ot.current.has(s.uuid)){if(Ot.current.add(s.uuid),s.vida<=0)return ae(`☠ ${ee[s.id]} ${d.muere_1}`),C(s.uuid),!1;const{enemy:n,logs:r}=Qt(s,"inicio"),{vida:i,estados:u,logs:f}=da(n,b),p={...n,vida:i,estadosAlterados:u};if([...r,...f].forEach(o=>ae(`🌀 ${ee[p.id]}: ${o}`)),j(o=>o.map(m=>m.enemy.uuid===p.uuid?{...m,enemy:p}:m)),p.vida<=0)return ae(`☠ ${ee[p.id]} ${d.muere_1}`),C(p.uuid),!1}return!0},Ho={bisoño:"glow-bisono",soldado:"glow-soldado",veterano:"glow-veterano",campeon:"glow-campeon",comandante:"glow-commander",overlord:"glow-commander",jefe:"glow-commander",esbirro:"glow-escenario",escenario:"glow-escenario"},Sa={esbirro:"border-cyan",escenario:"border-blue",blanco:"border-blanco",gris:"border-gris",negro:"border-negro",comandante:"border-dorado",overlord:"border-morado",jefe:"border-morado"},Vo={esbirro:"bg-cyan-300",escenario:"bg-cyan-600",blanco:"bg-white",gris:"bg-gray-500",negro:"bg-black",comandante:"bg-orange-400 ",overlord:"bg-purple-800",jefe:"bg-purple-700"},Yt={rojo:"bg-red-700 hover:bg-red-600",azul:"bg-blue-700 hover:bg-blue-600",verde:"bg-green-700 hover:bg-green-600",naranja:"bg-orange-700 hover:bg-orange-600",gris:"bg-gray-700 hover:bg-gray-600"};T.useEffect(()=>{const s=a.heroes.map(n=>{var u;const r=a.roles[n],i=(u=Xa.find(f=>f.id===n))==null?void 0:u.image;return{id:n,role:r,image:i,position:Fr[r]}});c(n=>({...n,placedHeroes:s}))},[]);const[He,Jt]=T.useState(()=>Pe.turnIndex??-1),[Z,rt]=T.useState(null),[it,bt]=T.useState(()=>Pe.groupTurnTracker||{group:[],index:0}),Is=T.useRef(new Set),$s=T.useRef(new Set),[Ma,Rs]=T.useState(()=>Pe.lastRealTurnIndex??null);a.placedHeroes,it.index;const Zt=T.useRef(0),es=T.useRef(null),Ot=T.useRef(new Set),Ss=T.useRef(new Set),Ms=T.useRef(new Set),yt=T.useRef(new Set),[ts,Pa]=T.useState(()=>Pe.extraTurnsQueue||[]),[Ps,ma]=T.useState(()=>Pe.extraTurnIndex||0),[xa,fa]=T.useState(()=>Pe.extraTurnTotal||0);T.useEffect(()=>{an("trackerSession",{schemaVersion:1,enemyEvolutions:Kt,turnIndex:He,lastRealTurnIndex:Ma,groupTurnTracker:it,extraTurnsQueue:ts,extraTurnIndex:Ps,extraTurnTotal:xa})},[Kt,He,Ma,it,ts,Ps,xa]),T.useEffect(()=>{var i,u,f;if(He<0||He>=mt.length)return;const s=mt[He];es.current===null&&Zt.current===0&&(Zt.current=1,ae(`🔁 ${d.rondaInicial}`)),es.current!==null&&He!==-1&&He<es.current&&(Is.current=new Set,$s.current=new Set,Ot.current.clear(),Ss.current.clear(),Ms.current.clear(),yt.current=new Set,Ns([]),Zt.current+=1,ae(`🔁 ${d.ronda}: ${Zt.current}`)),es.current=He;let n=!1;if(s.type==="enemy"?n=b.some(p=>p.enemy.rune===s.rune&&p.enemy.position===s.index&&p.enemy.runePosition===s.position):s.type==="rune"?n=st.some(p=>p.rune.colorIndex===s.index&&p.rune.posicion===s.position):s.type==="hero"&&(n=(i=a.placedHeroes)==null?void 0:i.some(p=>p.role===s.role&&p.position===s.index)),!n){setTimeout(()=>{ss()},800);return}if(s.type==="enemy"){let p=b.filter(o=>o.enemy.rune===s.rune&&o.enemy.position===s.index&&o.enemy.runePosition===s.position).map(o=>o.enemy);if(p.length>0){const o=p[it.index];if(!o){setTimeout(()=>{ss()},1500);return}if(rt({...o,type:"enemy",group:p}),bt({group:p,index:it.index}),!yt.current.has(o.uuid)){yt.current.add(o.uuid);const m=ua(o);if(m!=null&&m.skipped){j(h=>h.map(v=>v.enemy.uuid===o.uuid?{...v,enemy:{...v.enemy,estadosAlterados:m.nuevosEstados}}:v));const y=o.tipo==="especial"||o.tipo==="fallenHero"?((u=xe.nombre)==null?void 0:u[o.id])||o.nombre||o.id:(ee==null?void 0:ee[o.id])||o.nombre||o.id;ae(`⏳ ${y} ${d.saltaTurnoPorTiempo}`);return}if((o.tipo==="especial"||o.tipo==="fallenHero")&&!Ms.current.has(o.uuid)){Ms.current.add(o.uuid);const{logs:y}=Do(o);y.forEach(h=>ae(`🃏 ${o.nombreEnemy||o.nombre}: ${h}`));return}if(!Ot.current.has(o.uuid)){if(Ot.current.add(o.uuid),o.vida<=0){ae(`☠ ${ee[o.id]} ${d.muere_1}`),C(o.uuid),setTimeout(()=>{},900);return}const{enemy:y,logs:h}=Qt(o,"inicio"),{vida:g,estados:v,logs:k}=da(y,b),P={...y,vida:g,estadosAlterados:v};if([...h,...k].forEach($=>ae(`🌀 ${ee[P.id]}: ${$}`)),j($=>$.map(_=>_.enemy.uuid===P.uuid?{..._,enemy:P}:_)),P.vida<=0){ae(`☠ ${ee[P.id]} ${d.muere_1}`),C(P.uuid),setTimeout(()=>{},900);return}}Array.isArray(o.capacidades)&&o.capacidades.includes("VORAGINE")&&!Is.current.has(o.uuid)&&(Is.current.add(o.uuid),o.categoria==="overlord"?(j(y=>y.filter(h=>!(h.enemy.tipo==="especial"&&h.enemy.sourceEnemyUUID===o.uuid))),$a(o,o.uuid,!0)):["comandante","hero"].includes(o.categoria)&&(j(y=>y.filter(h=>!(h.enemy.tipo==="especial"&&h.enemy.sourceEnemyUUID===o.uuid))),Es(o,o.uuid,!0)))}return}}if(s.type==="rune"){const p=st.filter(o=>o.rune.colorIndex===s.index&&o.rune.posicion===s.position).map(o=>o.rune);if(p.length>0){const o=p[it.index];if(!o){setTimeout(()=>{ss()},1500);return}if(rt({...o,type:"rune",group:p}),bt({group:p,index:it.index}),!yt.current.has(o.uuid)){yt.current.add(o.uuid);const m=ua({...o,type:s.type});if(m!=null&&m.skipped){ws(y=>y.map(g=>g.rune.uuid===o.uuid?{...g,rune:{...g.rune,estadosAlterados:m.nuevosEstados}}:g)),ae(`⏳ ${d.saltaTurnoPorTiempo}`);return}if(o.tipo==="defensa"&&!o.applyEffect&&($s.current.has(o.uuid)||$s.current.add(o.uuid)),o.applyEffect!==!1&&!Zs.includes(o.uuid)){if(o.tipo==="runa"){if(o.numRunas){const y=o.cara==="B",h=U(o.numRunas);h==null||h.forEach(g=>Xe(g)),h||te(d.aviso),la(h),X&&y&&$o()}}else if(o.tipo==="asalto"){if(o.numRunas){const y=U(o.numRunas);y?y.forEach(h=>{Xe(h),ae(`${d.interpretaRuna}`);const g=on.find(P=>P.rune===h.runa);if(!g)return;const v=ft.nombre[g.nombre];let k=ft.texto[g.texto];k=Lo(k,h.runa,Ae),ae(`🪱 ${v}: ${k}`),zo(g.lista_capacidad,h.runa)}):te(d.aviso),la(y)}}else if(o.tipo==="defensa"){const y=o.numRunas||1,h=o.carta;for(let g=0;g<y;g++){const v=bs(h);v?Co(v,h):console.warn(`${d.mazo_1} ${h}`)}}else if(o.tipo==="incursion"){const y=o.cara==="B",h=b.length===0,g=((f=a.placedHeroes)==null?void 0:f.length)||0,v=g<=2?2:g<=4?3:4,P=b.filter(A=>A.enemy.id===(oe==null?void 0:oe.id)).length,$=Math.max(0,v-P),_=P+v;if(y||!y&&h){const A=Nt();if(A){const R=ie.some(L=>L.runa==="evento"),F=R||ie.some(L=>L.runa===A.runa),H=[...Mt.filter(L=>L.estado==="activa"),...ps.filter(L=>L.estado==="activa")].filter(L=>L.tiles.some(W=>W.runa===A.runa));if(!F&&H.length===0){ae(`${d.incursionFail} ${d.colores[A.runa]} ${d.noExiste}`);return}if(H.length>0){const L=H.map(W=>`Nº ${W.numPila}  `).join(", ");ae(`${d.encontradaEn} -> ${d.colores[A.runa]}. ${d.enPilas}: ${L}`)}if($>0&&oe&&(Ao($,oe),ae(R?`${d.added} ${$} ${d.Enemies} ${d.invocaran}: ${d.enFichaEvento}`:`${d.added} ${$} ${d.Enemies} ${d.invocaran}: ${d.colores[A.runa]}`)),_>4){const L=_-4;ae(`${d.excesoIncursion} ${L} ${d.attackes} 3 ${d.daño}.`)}}else ae(`${d.aviso4}`)}else ae(`${d.noManifestamos}`)}Ns(y=>[...y,o.uuid])}}}}const r=Oa(He);rt(r),bt({group:[],index:0})},[He,b,st]);const pa=s=>{Pa(n=>{const r=[...n,s];return fa(r.length),r})},Oa=s=>{var n;for(let r=0;r<mt.length;r++){const i=(s+r)%mt.length,u=mt[i];if(u.type==="hero"){const f=(n=a.placedHeroes)==null?void 0:n.find(p=>p.role===u.role&&p.position===u.index);if(f)return{...f,type:"hero"}}else if(u.type==="enemy"){const f=b.filter(p=>p.enemy.rune===u.rune&&p.enemy.position===u.index&&p.enemy.runePosition===u.position).map(p=>p.enemy);if(f.length>0)return{...f[0],type:"enemy",group:f}}else if(u.type==="rune"){const f=st.filter(p=>p.rune.colorIndex===u.index&&p.rune.posicion===u.position).map(p=>p.rune);if(f.length>0)return{...f[0],type:"rune",group:f}}}return null},ss=()=>{var s,n;if(ts.length>0){const[r,...i]=ts;Pa(i),ma(Ps+1);const u=b.find(f=>f.enemy.uuid===r);if(u){if(ae(`${d.activandoTurnoAdicional} ${Ps+1}/${xa}`),!qo(u.enemy)){setTimeout(()=>ss(),800);return}rt({...u.enemy,type:"enemy",group:[u.enemy]}),i.length===0&&(ma(0),fa(0));return}}else ts.length===0&&(ma(0),fa(0));if(He===-1){const r=Oa(0);if(r){const i=mt.findIndex(u=>u.type===r.type&&(u.type==="hero"&&u.role===r.role&&u.index===r.position||u.type==="enemy"&&u.rune===r.rune&&u.index===r.position&&u.position===r.runePosition||u.type==="rune"&&u.index===r.colorIndex&&u.position===r.posicion));i!==-1&&(Jt(i),Rs(i))}return}if((Z==null?void 0:Z.type)==="enemy"&&!Ss.current.has(Z.uuid)){Ss.current.add(Z.uuid);const{enemy:r,logs:i}=Qt(Z,"fin");i.length>0&&i.forEach(u=>ae(`🌀 ${ee[r.id]}: ${u}`)),j(u=>u.map(f=>f.enemy.uuid===r.uuid?{...f,enemy:r}:f)),r.vida<=0&&(ae(`☠ ${ee[r.id]} ${d.muere_2}`),j(u=>u.filter(f=>f.enemy.uuid!==r.uuid)))}if(Z!=null&&Z.cara){const r=Z.cara==="A"?"B":"A";if(Z.type==="enemy"){const i=Fe.find(u=>u.id===Z.id&&u.cara===r);i&&(j(u=>u.map(f=>{if(f.enemy.uuid===Z.uuid){const p={};for(const m of Xr)i[m]!==void 0&&(p[m]=i[m]);let o={...f.enemy,...p,cara:r,capacidades:Ye(i.capacidades,i.rune,je),capacidadesOriginales:i.capacidades};if(r==="A"){const m=Kt.find(y=>y.uuid===f.enemy.uuid);m&&m.count>0&&(o={...o,ataque:(i.ataque||o.ataque)+2*m.count,movimiento:(i.movimiento||o.movimiento)+1*m.count})}return{...f,enemy:o}}return f})),ht(u=>[...u,Z.uuid]),setTimeout(()=>{ht(u=>u.filter(f=>f!==Z.uuid))},600))}if(Z.type==="rune"){let i=_a;Z.tipo==="defensa"&&(i=Ea),Z.tipo==="incursion"&&(i=Ta),Z.tipo==="asalto"&&(i=Ca);const u=i.find(f=>f.id===Z.id&&f.cara===r);u&&(ws(f=>f.map(p=>p.rune.uuid===Z.uuid?{rune:{...p.rune,...u,cara:r}}:p)),ht(f=>[...f,Z.uuid]),setTimeout(()=>{ht(f=>f.filter(p=>p!==Z.uuid))},600))}}if(((s=Z==null?void 0:Z.group)==null?void 0:s.length)>1&&it.index<Z.group.length-1){const r=it.index+1,i=Z.group[r];bt({group:Z.group,index:r}),rt({...i,type:Z.type,group:Z.group});return}for(let r=1;r<=mt.length;r++){const i=(He+r)%mt.length,u=mt[i];if(u.type==="hero"){const f=(n=a.placedHeroes)==null?void 0:n.find(p=>p.role===u.role&&p.position===u.index);if(f){Jt(i),Rs(i),rt({...f,type:"hero"}),bt({group:[],index:0});return}}else if(u.type==="enemy"){let f=b.filter(p=>p.enemy.rune===u.rune&&p.enemy.position===u.index&&p.enemy.runePosition===u.position).map(p=>p.enemy);if(f.length>0){Jt(i),Rs(i),rt({...f[0],type:"enemy",group:f}),bt({group:f,index:0});return}}else if(u.type==="rune"){const f=st.filter(p=>p.rune.colorIndex===u.index&&p.rune.posicion===u.position).map(p=>p.rune);if(f.length>0){Jt(i),Rs(i),rt({...f[0],type:"rune",group:f}),bt({group:f,index:0});return}}}console.warn("No se encontró siguiente entidad disponible para el turno.")},Fo=()=>{Jt(0),es.current=null,Zt.current=1,rt(null),bt({group:[],index:0}),Ns([]),Is.current=new Set,$s.current=new Set,Ot.current.clear(),Ss.current.clear(),Ms.current.clear(),yt.current=new Set,ae(`🔁 ${d.rondaInicial}`)},Bt=s=>{var n;(n=q==null?void 0:q.enemies)==null||n[s.id],ge(e.jsx(Dr,{enemyData:s,t:q}),{position:"top-center",autoClose:5e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!1,draggable:!1,progress:void 0,toastClassName:"!max-w-[800px] w-auto overflow-visible",bodyClassName:"!p-0 !m-0"})},ae=(s,n=null,r=null,i=null)=>{const u=Qe();Xt(f=>[...f,{id:u,message:s,action:n,action2:r,extra:i}])},Ba=["defensor","lider","controlador"],Da=["apoyo","agresor"],Go=Array(11).fill(0).map((s,n)=>{const r=(a.placedHeroes||[]).filter(p=>p.position===n&&Ba.includes(p.role)),i=(a.placedHeroes||[]).filter(p=>p.position===n&&Da.includes(p.role)),u=b.filter(p=>p.enemy.position===n&&p.enemy.runePosition==="arriba"),f=b.filter(p=>p.enemy.position===n&&p.enemy.runePosition==="abajo");return Math.max(r.length+u.length,i.length+f.length)}),ga=Math.max(...Go);let Os="h-[34rem]";ga>=5||ga>=3?Os="h-[40rem]":ga>=2&&(Os="h-[34rem]");const Xo=({rune:s,onRemove:n,flipped:r})=>{var k;const i=s.tipo,[u,f]=T.useState((s==null?void 0:s.estadosAlterados)||[]),{toggleRuneEffect:p}=Bs(),o=s.applyEffect!==!1,m=b.length,y=((k=a.placedHeroes)==null?void 0:k.length)||0,h=y<=2?"2":y<=4?"3":"4",g={runa:"border-indigo-400",asalto:"border-indigo-300",defensa:"border-green-400",incursion:"border-red-400"};T.useEffect(()=>{f(s!=null&&s.estadosAlterados?[...s.estadosAlterados]:[])},[s==null?void 0:s.estadosAlterados]);const v=(P=!1)=>{var W;const $=s.cara==="B";s.cara;const _=g[i]||"border-indigo-400",A=Me[s.id],R=Me[s.accion],F=Me[s.accion2],O=Me.Y,H=((W=Me[s.nombre])==null?void 0:W.replace("{x}",h))||s.nombre;Me[s.cartas]||s.cartas;const L=s.posicion;return e.jsx("div",{className:`${L==="abajo"?"absolute top-0 left-0 right-0":"absolute bottom-0 left-0 right-0"} backface-hidden ${P?"rotate-y-180":""}`,children:e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"river-bg rounded-lg max-w-[95%] mx-auto sm:max-w-[140px]",children:[e.jsx("svg",{className:"river-waves",viewBox:"0 0 1440 320",preserveAspectRatio:"none",children:e.jsx("path",{d:"M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z",fill:"rgba(0, 255, 150, 0.2)"})}),e.jsx("svg",{className:"river-waves2",viewBox:"0 0 100 800",preserveAspectRatio:"none",children:e.jsx("path",{d:`M50,0 \r
                     C60,100 40,200 50,300 \r
                     C60,400 40,500 50,600 \r
                     C60,700 40,800 50,900`,fill:"none",stroke:"rgba(0, 255, 150, 0.2)","stroke-width":"10"})}),e.jsx("svg",{className:"river-waves3",viewBox:"0 0 100 800",preserveAspectRatio:"none",children:e.jsx("path",{d:`M50,0 \r
                     C60,100 40,200 50,300 \r
                     C60,400 40,500 50,600 \r
                     C60,700 40,800 50,900`,fill:"none",stroke:"rgba(0, 255, 150, 0.2)","stroke-width":"10"})})]}),e.jsxs("div",{className:"relative z-10",children:[e.jsx("div",{className:"absolute top-1 left-1 grid grid-rows-4 grid-flow-col gap-1",children:u.filter(M=>M.count>0).map(M=>{const ne=Ne.find(le=>le.id===M.id);return ne?e.jsxs("div",{className:"relative group cursor-help",children:[e.jsx("img",{src:ne.imagen,alt:ne.texto,className:"w-6 h-6 border border-white rounded-full shadow-md"}),M.count>1&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded-full",children:M.count}),e.jsx("div",{className:"absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white text-[0.65rem] rounded px-2 py-1 opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap",children:Ge[ne.texto]||ne.texto})]},M.id):null})}),e.jsxs("div",{className:`p-0 rounded-lg border-2 shadow-md ${_} max-w-[95%] mx-auto sm:max-w-[140px]`,children:[e.jsx("div",{className:"flex justify-center mb-1 text-white font-bold text-xs sm:text-sm text-center",children:A}),(i==="runa"||i==="defensa")&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:[R," ",s.numRunas||""]}),e.jsx("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center",children:H})]}),i==="asalto"&&e.jsx(e.Fragment,{children:$?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:[F," ",O]}),e.jsx("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:R})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:[R," ",O]}),e.jsx("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:F})]})}),i==="incursion"&&e.jsx(e.Fragment,{children:$?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:[R," ",s.numRunas]}),e.jsx("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center",children:H})]}):m===0&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center font-bold",children:[R," ",s.numRunas]}),e.jsx("div",{className:"text-[0.55rem] sm:text-[0.65rem] text-white text-center",children:H})]})}),e.jsxs("div",{className:"flex justify-center text-[0.55rem] sm:text-[0.65rem] italic text-indigo-100 text-center font-bold",children:[P?e.jsx(Wa,{className:"text-white text-xs sm:text-xs"}):e.jsx(Ka,{className:"text-white text-xs sm:text-xs"})," ",d.cara," ",s.cara," ",P?e.jsx(Wa,{className:"text-white text-xs sm:text-xs"}):e.jsx(Ka,{className:"text-white text-xs sm:text-xs"})]}),e.jsxs("div",{className:"flex items-center justify-center mt-1 text-white text-[0.55rem] sm:text-[0.65rem]",children:[e.jsx("input",{type:"checkbox",checked:o,onChange:()=>p(s.uuid),className:"mr-1"}),e.jsx("label",{children:d.applyEffect})]}),e.jsx("div",{className:"flex items-center justify-end mt-1 text-white text-[0.55rem] sm:text-[0.65rem]",children:e.jsx("button",{onClick:()=>n(s.uuid),className:"top-1 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center z-10",title:"Eliminar",children:"✕"})})]})]})]})})};return e.jsx("div",{className:"w-full perspective hover:scale-105",children:e.jsxs("div",{className:`relative w-full h-full transition-transform duration-1000 transform-style preserve-3d ${r?"rotate-y-180":""}`,children:[v(!1),v(!0)]})})},Wo=({name:s,image:n,prof:r,position:i})=>e.jsx("div",{className:"flex flex-col items-center mx-1",children:e.jsxs("div",{className:"relative w-full max-w-[140px] hover:scale-105",children:[e.jsx("img",{src:n,alt:s,className:"w-full h-auto object-cover rounded-lg border-2 border-[#800020]/70"}),e.jsxs("div",{className:"absolute w-full bottom-0 left-1/2 transform -translate-x-1/2 px-1 rounded-lg text-white text-xs text-center bg-[#800020] leading-tight mt-2",style:{textShadow:"0 0 4px #b87333aa"},children:[e.jsx("span",{className:"block",children:s}),e.jsx("span",{className:"block text-[0.50rem] italic opacity-90 mb-1",children:r})]})]})}),La=({id:s,name:n,comportamiento:r,categoria:i,image:u,position:f,uuid:p,color:o,onRemove:m,vida:y,vidaMax:h,movimiento:g,ataque:v,openEnemyModal:k,ringColor:P,isFlipping:$,estadosAlterados:_,inmunidad:A})=>{var L,W;const[R,F]=T.useState(!1),O=i==="jefe",H=((L=Va.find(M=>M.id===P))==null?void 0:L.className)||((W=Fa.find(M=>M.id===P))==null?void 0:W.className)||"";return T.useEffect(()=>{if($){F(!0);const M=setTimeout(()=>F(!1),1100);return()=>clearTimeout(M)}},[$]),e.jsx("div",{className:Dt("flex flex-col items-center mx-1 relative transition-transform duration-1000 transform-style-preserve-3d",R?"rotate-y-180":""),style:{perspective:"1000px"},children:e.jsxs("div",{className:Dt("relative w-full hover:scale-110 rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.5)] transition-transform",!O&&H,O?"max-h-[250px]":"max-w-[140px]"),style:O?{width:"20%"}:{},children:[e.jsx("img",{src:u,alt:n,className:Dt("w-full h-full object-cover rounded-lg",O?"object-top max-h-[250px]":`border-2 ${Sa[o]||""}`)}),e.jsx("div",{className:`absolute top-1 left-1 grid ${O?"grid-rows-5":"grid-rows-3"} grid-flow-col gap-1`,children:_.filter(M=>M.count>0).map(M=>{const ne=Ne.find(ye=>ye.id===M.id);if(!ne)return null;const[le,he]=ue.useState(!1);return e.jsxs("div",{className:"relative",onMouseEnter:()=>he(!0),onMouseLeave:()=>he(!1),children:[e.jsx("img",{src:ne.imagen,alt:ne.texto,className:`${O?"w-8 h-8":"w-5 h-5"} border border-white rounded-full shadow-md`}),M.count>1&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-600 text-white text-[0.6rem] font-bold px-1 rounded-full",children:M.count}),le&&e.jsx("div",{className:`absolute top-full left-1/2 -translate-x-1/2 mt-1\r
                                      bg-black text-white text-[0.65rem] rounded px-2 py-1 \r
                                       w-max max-w-[200px] whitespace-normal break-words z-200`,children:e.jsx("strong",{children:ke[M.id]||""})})]},M.id)})}),e.jsx("div",{className:`absolute top-1 right-1 grid ${O?"grid-rows-5":"grid-rows-3"} grid-flow-col gap-1`,children:A&&A.map(M=>{const ne=Cr.find(ye=>ye.id===M);if(!ne)return null;const[le,he]=ue.useState(!1);return e.jsxs("div",{className:"relative",onMouseEnter:()=>he(!0),onMouseLeave:()=>he(!1),children:[e.jsx("img",{src:ne.imagen,alt:ke[M]||M,className:`${O?"w-8 h-8":"w-5 h-5"} border border-white rounded-full shadow-md`}),le&&e.jsx("div",{className:`absolute top-full left-1/2 -translate-x-1/2 mt-1 \r
                                      bg-black text-white text-[0.65rem] rounded px-2 py-1 \r
                                       w-max max-w-[200px] whitespace-normal break-words z-20`,children:e.jsx("strong",{children:cs[M]||M})})]},M)})}),e.jsx("div",{className:`cursor-custom absolute bottom-0 left-1/2 transform -translate-x-1/2 px-1 py-0.5 border-2 rounded-lg text-white text-xs
              ${Sa[o]||""} 
              ${Vo[o]||"bg-black/60"} 
              ${Ho[i]||""} 
              enemy-text-wrapper`,children:e.jsxs("div",{className:"flex flex-col w-full items-center leading-none",onClick:()=>{k(p)},children:[e.jsx("span",{className:"enemy-text leading-none",children:n}),!O&&r&&e.jsx("span",{className:"text-[0.50rem] italic leading-none mt-0.5 opacity-90",children:(Te==null?void 0:Te[r])||r}),e.jsxs("div",{className:"w-full relative h-2 mt-2",children:[e.jsxs("div",{className:"absolute inset-0 flex items-center justify-center text-white text-[0.6rem] font-bold z-10",children:[y," / ",h]}),e.jsx("div",{className:"w-full h-full bg-red-900 rounded",children:e.jsx("div",{className:"h-full bg-red-500 rounded",style:{width:`${y/h*100}%`}})})]})]})})]})},p)},Ko=s=>{const n=Object.values(ze).includes(s),r=s===10,i=Le(s),u=(a.placedHeroes||[]).filter(g=>g.position===s&&Ba.includes(g.role)),f=(a.placedHeroes||[]).filter(g=>g.position===s&&Da.includes(g.role)),p=b.filter(g=>g.enemy.position===s&&g.enemy.runePosition==="arriba"),o=b.filter(g=>g.enemy.position===s&&g.enemy.runePosition==="abajo"),m=st.filter(g=>g.rune.colorIndex===s&&g.rune.posicion==="arriba"),y=st.filter(g=>g.rune.colorIndex===s&&g.rune.posicion==="abajo"),h=(g,v,k="hero")=>{const P=g.length<=2?90:g.length===3?70:g.length===4?40:30;return(v?[...g].reverse():g).map((_,A)=>{const R=v?g.length+A:g.length-A,F=A*P,O=v?{bottom:`${F}px`,zIndex:R}:{top:`${F}px`,zIndex:R},H=Z&&(k==="enemy"&&_.enemy.uuid===Z.uuid||k==="rune"&&_.uuid===Z.uuid||k==="hero"&&_.id===Z.id),L=k==="enemy"&&Gt.includes(_.enemy.uuid);return e.jsx("div",{className:"absolute w-full transition-transform duration-400",style:{...O,zIndex:H?40:O.zIndex??100,transform:H?"scale(1.1)":"scale(1)",transition:"all 0.4s ease-in-out"},children:e.jsxs("div",{className:"relative items-center",children:[H&&e.jsx("div",{className:"absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 rounded-full border-2 border-white bg-purple-600",children:e.jsx(Mn,{className:"text-white animate-bounce",size:40})}),k==="enemy"&&(_.enemy.tipo==="especial"||_.enemy.tipo==="fallenHero")?e.jsx(Vr,{carta:_.enemy,highlight:_.enemy.highlight}):k==="enemy"?e.jsx(La,{uuid:_.enemy.uuid,id:_.enemy.id,name:Ce(_.enemy.id,_.enemy.color),image:_.enemy.imagen,comportamiento:_.enemy.comportamiento,categoria:_.enemy.categoria,position:v?"top":"bottom",color:_.enemy.color,onRemove:ca,vida:_.enemy.vida,vidaMax:_.enemy.vidaMax,movimiento:_.enemy.movimiento,ataque:_.enemy.ataque,openEnemyModal:Ra,inmunidad:_.enemy.inmunidad,tipo_ataque:_.enemy.tipo_ataque,capacidades:_.enemy.capacidades,ringColor:_.enemy.ringColor,isFlipping:L,estadosAlterados:_.enemy.estadosAlterados}):k==="rune"?e.jsx(Xo,{rune:_,onRemove:Js,flipped:Gt.includes(_.uuid)}):e.jsx(Wo,{name:ra(_.id),image:_.image,prof:Cs(_.id),position:v?"top":"bottom"})]})},k==="enemy"?_.enemy.uuid:k==="rune"?_.uuid:_.id)})};return e.jsxs("div",{className:`flex flex-col w-full ${Os} py-2`,children:[e.jsx("div",{className:"relative flex justify-center h-1/2 w-full mb-5",children:e.jsxs("div",{className:"absolute bottom-0 left-0 right-0 flex justify-center",children:[h(u,!0,"hero"),n&&h(p,!0,"enemy"),r&&h(m.map(g=>g.rune),!0,"rune")]})}),e.jsx("div",{className:"flex items-center justify-center h-8 shrink-0 bg-gray-300",children:e.jsxs("div",{className:Dt("flex items-center justify-center font-fantasy",{"w-14 h-14 rotate-45 border-4 gem-orange":s===1,"w-14 h-14 rotate-45 border-4 gem-green":s===3,"w-14 h-14 rotate-45 border-4 gem-blue":s===5,"w-14 h-14 rotate-45 border-4 gem-red":s===7,"w-14 h-14 rotate-45 border-4 gem-gray":s===9,"w-full h-10 bg-gray-300 text-black text-center shadow":s%2===0}),children:[e.jsx("span",{className:Dt("block text-[0.6rem] sm:text-xs md:text-sm lg:text-base leading-none text-center whitespace-nowrap max-w-full overflow-hidden text-ellipsis"),style:{width:"fit-content",maxWidth:"100%"},children:s===0&&_e.defensor||s===2&&_e.apoyo||s===4&&_e.lider||s===6&&_e.agresor||s===8&&_e.controlador||s===10&&d.rune}),n&&e.jsxs("div",{className:"absolute rotate-[-45deg] flex items-center gap-0 z-20",children:[(()=>{const g=rn.find(v=>v.id===i);return g?e.jsx("img",{src:g.imagenSin,alt:i,className:"w-12 h-12 object-contain"}):e.jsx(Sn,{className:"text-white text-sm"})})(),e.jsxs("div",{className:Dt("text-white text-xs font-bold px-1 py-0.5 inline-flex items-center whitespace-nowrap border-l-0 border-2",{"gem-orange2":s===1,"gem-green2":s===3,"gem-blue2":s===5,"gem-red2":s===7,"gem-gray2":s===9}),children:["x ",qt[i]||0]})]})]})}),e.jsx("div",{className:"relative flex justify-center h-1/2 w-full mt-5",children:e.jsxs("div",{className:"absolute top-0 left-0 right-0 flex justify-center",children:[h(f,!1,"hero"),n&&h(o,!1,"enemy"),r&&h(y.map(g=>g.rune),!1,"rune")]})})]},s)};return e.jsxs(Pn,{children:[e.jsx("div",{className:"min-w-0",children:e.jsxs("div",{className:"min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-950 to-black p-3 text-gray-200 sm:p-4",children:[e.jsx("div",{className:"no-header"}),e.jsx(Br,{onAddEnemy:l,onSelectCommander:So,onSelectBoss:pe,onAddManual:w,behaviors:ds,onSelectRuneCard:Oo,onTileDraw:Xe}),b.filter(s=>s.enemy.categoria==="jefe"&&s.enemy.tipo!="especial").map(({enemy:s})=>e.jsx("div",{className:"mt-3 p-2 bg-indigo-900 rounded-lg",children:e.jsx("div",{className:"scale-200",children:e.jsx(La,{uuid:s.uuid,id:s.id,name:Ce(s.id,s.color),image:s.imagen,comportamiento:s.comportamiento,categoria:s.categoria,position:s.runePosition,color:s.color,onRemove:ca,vida:s.vida,vidaMax:s.vidaMax,movimiento:s.movimiento,ataque:s.ataque,openEnemyModal:Ra,inmunidad:s.inmunidad,tipo_ataque:s.tipo_ataque,capacidades:s.capacidades,ringColor:s.ringColor,isFlipping:!1,estadosAlterados:s.estadosAlterados})},s.uuid)})),Mt.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-800 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:d.gestionPilas||""}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:Mt.map(s=>e.jsx("div",{className:"bg-gray-800 p-2 rounded text-center text-white border border-yellow-500",children:s.estado==="reserva"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-2",children:[d.pila," 🗃️"]}),e.jsxs("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>Fs(s.id),children:["✅ ",d.activaPila||"Activar Pila"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-1",children:[e.jsxs("span",{children:[d.pila," 🗃️"]}),e.jsx("input",{type:"text",maxLength:5,value:De[s.id]||"",onChange:n=>gs(s.id,n.target.value),className:"bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center",placeholder:"ABC12",title:d.codigoPila})]}),e.jsxs("div",{className:"text-xs text-gray-300 mb-2",children:[d.tamano,": ",s.tiles.length]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{Ft(s.id)},children:d.addRunaToPila}),e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{const n=ys(s.id);n&&n.length>0?n.forEach(r=>_t(r,"retira")):alert(d.emptyPila)},children:d.devolver}),e.jsx("button",{className:"bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs",onClick:()=>{const n=Ks(s.id);if(!n||n.length===0){alert(t.emptyPila);return}},children:d.combateEstrecho_pila||"Combate estrecho"})]})]})},s.id))})]}),ps.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-800 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:d.gestionPilas2||""}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:ps.map(s=>e.jsx("div",{className:"bg-gray-800 p-2 rounded text-center text-white border border-yellow-500",children:s.estado==="reserva"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-2",children:[d.nodo||"Nodo"," 🗃️"]}),e.jsxs("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>Vs(s.id),children:["✅ ",d.activaNodo||"Activar Nodo"]})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"font-bold mb-1",children:[e.jsxs("span",{children:[d.nodo||"Nodo"," 🗃️"]}),e.jsx("input",{type:"text",maxLength:5,value:De[s.id]||"",onChange:n=>gs(s.id,n.target.value),className:"bg-gray-700 text-white text-xs px-2 py-1 rounded w-[70px] text-center",placeholder:"ABC12",title:d.codigoPila})]}),e.jsxs("div",{className:"text-xs text-gray-300 mb-2",children:[d.tamano,": ",s.tiles.length]}),e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("button",{className:"bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-xs",onClick:()=>{Gs(s.id)},children:d.addRunaToPila}),e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs","aria-expanded":Ze===s.id,onClick:()=>Be(n=>n===s.id?null:s.id),children:d.devolverNodo}),Ze===s.id&&e.jsxs("div",{className:"mt-1 p-2 rounded bg-gray-900 border border-red-700 flex flex-wrap justify-center gap-1",children:[e.jsx("div",{className:"w-full text-[11px] text-gray-300 mb-1",children:d.eliminarPorColor||"Eliminar una runa:"}),["naranja","verde","azul","rojo","gris"].filter(n=>s.tiles.some(r=>r.runa===n)).map(n=>{var r;return e.jsx("button",{className:`${Yt[n]} text-white px-2 py-1 rounded text-xs`,onClick:()=>{const i=vs(s.id,n);i?_t(i,"retira"):alert(d.emptyPila),Be(null)},children:((r=d.colores)==null?void 0:r[n])||n},n)}),e.jsxs("button",{className:"bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 text-white px-2 py-1 rounded text-xs",onClick:()=>{const n=vs(s.id);n?_t(n,"retira"):alert(d.emptyPila),Be(null)},children:["🎲 ",d.removeRandom||"Aleatoria"]})]}),e.jsx("button",{className:"bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-xs",onClick:()=>{const n=Ws(s.id);if(!n||n.length===0){alert(d.emptyPila);return}},children:d.combateEstrecho||"Combate estrecho"})]})]})},s.id))})]}),ie.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-700 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:d.activeSpawnPoints}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:ie.map(s=>{if(s.runa==="evento"){const n=wo.find(r=>r.id==="evento");return e.jsxs("div",{className:"px-3 py-1 rounded bg-gray-800 text-white flex items-center gap-2",children:[(n==null?void 0:n.imagen)&&e.jsx("img",{src:n.imagen,alt:"Evento",className:"w-6 h-6 object-contain"}),e.jsx("span",{children:d.evento||"Evento"}),e.jsx("button",{onClick:()=>we(s.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},s.uuid)}return e.jsxs("div",{className:`px-3 py-1 rounded text-white ${Yt[s.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:d.colores[s.runa]}),e.jsx("button",{onClick:()=>we(s.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},s.uuid)})})]}),be.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-800 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2cursor-help",title:d.infoCA||"",children:d.activeBarricade||""}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:be.map(s=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${Yt[s.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:d.colores[s.runa]}),e.jsx("button",{onClick:()=>Se(s.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},s.uuid))})]}),tt.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-800 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:d.activeRuneKeys}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:tt.map(s=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${Yt[s.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:d.colores[s.runa]}),e.jsx("button",{onClick:()=>Ct(s.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},s.uuid))})]}),Tt.length>0&&e.jsxs("div",{className:"mt-3 p-2 bg-gray-800 rounded-lg",children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-2",children:d.activeRescue}),e.jsx("div",{className:"flex gap-2 flex-wrap justify-center",children:Tt.map(s=>e.jsxs("div",{className:`px-3 py-1 rounded text-white ${Yt[s.runa]} flex items-center gap-2`,children:[e.jsx("span",{children:d.colores[s.runa]}),e.jsx("button",{onClick:()=>St(s.uuid),className:"bg-red-600 hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs",children:"✕"})]},s.uuid))})]}),S&&e.jsx("div",{className:"mt-3 p-2 bg-indigo-900 rounded-lg",children:e.jsx("div",{className:"text-xs text-indigo-300 font-bold",children:d.huespedActivo})}),E&&e.jsx("div",{className:"mt-3 p-2 bg-indigo-900 rounded-lg",children:e.jsx("div",{className:"text-xs text-indigo-300 font-bold",children:d.acechoActivo})}),X&&e.jsx("div",{className:"mt-3 p-2 bg-indigo-900 rounded-lg",children:e.jsx("div",{className:"text-xs text-indigo-300 font-bold",children:d.invadidosActivo})}),e.jsx("div",{className:"overflow-x-auto rounded-xl border border-slate-600 bg-slate-900/80 shadow-inner",role:"region","aria-label":d.track||"Orden de iniciativa",tabIndex:"0",children:e.jsx("div",{className:"grid min-w-[1100px] grid-cols-11 auto-rows-auto gap-0 bg-slate-700 p-2 snap-x snap-mandatory md:min-w-0",children:[...Array(11)].map((s,n)=>e.jsx(ue.Fragment,{children:Ko(n)},`${n}-${(Z==null?void 0:Z.uuid)||(Z==null?void 0:Z.id)||"none"}`))})}),e.jsxs("div",{className:"flex-1 bg-gray-800 rounded-lg p-3 shadow-md",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 justify-center",children:[e.jsx(oo,{className:"text-yellow-300 text-xl"}),e.jsx("span",{className:"font-semibold text-white",children:d.estadoBolsa||"Estado de la Bolsa de Runas"})]}),e.jsxs("div",{className:"text-sm text-white justify-center",children:[d.extraidas,": ",e.jsx("b",{children:et.length}),e.jsx("br",{}),d.total,": ",e.jsx("b",{children:gt.length+et.length})]}),e.jsx("div",{className:"flex items-center gap-2 p-3 text-xs justify-center",children:[{id:"naranja",color:"#ff8c00"},{id:"verde",color:"#00aa00"},{id:"azul",color:"#0077cc"},{id:"rojo",color:"#cc0000"},{id:"gris",color:"#999999"}].map(({id:s,color:n})=>{const r=et.filter(u=>u.runa===s).length,i=gt.filter(u=>u.runa===s).length;return e.jsxs("div",{className:"px-2 py-1 rounded font-semibold",style:{backgroundColor:n,color:"white"},children:[d.colores[s]||s,": ",r,"/",r+i]},s)})})]}),wt.open&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-gray-900 p-4 rounded-xl shadow-lg text-white text-center",children:[e.jsx("h2",{className:"text-lg mb-4",children:d.selectCategory}),Gr.map(s=>e.jsx("button",{onClick:()=>Ro(s),className:"bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded m-1",children:ve[s]||s},s)),e.jsx("div",{className:"mt-4 text-center",children:e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded",onClick:()=>Oe({open:!1,color:null}),children:d.close||"Cerrar"})})]})}),$e.open&&e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50",children:e.jsxs("div",{className:"bg-gray-900 p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto",children:[e.jsx("h2",{className:"text-xl text-yellow-300 mb-4",children:d.manualTitle||"Seleccionar enemigo manualmente"}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-4",children:Object.entries(Uo(Eo,$e.color).reduce((s,n)=>(s[n.id]||(s[n.id]={}),s[n.id][n.categoria]||(s[n.id][n.categoria]=[]),s[n.id][n.categoria].push(n),s),{})).map(([s,n])=>{if(Wr.includes(s))return null;const r=Object.values(n)[0][0];return e.jsxs("div",{className:"bg-gray-800 p-2 rounded-lg flex flex-col items-center",children:[e.jsx("img",{src:r.imagen,alt:s,className:"w-20 h-20 object-cover mb-2 rounded"}),e.jsx("div",{className:"text-sm text-white text-center mb-2",children:Ce(s,$e.color)}),Object.entries(n).map(([i,u])=>e.jsx("div",{className:"w-full mb-2",children:Rt.includes(i)?e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:u.filter((f,p,o)=>p===o.findIndex(m=>m.id===f.id&&m.categoria===f.categoria&&m.comportamiento===f.comportamiento&&(m.cara==="A"||!m.cara))).filter(f=>f.cara==="A"||!f.cara).map(f=>e.jsx("button",{className:"text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded",onClick:()=>nt(f.id,f.comportamiento,f.categoria),children:d.addEnemy},`${f.id}-${f.categoria}-${f.comportamiento}`))}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"text-xs text-yellow-300 mb-1 text-center",children:(ve==null?void 0:ve[i])||i}),e.jsx("div",{className:"flex flex-wrap justify-center gap-1",children:u.filter((f,p,o)=>p===o.findIndex(m=>m.id===f.id&&m.categoria===f.categoria&&m.comportamiento===f.comportamiento&&(m.cara==="A"||!m.cara))).filter(f=>f.cara==="A"||!f.cara).map(f=>e.jsx("button",{className:"text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded",onClick:()=>nt(f.id,f.comportamiento,f.categoria),children:(Te==null?void 0:Te[f.comportamiento])||f.comportamiento},`${f.id}-${f.categoria}-${f.comportamiento}`))})]})},i))]},s)})}),e.jsx("div",{className:"mt-4 text-center",children:e.jsx("button",{className:"bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded",onClick:()=>$t({open:!1,color:null}),children:d.close||"Cerrar"})})]})}),e.jsx("div",{className:"flex justify-center mt-6",children:e.jsx("button",{onClick:()=>{setTimeout(()=>{ss()},300)},className:"bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full shadow-lg",children:d.nextTurn||"Siguiente turno"})}),e.jsxs("div",{className:"mt-8 flex justify-center gap-4",children:[e.jsx("button",{onClick:()=>re("/"),className:"bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow",children:d.goHome||"Ir al inicio"}),e.jsx("button",{onClick:()=>re("/tracker"),className:"bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow",children:d.backToConfig||"Volver a configuración"})]})]})}),e.jsx(br,{toastClassName:"toast-expand",bodyClassName:""}),pt&&e.jsx(Ur,{uuid:pt,enemy:(qa=b.find(s=>s.enemy.uuid===pt))==null?void 0:qa.enemy,onClose:()=>Ke(null),onDelete:ca,onVidaChange:As,overhealedEnemies:ta,setOverhealedEnemies:sa,onEstadoChange:ks,getEffectiveStats:Bo},pt),oa&&e.jsx(Lr,{onConfirm:s=>{qe==null||qe(s),To()}}),e.jsx(qr,{message:fe,onClose:()=>te(null)}),ea&&e.jsx("div",{className:"fixed top-20 left-1/2 transform -translate-x-1/2 items-center bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce",children:ea}),e.jsx(Ds,{children:e.jsxs("div",{className:"fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2",children:[xs.map(s=>e.jsx(os.div,{initial:{opacity:0,scale:.95,y:8},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.95,y:8},transition:{duration:.22},children:e.jsx(No,{tile:s,tipo:s.tipo,onClose:()=>_o(s)})},s.uuid)),D.map(s=>e.jsxs("div",{className:"bg-black/80 text-white px-3 py-2 rounded shadow flex items-center gap-2",children:[e.jsx("span",{children:s.mensaje}),e.jsx("button",{onClick:()=>Y(s.id),className:"ml-auto text-red-400 hover:text-red-600 font-bold",children:"✕"})]},s.id)),aa.map(s=>e.jsxs("div",{className:"relative bg-purple-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-3",children:[e.jsxs("div",{className:"flex flex-col",children:[s.message&&e.jsx("div",{className:"font-semibold mt-1 uppercase text-yellow-300",children:s.message}),s.action&&e.jsx("div",{className:"text-sm mt-1 whitespace-pre-line",children:s.action}),s.action2&&e.jsx("div",{className:"text-sm mt-1 whitespace-pre-line",children:s.action2}),s.extra&&e.jsx("div",{className:"text-xs mt-1 text-gray-300 whitespace-pre-line",children:s.extra})]}),e.jsx("button",{onClick:()=>{Xt(n=>n.filter(r=>r.id!==s.id))},className:"ml-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs",title:"Cerrar",children:"✕"})]},s.id))]})})]})};export{Jr as default};
