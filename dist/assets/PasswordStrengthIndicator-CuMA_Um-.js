import{c as i,r as c,j as s,X as o}from"./index-NvUe1ZN8.js";/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=i("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]),n=[{text:"At least 8 characters",regex:/.{8,}/},{text:"At least one uppercase letter",regex:/[A-Z]/},{text:"At least one lowercase letter",regex:/[a-z]/},{text:"At least one number",regex:/[0-9]/},{text:"At least one special character",regex:/[^A-Za-z0-9]/}],h=({password:a="",onValidationChange:r})=>{const[l,x]=c.useState(n.map(e=>({...e,valid:!1})));return c.useEffect(()=>{const e=n.map(t=>({...t,valid:t.regex.test(a)}));x(e),r(e.every(t=>t.valid))},[a,r]),s.jsx("div",{className:"space-y-1 mt-2",children:l.map(({text:e,valid:t})=>s.jsxs("div",{className:`flex items-center text-sm transition-colors ${t?"text-green-600":"text-gray-500"}`,children:[t?s.jsx(m,{className:"w-4 h-4 mr-2 flex-shrink-0"}):s.jsx(o,{className:"w-4 h-4 mr-2 flex-shrink-0"}),s.jsx("span",{children:e})]},e))})};export{h as P};
