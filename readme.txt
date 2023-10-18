=== URLsLab ===
Contributors: urlslab
Tags: seo, ai, gpt, performance, cache, database, optimizer, faq, serp
Requires at least: 6.0
Tested up to: 6.3
Requires PHP: 7.4
Stable tag: 2.27.9
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Boost SEO and performance with minimal effort.

== Description ==

SEO. MONITOR. OPTIMIZE. AUTOMATE. AI GENERATE.
We missed a lot of features in WordPress, so we created a plugin that helps us to optimize our own websites www.liveagent.com and www.postaffiliatepro.com.
As it is good enough for us, we decided to share it with the world.

Plugin helps us with:
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
In the worst case the page will be corrupted, as HTML pasrser will not be able to reconstruct your page in the same way with originnal HTML errors.
To avoid problems simply make sure all your HTML templates generate valid HTML.

**SUPPORT**
Please let us know in case you discover any issues or incompatibility with other plugins.
https://github.com/QualityUnit/wp-urlslab/issues
To reach our support team by contact form or live chat, please visit https://www.urlslab.com/ or mailto: support@urlslab.com


== PRICING ==
- Plugin is FREE to install and try.
- Most of the features are FREE forever (e.g. Link Building).
- Some plugin modules require paid API calls (e.g. AI Content Generator, SERP Queries Monitoring, etc.)
- Visit www.urlslab.com/pricing for more details about paid features

== Installation ==

= Minimum Requirements =

* WordPress 6.0 or greater
* PHP version 7.4 or greater
* MySQL version 5.7 or greater

= We recommend your host supports: =

* PHP version 8.1 or greater
* MySQL version 5.7 or greater
* WordPress Memory limit of 128 MB or greater (256 MB or higher is preferred)

= Installation =

MANUAL INSTALLATION

To manually install the URLsLab plugin, you'll need to download it and upload it to your web server using your preferred FTP application. For detailed instructions on this process, [check the WordPress codex here](https://wordpress.org/documentation/article/manage-plugins/#manual-plugin-installation).

UPDATING

While automatic updates typically function without any issues, we recommend creating a backup of your site to ensure data safety.

== Screenshots ==
1. URL Monitoring module
2. Link Building module
3. AI Content Generator module
4. SERP Monitoring module
5. Domain Scheduling

== Frequently Asked Questions ==

**How can I update the WordPress plugin?**

To update your WordPress plugin, navigate to your WordPress dashboard and click on "Plugins" in the left-hand menu. If an update is available, you will see a notification under the plugin name. Click on the "Update Now" link and the plugin will automatically update to the latest version. Make sure to backup your website before updating plugins to avoid any potential issues.

**How can I report a bug in the plugin?**

To report a bug in the plugin, you can [create a new issue in the plugin's GitHub repository](https://github.com/QualityUnit/wp-urlslab/issues). Provide as much information as possible about the issue you're experiencing, including the plugin version, WordPress version, and any error messages you've encountered. This will help the developer diagnose and fix the issue more quickly.

**Where can I request a new feature for the plugin?**

To request a new feature for the plugin, you can [submit a new issue in the plugin's GitHub repository](https://github.com/QualityUnit/wp-urlslab/issues), detailing the feature you'd like to see implemented and why you believe it would be beneficial to the plugin's functionality. The plugin developers will review your request and determine if it's something they can add to their development roadmap.

**Will the plugin work with my WordPress theme?**

Most WordPress plugins are designed to work with any theme. However, compatibility issues can sometimes occur due to differences in coding and design. To ensure the plugin works with your theme, check the plugin's documentation for any known compatibility issues. If you're unsure, you can also reach out to the plugin developer or your theme's support team for guidance.

**My site is broken after activating or updating the plugin. What should I do?**

If your website breaks after activating or updating a plugin, first deactivate the plugin to see if it resolves the issue. If your site is still broken, you may need to restore a backup of your website from before the plugin was activated or updated. Once you've restored your site, contact the plugin developer and provide details about the issue so they can investigate and resolve the problem. In the meantime, you may want to look for an alternative plugin with similar functionality.

== Changelog ==

= 2.65.5 - 2023-10-10 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.65.4 - 2023-10-10 =

* Experience a smoother user journey with our under-the-hood enhancements.
