import{e as s,a4 as g}from"./index-B04FlWpn.js";const t="gameLog";function r(){return s(t,[],Array.isArray).filter(a=>a&&typeof a=="object")}function c(o,a,n={}){if(!a)return;const e=r();e.push({at:new Date().toISOString(),kind:o,message:String(a),...n}),g(t,e.slice(-300))}function m(){return r().map(o=>`[${o.at}] (${o.kind}) ${o.message}`).join(`
`)}export{c as a,m as e,r};
