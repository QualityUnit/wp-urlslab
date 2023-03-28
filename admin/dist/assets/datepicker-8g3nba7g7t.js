import{r as c,R as e}from"../main-8g3nba7g7t.js";function C({defaultValue:h,placeholder:i,message:r,className:u,type:s,disabled:o,label:k,labelInline:b,onChange:d,children:t,style:m}){const[l,p]=c.useState(h||"");c.useState(!1);const f=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,E=a=>{d&&d(a.target.value)},v=()=>l?s==="email"&&f.test(l)?"has-value success":s!=="email"?"has-value":"has-value error":"";return e.createElement("label",{className:`urlslab-inputField-wrap ${u||""} ${b?"inline":""} ${v()}`,style:m},k?e.createElement("span",{className:"urlslab-inputField-label"},k):null,e.createElement("div",{className:`urlslab-inputField ${t?"has-svg":""}`},t,e.createElement("input",{className:"urlslab-input input__text",type:s||"text",defaultValue:l,onChange:a=>p(a.target.value),onBlur:a=>E(a),onKeyDown:a=>{(a.key==="Enter"||a.keyCode===9)&&a.target.blur()},placeholder:i,disabled:o?"disabled":""})),r!=null&&r.length&&v().length?e.createElement("div",{className:"urlslab-inputField-message"},r):null)}function M({checked:h,readOnly:i,radial:r,name:u,className:s,onChange:o,textBefore:k,children:b}){const[d,t]=c.useState(!!h),m=l=>{o&&!i&&o(l.target.checked),i||t(l.target.checked)};return e.createElement("label",{className:`urlslab-checkbox ${s||""} ${k?"textBefore":""} ${r?"radial":""}`},e.createElement("input",{className:`urlslab-checkbox-input ${h?"checked":""}`,type:u?"radio":"checkbox",name:u||"",defaultChecked:d,onChange:l=>m(l)}),e.createElement("div",{className:"urlslab-checkbox-box"}),e.createElement("span",{className:"urlslab-checkbox-text",dangerouslySetInnerHTML:{__html:b}}))}function g({className:h,name:i,style:r,children:u,items:s,checkedId:o,autoClose:k,isFilter:b,onChange:d}){const[t,m]=c.useState(!1),[l,p]=c.useState(!1),[f,E]=c.useState(o),v=c.useRef(!1),a=c.useRef(i);c.useEffect(()=>{const n=_=>{var $;!(($=a.current)!=null&&$.contains(_.target))&&t&&(m(!1),p(!1))};d&&v.current&&!t&&f!==o&&d(f),v.current=!0,document.addEventListener("click",n,!0)},[f,t]);const N=n=>{E(n),k&&(m(!1),p(!1))},x=()=>{m(!t),setTimeout(()=>{p(!l)},100)};return e.createElement("div",{className:`urlslab-FilterMenu urlslab-SortMenu ${h||""} ${t?"active":""}`,style:r,ref:a},!b&&u?e.createElement("div",{className:"urlslab-inputField-label",dangerouslySetInnerHTML:{__html:u}}):null,e.createElement("div",{className:`urlslab-FilterMenu__title ${b?"isFilter":""} ${t?"active":""}`,onClick:x,onKeyUp:n=>x(),role:"button",tabIndex:0},e.createElement("span",{dangerouslySetInnerHTML:{__html:b?u:s[f]}})),e.createElement("div",{className:`urlslab-FilterMenu__items ${t?"active":""} ${l?"visible":""}`},e.createElement("div",{className:`urlslab-FilterMenu__items--inn ${Object.values(s).length>8?"has-scrollbar":""}`},Object.entries(s).map(([n,_])=>e.createElement(M,{className:"urlslab-FilterMenu__item",key:n,id:n,onChange:()=>N(n),name:i,checked:n===f,radial:!0},_)))))}export{M as C,C as I,g as S};
