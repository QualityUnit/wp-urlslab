import{r as x,R as t,L}from"../main-8g3nba7g7t.js";import{u as F,a as N,b as U,T as i,S as M,M as y,c as z}from"./useTableUpdater-8g3nba7g7t.js";import{C as P,I as $}from"./datepicker-8g3nba7g7t.js";import"./useMutation-8g3nba7g7t.js";function O({slug:a}){var _;const r="src_url_id",{table:p,setTable:h,filters:c,setFilters:f,sortingColumn:m,sortBy:g}=F({slug:a}),d=x.useMemo(()=>`${c}${m}`,[c,m]),{__:o,columnHelper:l,data:s,status:b,isSuccess:E,isFetchingNextPage:R,hasNextPage:V,ref:C}=N({key:a,url:d,pageId:r}),{row:S,selectRow:k,deleteRow:w,updateRow:I}=U({data:s,url:d,slug:a,pageId:r}),n={src_url_id:"",src_url_name:o("Source URL"),dest_url_name:o("Destination URL"),pos:o("Position")},T=[l.accessor("check",{className:"checkbox",cell:e=>t.createElement(P,{checked:e.row.getIsSelected(),onChange:u=>{k(u,e)}}),header:null}),l.accessor("src_url_name",{tooltip:e=>t.createElement(i,null,e.getValue()),cell:e=>t.createElement("a",{href:e.getValue(),target:"_blank",rel:"noreferrer"},e.getValue()),header:n.src_url_name,size:400}),l.accessor("dest_url_name",{tooltip:e=>t.createElement(i,null,e.getValue()),cell:e=>t.createElement("a",{href:e.getValue(),target:"_blank",rel:"noreferrer"},e.getValue()),header:n.dest_url_name,size:400}),l.accessor("pos",{className:"nolimit",cell:e=>t.createElement($,{type:"number",defaultValue:e.getValue(),onChange:u=>I({newVal:u,cell:e,optionalSelector:"dest_url_id"})}),header:n.pos,size:80}),l.accessor("delete",{className:"deleteRow",cell:e=>t.createElement(M,{onClick:()=>w({cell:e,optionalSelector:"dest_url_id"})}),header:null})];return b==="loading"?t.createElement(L,null):t.createElement(t.Fragment,null,t.createElement(y,{slug:a,header:n,table:p,onSort:e=>g(e),onFilter:e=>f(e),exportOptions:{url:a,filters:c,fromId:`from_${r}`,pageId:r,deleteCSVCols:[r,"dest_url_id"]}}),t.createElement(z,{className:"fadeInto",slug:a,returnTable:e=>h(e),columns:T,data:E&&((_=s==null?void 0:s.pages)==null?void 0:_.flatMap(e=>e??[]))},S?t.createElement(i,{center:!0},o("URL has been deleted.")):null,t.createElement("button",{ref:C},R?"Loading more...":V)))}export{O as default};
