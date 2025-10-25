import{d,j as s,r as l,R as i}from"./index-B3-V5Lho.js";/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=d("EllipsisVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=d("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}]]);/**
 * @license lucide-react v0.417.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=d("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),m=({children:r,onClick:c,className:n="",icon:t})=>s.jsxs("button",{onClick:c,className:`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${n}`,children:[t," ",r]}),h=({trigger:r,children:c})=>{const[n,t]=l.useState(!1),o=l.useRef(null);return l.useEffect(()=>{const e=a=>{o.current&&!o.current.contains(a.target)&&t(!1)};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[]),s.jsxs("div",{className:"relative",ref:o,children:[s.jsx("button",{onClick:e=>{e.stopPropagation(),t(!n)},children:r}),n&&s.jsx("div",{className:"absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border",children:s.jsx("div",{className:"py-1",children:i.Children.map(c,e=>i.isValidElement(e)?i.cloneElement(e,{onClick:a=>{a.stopPropagation(),e.props.onClick&&e.props.onClick(a),t(!1)}}):e)})})]})};export{h as D,u as E,x as P,y as T,m as a};
