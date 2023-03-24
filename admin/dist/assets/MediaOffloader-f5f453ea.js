import{R as e,u as d,r as t,_ as r}from"../main.js";import{M as p,O as f}from"./ModuleViewHeader-04d44211.js";import"./api-exclamation-693036a2.js";/* empty css                          */function v(){return e.createElement(e.Fragment,null,e.createElement("p",null,"The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios."),e.createElement("p",null,"Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimized and running at its best."))}function b({moduleId:n}){const{__:o}=d(),[a,l]=t.useState("overview"),i="file",s=new Map([[i,o("Media Files")]]),m=t.lazy(()=>r(()=>import("./Settings-bb5845b2.js"),["./Settings-bb5845b2.js","../main.js","./main.css","./datepicker-9d5f36ac.js","./datepicker.css","./Switch-eaea0811.js","./Switch.css","./useMutation-157cd200.js","./Settings.css"],import.meta.url)),c=t.lazy(()=>r(()=>import("./MediaFilesTable-a947fd6b.js"),["./MediaFilesTable-a947fd6b.js","../main.js","./main.css","./useTableUpdater-93621fab.js","./datepicker-9d5f36ac.js","./datepicker.css","./useMutation-157cd200.js","./useTableUpdater.css"],import.meta.url));return e.createElement("div",{className:"urlslab-tableView"},e.createElement(p,{moduleMenu:s,activeMenu:u=>l(u)}),a==="overview"&&e.createElement(f,{moduleId:n},e.createElement(v,null)),a===i&&e.createElement(t.Suspense,null,e.createElement(c,{slug:i})),a==="settings"&&e.createElement(t.Suspense,null,e.createElement(m,{className:"fadeInto",settingId:n})))}export{b as default};
