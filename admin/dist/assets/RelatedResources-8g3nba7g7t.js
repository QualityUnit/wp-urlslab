import{R as e,u as d,r as t,_ as r}from"../main-8g3nba7g7t.js";import{M as E,O as p}from"./ModuleViewHeader-8g3nba7g7t.js";import"./api-exclamation-8g3nba7g7t.js";/* empty css                            */const h=""+new URL("related_resources-8g3nba7g7t.jpeg",import.meta.url).href,f=""+new URL("related_resources_complex-8g3nba7g7t.png",import.meta.url).href;function g(){return e.createElement(e.Fragment,null,e.createElement("p",null,"Internal link structure is a crucial SEO element of a successful website. It can increase website visibility, cater to visitors' needs, and boost your internal link-building. One of the best ways to create an effective internal link structure is by creating pairs of related pages, known as content clusters. This will provide additional interesting content to visitors and improve your rankings in the search engine results pages."),e.createElement("p",null,"When creating related pages, it is essential to ensure they are interconnected in terms of topics and keywords. Fortunately, the AI-powered URLsLab service can help to compute the best pairs of pages with zero effort."),e.createElement("p",null,"Ultimately, a properly planned internal link structure will enable search engines to crawl your website and increase its visibility easily. This will lead to more organic traffic and help your website achieve success. With the help of the URLsLab service, creating an effective internal link structure is extremely simple."),e.createElement("h4",null,"How to use the feature?"),e.createElement("p",null,"It's almost effortless and will only take a maximum of five minutes to set up. All you have to do is add a simple shortcode to your theme template, and the module will do the rest of the work for you. Moreover, you can use a setting to conveniently append the shortcode at the end of the page or article."),e.createElement("h4",null,"Shortcode"),e.createElement("code",null,"[urlslab-related-resources]"),e.createElement("p",null,e.createElement("strong",null,"Shortcode Attributes")),e.createElement("table",{border:"1"},e.createElement("tbody",null,e.createElement("tr",null,e.createElement("th",null,"Attribute"),e.createElement("th",null,"Required"),e.createElement("th",null,"Description"),e.createElement("th",null,"Default Value"),e.createElement("th",null,"Possible Values")),e.createElement("tr",null,e.createElement("td",null,"url"),e.createElement("td",null,"optional"),e.createElement("td",null,"URL of the page for which we are searching related articles"),e.createElement("td",null,"The current URL"),e.createElement("td",null," ")),e.createElement("tr",null,e.createElement("td",null,"related-count"),e.createElement("td",null,"optional"),e.createElement("td",null,"The number of items"),e.createElement("td",null,"8"),e.createElement("td",null," ")),e.createElement("tr",null,e.createElement("td",null,"show-image"),e.createElement("td",null,"optional"),e.createElement("td",null,"Show a screenshot of the destionation URL"),e.createElement("td",null,"false"),e.createElement("td",null,"true, false")),e.createElement("tr",null,e.createElement("td",null,"show-summary"),e.createElement("td",null,"optional"),e.createElement("td",null,"Show a summary text"),e.createElement("td",null,"false"),e.createElement("td",null,"true, false")),e.createElement("tr",null,e.createElement("td",null,"default-image"),e.createElement("td",null,"optional"),e.createElement("td",null,"URL of default image used until screenshot image is available"),e.createElement("td",null,"-"),e.createElement("td",null," ")))),e.createElement("h4",null,"Examples"),e.createElement("p",null,e.createElement("strong",null,"Simple Form")),e.createElement("code",null,"[urlslab-related-resources]"),e.createElement("img",{src:h,alt:"Related Resources Simple Version"}),e.createElement("p",null,e.createElement("strong",null,"Complex Form")),e.createElement("code",null,'[urlslab-screenshot url="https://www.liveagent.com" related-count="4" show-image="true" show-summary="true"]'),e.createElement("img",{src:f,alt:"Related Resources Complex Version"}))}function R({moduleId:n}){const{__:a}=d(),s="url-relation",[l,o]=t.useState("overview"),c=new Map([["url-relation",a("Related Articles")]]),i=t.lazy(()=>r(()=>import("./Settings-8g3nba7g7t.js"),["./Settings-8g3nba7g7t.js","../main-8g3nba7g7t.js","./main.css","./datepicker-8g3nba7g7t.js","./datepicker-8g3nba7g7t.css","./Switch-8g3nba7g7t.js","./Switch-8g3nba7g7t.css","./useMutation-8g3nba7g7t.js","./Settings-8g3nba7g7t.css"],import.meta.url)),u=t.lazy(()=>r(()=>import("./URLRelationTable-8g3nba7g7t.js"),["./URLRelationTable-8g3nba7g7t.js","../main-8g3nba7g7t.js","./main.css","./useTableUpdater-8g3nba7g7t.js","./datepicker-8g3nba7g7t.js","./datepicker-8g3nba7g7t.css","./useMutation-8g3nba7g7t.js","./useTableUpdater-8g3nba7g7t.css"],import.meta.url));return e.createElement("div",{className:"urlslab-tableView"},e.createElement(E,{moduleMenu:c,activeMenu:m=>o(m)}),l==="overview"&&e.createElement(p,{moduleId:n},e.createElement(g,null)),l==="url-relation"&&e.createElement(t.Suspense,null,e.createElement(u,{slug:s})),l==="settings"&&e.createElement(t.Suspense,null,e.createElement(i,{className:"fadeInto",settingId:n})))}export{R as default};
