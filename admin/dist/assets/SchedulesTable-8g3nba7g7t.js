import{r as x,R as t,L as S}from"../main-8g3nba7g7t.js";import{u as I,a as R,b as V,S as C,M,c as Y,T as q}from"./useTableUpdater-8g3nba7g7t.js";import{C as o}from"./datepicker-8g3nba7g7t.js";import"./useMutation-8g3nba7g7t.js";function K({slug:r}){var h;const i="schedule_id",{table:f,setTable:k,filters:m,setFilters:p,sortingColumn:d,sortBy:E}=I({slug:r}),u=x.useMemo(()=>`${m}${d}`,[m,d]),{__:a,columnHelper:s,data:c,status:g,isSuccess:L,isFetchingNextPage:y,hasNextPage:N,ref:O}=R({key:r,url:u,pageId:i}),{row:_,selectRow:w,deleteRow:T}=V({data:c,url:u,slug:r,pageId:i}),b={FOLLOW_ALL_LINKS:a("Follow all links"),FOLLOW_NO_LINK:a("Do not follow")},z={ONE_TIME:"One Time",YEARLY:"Yearly",MONTHLY:"Monthly",DAILY:"Daily",WEEKLY:"Weekly",HOURLY:"Hourly"},n={urls:a("URLs"),analyze_text:a("Analyze text"),follow_links:a("Follow links"),process_all_sitemaps:a("Process all sitemaps"),take_screenshot:a("Take screenshot"),custom_sitemaps:a("Sitemaps"),scan_frequency:a("Scan frequency"),scan_speed_per_minute:a("Scan speed per min.")},F=[s.accessor("check",{className:"checkbox",cell:e=>t.createElement(o,{checked:e.row.getIsSelected(),onChange:l=>{w(l,e)}}),header:null}),s==null?void 0:s.accessor("urls",{className:"nolimit",cell:e=>e==null?void 0:e.getValue().map(l=>t.createElement(t.Fragment,null,t.createElement("a",{href:l,target:"_blank",rel:"noreferrer",key:l},l),", ")),header:n.urls,size:300}),s==null?void 0:s.accessor("analyze_text",{cell:e=>t.createElement(o,{readOnly:!0,className:"readOnly",checked:e.getValue()}),header:n.analyze_text,size:100}),s==null?void 0:s.accessor("follow_links",{cell:e=>b[e==null?void 0:e.getValue()],header:n.follow_links,size:150}),s==null?void 0:s.accessor("process_all_sitemaps",{cell:e=>t.createElement(o,{readOnly:!0,className:"readOnly",checked:e.getValue()}),header:n.process_all_sitemaps,size:150}),s.accessor("scan_frequency",{cell:e=>z[e==null?void 0:e.getValue()],header:n.scan_frequency,size:90}),s.accessor("scan_speed_per_minute",{header:n.scan_speed_per_minute,size:120}),s==null?void 0:s.accessor("take_screenshot",{cell:e=>t.createElement(o,{readOnly:!0,className:"readOnly",checked:e.getValue()}),header:n.take_screenshot,size:90}),s==null?void 0:s.accessor("custom_sitemaps",{className:"nolimit",cell:e=>e==null?void 0:e.getValue().map(l=>t.createElement(t.Fragment,null,t.createElement("a",{href:l,target:"_blank",rel:"noreferrer",key:l},l),", ")),header:n.custom_sitemaps,size:300}),s.accessor("delete",{className:"deleteRow",cell:e=>t.createElement(C,{onClick:()=>T({cell:e})}),header:null})];return g==="loading"?t.createElement(S,null):t.createElement(t.Fragment,null,t.createElement(M,{slug:r,header:n,table:f,noCount:!0,noExport:!0,noDelete:!0,onSort:e=>E(e),onFilter:e=>p(e)}),t.createElement(Y,{className:"noHeightLimit fadeInto",slug:r,returnTable:e=>k(e),columns:F,data:L&&((h=c==null?void 0:c.pages)==null?void 0:h.flatMap(e=>e??[]))},_?t.createElement(q,{center:!0},`${n.url_name} “${_.url_name}”`," has been deleted."):null,t.createElement("button",{ref:O},y?"Loading more...":N)))}export{K as default};
