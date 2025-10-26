import{d,j as s,r as l,R as i}from"./index-XESJNA6v.js";/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=d("EllipsisVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=d("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}]]),x=({children:a,onClick:o,className:n="",icon:t})=>s.jsxs("button",{onClick:o,className:`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${n}`,children:[t," ",a]}),f=({trigger:a,children:o})=>{const[n,t]=l.useState(!1),c=l.useRef(null);return l.useEffect(()=>{const e=r=>{c.current&&!c.current.contains(r.target)&&t(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]),s.jsxs("div",{className:"relative",ref:c,children:[s.jsx("button",{onClick:e=>{e.stopPropagation(),t(!n)},children:a}),n&&s.jsx("div",{className:"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border",children:s.jsx("div",{className:"py-1",children:i.Children.map(o,e=>i.isValidElement(e)?i.cloneElement(e,{onClick:r=>{r.stopPropagation(),e.props.onClick&&e.props.onClick(r),t(!1)}}):e)})})]})};export{f as D,u as E,m as P,x as a};
