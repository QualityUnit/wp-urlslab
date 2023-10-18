# URLsLab - SEO. SPEED. SCALE. AI.


We missed a lot of features in WordPress, so we created a plugin that helps us to optimize our own websites www.liveagent.com and www.postaffiliatepro.com.
As it is good enough for us, we decided to share it with the world.

**Plugin helps us with:**
- SEO - internal link building in scale
- SEO - image optimization
- SEO - meta descriptions (AI Generated), meta titles
- SEO - link titles (AI Generated Summarizations)
- SEO - related articles - mapping of content clusters with AI
- SEO - FAQ - Cover questions from SERP People also Ask or AI generated FAQ
- SERP - Monitoring positions for thousands of queries
- SERP - Content Gap between your page and competitors
- CONTENT - AI generated content in scale
- CONTENT - HTML Injections with complex rules
- CONTENT - Search and Replace in scale - complext rules
- CACHING - Complex rules for Cache Control headers, no need to edit .htaccess or Apache config
- CACHING - local page caching
- CACHING - preloading pages in browser
- CACHING - CDN (CloudFront support)
- OPTIMIZATION - remove links to 404 and missing images in scale from content
- OPTIMIZATION - lazy loading of images, videos, HTML content
- OPTIMIZATION - CSS optimization (minification, inlining)
- OPTIMIZATION - JS optimization (minification)
- OPTIMIZATION - database optimization
- OFFLOADING - media files offloading (supports complex multi server environments)
- HTTP REDIRECTS - Automate redirects with advanced rules, no need to edit .htaccess
- MONITORING - 404 errors and Not Found pages, AI generated redirects
- MONITORING - broken links
- MONITORING - internal and external links map
- MONITORING - screenshots of pages - pixel to pixel comparison of changes on pages

**HOW IT WORKS**
All modifications to your website are done on the fly, we don't modify your original content in database or on disk.
In case something goes wrong and you switch off some features of plugin or whole plugin, your website will be back to original state.

We developped plugin with focus on performance and speed. 
HTML modifications (e.g. Link Building, HTML Injections, etc.) are dependend on HTML Dom parsing.
The process works in the following way:
- Visitor requests a page
- WordPress and your other plugins generate the page
- URLsLab catch the HTML output and parse it to DOM representation
- All URLsLab plugin modules does the modifications in the DOM objects in memory for the best performance
- Once all is modified, we generate the page again to HTML and output it to visitor.

The process is efficient from the speed point of view, but it has one drawback.
In case your HTML is not valid, we can't parse it and do the modifications.
In the worst case the page will be corrupted, as HTML parser will not be able to reconstruct your page in the same way with originnal HTML errors.
To avoid problems simply make sure all your HTML templates generate valid HTML.


**SUPPORT**

Please let us know in case you discover any issues or incompatibility with other plugins.
https://github.com/QualityUnit/wp-urlslab/issues

To reach our support team by contact form or live chat, please visit https://www.urlslab.com/ or mailto: support@urlslab.com

**PRICING**

- Plugin is FREE to install and use.
- Most of the features are FREE forever (e.g. Link Building, Redirects, Cache, Optimizations, etc.).
- Some plugin modules require paid API calls (e.g. AI Content Generator, SERP Queries Monitoring, etc.)
- Visit www.urlslab.com/pricing for more details about paid features

# Dev Contribution
To build the plugin, for wp-content/plugins, run the following commands: 
```
bash ./.github/scripts/build-files-dev.sh
```
