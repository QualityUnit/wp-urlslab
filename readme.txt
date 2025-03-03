=== URLsLab ===
Contributors: urlslab
Tags: seo, ai, gpt, performance, cache, database, optimizer, faq, serp
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 2.27.9
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Boost SEO and performance with minimal effort.

== Description ==

**SEO. PERFORMANCE. AI. IN SCALE.**
We noticed many features were missing in WordPress, so we created a plugin to optimize our websites, LiveAgent and PostAffiliatePro. Since it worked well for us, we decided to share it with the world.

The plugin helps us with:

**SEO**
- Internal Link Building in Scale
- Link Exchange - scheduling links from your website to your partners
- Backlink Monitoring - monitoring backlinks from partners to your website
- AI-Generated Meta Descriptions and Titles
- AI-Generated Summarized Link Titles
- Related Articles - Content Cluster Mapping with AI
- FAQs - Answering 'People Also Ask' Questions through AI-Generated Responses Based on Your Website Content

**SERP**
- Monitoring Positions for Thousands of Queries
- Comparing Content Gap Between Your Page and Competitors

**CONTENT**
- AI-Generated Content in Scale
- Complex Rule-Based HTML Injections
- Large Scale Search and Replace with Complex Rules

**CACHING**
- Complex Rules for Cache Control Headers
- Page Caching
- Browser Page Preloading
- Domain behind the CDN (CloudFront Support)

**SECURITY**
- Setup CSP Headers
- Basic protection against XSS attacks
- Basic protection against DDOS attacks

**OPTIMIZATION**
- Web Vitals Monitoring - measure real user web vitals data with one click
- Automatic Hiding of 404 Error Links and Missing Images
- Lazy Loading of Images, Videos and HTML Content
- CSS Optimization
- JS Optimization
- Image Optimization
- Database Optimization

**OFFLOADING**
 - Media Files Offloading with Multi-Server Environments Support

**REDIRECTS**
 - Automatic Redirects with Advanced Rules

**MONITORING**
- Broken Links and 404 Errors with AI-Generated Redirects
- Internal and External Links Map
- Page Screenshot Capturing with Pixel-to-Pixel Comparison of Changes

= HOW IT WORKS =
All modifications to your website are made on the fly. We don't modify your original content in the database or on the disk. In case something goes wrong and you turn off some features of the plugin or the entire plugin, your website will revert back to its original state.

We developed a plugin with a focus on performance and speed. HTML modifications are dependent on HTML DOM parsing. The process works in the following way:
- A visitor requests a page
- WordPress and your other plugins generate the page
- URLsLab catches the HTML output and parses it into a DOM representation
- All URLsLab plugin modules make modifications in the DOM objects in memory for optimal performance
- Once everything is modified, we regenerate the page to HTML and output it to the visitor

The process is efficient from a speed standpoint, but it has one drawback. If your HTML is not valid, we can't parse it and make the modifications. In the worst case, the page will be corrupted, as the HTML parser will not be able to reconstruct your page in the same way with original HTML errors. To avoid problems, simply ensure all your HTML templates generate valid HTML.

= SUPPORT =
Please let us know [on the GitHub](https://github.com/QualityUnit/wp-urlslab/issues) if you discover any issues or incompatibilities with other plugins.
If you need any help, you can use the plugin's support forum here on [wordpress.org](https://wordpress.org/support/plugin/urlslab/).

= PRICING =
- The plugin is free to install and try.
- Most of the features are free forever.
- Some plugin modules require paid API calls (AI Content, SERP Queries Monitoring, etc.).
- [Visit our website](https://www.urlslab.com/pricing/) for more details about paid features.

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
1. Queries - SEO Insights
2. Content Gap - SEO Insights
3. URL Monitoring
4. AI Content
5. Link Building

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

= 2.130.23 - 2025-3-3 =

* add option to set all languages for link building

= 2.130.21 - 2025-1-16 =

* fixed link building module for wordpress.com installations

= 2.130.20 - 2025-1-16 =

* fixed link to flowhunt.io

= 2.130.17 - 2024-12-18 =

* fixed link building API

= 2.130.16 - 2024-12-5 =

* WPML translations editor update

= 2.130.15 - 2024-12-4 =

* minor fixes in lazy loading

= 2.130.14 - 2024-12-3 =

* new FlowHunt api library

= 2.130.13 - 2024-11-19 =

* new FlowHunt api library

= 2.130.12 - 2024-11-17 =

* automatic WPML translation - translation loops fix

= 2.130.11 - 2024-11-16 =

* automatic WPML translation in old editor

= 2.130.10 - 2024-11-14 =

* option to add more keywords at once for url in link building module

= 2.130.9 - 2024-10-29 =

* minor patches

= 2.130.8 - 2024-10-21 =

* Fixed translations in WPML

= 2.130.7 - 2024-10-18 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.130.0 - 2024-10-15 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.129.5 - 2024-10-14 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.129.1 - 2024-10-11 =

* Content type evaluation for each url

= 2.128.13 - 2024-10-11 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.8 - 2024-10-01 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.7 - 2024-10-01 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.6 - 2024-09-30 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.3 - 2024-09-23 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.2 - 2024-09-21 =

* Fix aws sdk version

= 2.128.1 - 2024-09-20 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.128.0 - 2024-09-20 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.127.0 - 2024-09-18 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.124.0 - 2024-09-18 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.5 - 2024-04-08 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.4 - 2024-03-27 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.3 - 2024-03-25 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.2 - 2024-03-19 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.1 - 2024-03-01 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.121.0 - 2024-02-15 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.120.1 - 2024-01-30 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.120.0 - 2024-01-26 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.119.0 - 2024-01-23 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.112.4 - 2023-12-12 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.112.3 - 2023-12-11 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.112.2 - 2023-12-01 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.112.1 - 2023-11-29 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.112.0 - 2023-11-28 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.101.1 - 2023-11-21 =

* Experience a smoother user journey with our under-the-hood enhancements.

= 2.101.0 - 2023-11-21 =

* Experience a smoother user journey with our under-the-hood enhancements.
