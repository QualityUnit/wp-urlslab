import{u as m,a as p,R as e,B as w,r as E}from"../main-jshfvxphaxk.js";import{S as b}from"./api-exclamation-jshfvxphaxk.js";/* empty css                             */function y({moduleId:l,children:r}){const{__:a}=m(),s=p().getQueryData(["modules"])[l];return e.createElement("div",{className:"urlslab-overview urlslab-panel fadeInto"},s.apikey&&e.createElement("div",{className:"urlslab-overview-apiKey flex-tablet"},e.createElement("div",{className:"apiIcon xxl"},e.createElement(b,null)),e.createElement("div",{className:"urlslab-overview-apiKey__content"},e.createElement("h3",null,a("The module requires URLsLab service")),e.createElement("p",null,a("With URLsLab service, you can unlock the full potential of the module and reap the benefits of automation. Save yourself hours of tedious work and get accurate results - it's the smart way to automate data processing!"))),e.createElement(w,{href:"https://www.urlslab.com",target:"_blank",active:!0},a("Get the API Key"))),e.createElement("div",{className:"urlslab-overview-content"},e.createElement("h3",null,s.title),r))}function c({onClick:l,className:r,children:a}){return e.createElement("button",{type:"button",className:`urlslab-simple-button ${r}`,onClick:l||null},a)}function N({moduleMenu:l,activeMenu:r,noSettings:a}){const{__:n}=m(),[s,v]=E.useState("overview"),u=new Map([["overview",n("Overview")],["settings",n("Settings")]]),o=t=>{v(t),r&&r(t)},i=t=>t===s?"active":"";return e.createElement("div",{className:"urlslab-moduleView-header"},e.createElement("div",{className:"urlslab-moduleView-headerTop"},e.createElement(c,{key:"overview",className:i("overview"),onClick:()=>o("overview")},u.get("overview")),l?Array.from(l).map(([t,d])=>e.createElement(c,{key:t,className:i(t),onClick:()=>o(t)},d)):null,!a&&e.createElement(c,{key:"settings",className:i("settings"),onClick:()=>o("settings")},u.get("settings"))))}export{N as M,y as O};
