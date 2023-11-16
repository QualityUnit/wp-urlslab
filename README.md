# URLsLab - SEO. PERFORMANCE. AI. IN SCALE.

We noticed many features were missing in WordPress, so we created a plugin to optimize our websites, LiveAgent and PostAffiliatePro. Since it worked well for us, we decided to share it with the world.

**The plugin helps us with:**
- SEO - Internal Link Building in Scale
- SEO - AI-Generated Meta Descriptions and Titles
- SEO - AI-Generated Summarized Link Titles
- SEO - Related Articles - Content Cluster Mapping with AI
- SEO - FAQs - Answering 'People Also Ask' Questions through AI-Generated Responses Based on Your Website Content
- SERP - Monitoring Positions for Thousands of Queries
- SERP - Comparing Content Gap Between Your Page and Competitors
- CONTENT - AI-Generated Content in Scale
- CONTENT - Complex Rule-Based HTML Injections
- CONTENT - Large Scale Search and Replace with Complex Rules
- CACHING - Complex Rules for Cache Control Headers
- CACHING - Page Caching
- CACHING - Browser Page Preloading
- CACHING - Domain behind the CDN (CloudFront Support)
- OPTIMIZATION - Web Vitals Monitoring - measure real user web vitals data with one click
- OPTIMIZATION - Automatic Hiding of 404 Error Links and Missing Images
- OPTIMIZATION - Lazy Loading of Images, Videos and HTML Content
- OPTIMIZATION - CSS Optimization
- OPTIMIZATION - JS Optimization
- OPTIMIZATION - Image Optimization
- OPTIMIZATION - Database Optimization
- OFFLOADING - Media Files Offloading with Multi-Server Environments Support
- REDIRECTS - Automatic Redirects with Advanced Rules
- MONITORING - Broken Links and 404 Errors with AI-Generated Redirects
- MONITORING - Internal and External Links Map
- MONITORING - Page Screenshot Capturing with Pixel-to-Pixel Comparison of Changes

## HOW IT WORKS

All modifications to your website are made on the fly. We don't modify your original content in the database or on the disk. In case something goes wrong and you turn off some features of the plugin or the entire plugin, your website will revert back to its original state.

We developed a plugin with a focus on performance and speed. HTML modifications are dependent on HTML DOM parsing. The process works in the following way:
- A visitor requests a page
- WordPress and your other plugins generate the page
- URLsLab catches the HTML output and parses it into a DOM representation
- All URLsLab plugin modules make modifications in the DOM objects in memory for optimal performance
- Once everything is modified, we regenerate the page to HTML and output it to the visitor

The process is efficient from a speed standpoint, but it has one drawback. If your HTML is not valid, we can't parse it and make the modifications. In the worst case, the page will be corrupted, as the HTML parser will not be able to reconstruct your page in the same way with original HTML errors. To avoid problems, simply ensure all your HTML templates generate valid HTML.

## SUPPORT

Please let us know [on the GitHub](https://github.com/QualityUnit/wp-urlslab/issues) if you discover any issues or incompatibilities with other plugins.
If you need any help, you can use the plugin's support forum here on [wordpress.org](https://wordpress.org/support/plugin/urlslab/).

##  PRICING

- The plugin is free to install and try.
- Most of the features are free forever.
- Some plugin modules require paid API calls (AI Content Generator, SERP Queries Monitoring, etc.).
- [Visit our website](https://www.urlslab.com/pricing/) for more details about paid features.

# Dev Contribution
To build the plugin, for wp-content/plugins, run the following commands: 
```
bash ./.github/scripts/build-files-dev.sh
```

# Install URLsLab plugin with `wp cli` command
**Option 1:** Install and activate with `wp cli` in one command:
1. install and activate URLsLab plugin straight from the command line using `wp cli`:
```
wp plugin install urlslab --activate
```
2. Plugin should be installed and activated. Login to WP admin interface and click **URLsLab** menu in the left sidebar of your WordPress admin interface and **configure the plugin**.

**Option 2:** Install plugin with `wp cli` and activate manually in web interface:
1. run command:
```
wp plugin install urlslab
```
You should see output like this:
```
Installing URLsLab (2.98.0)
Downloading installation package from https://downloads.wordpress.org/plugin/urlslab.2.98.0.zip...
Using cached file '/Users/myuser/.wp-cli/cache/plugin/urlslab-2.98.0.zip'...
The authenticity of urlslab.2.98.0.zip could not be verified as no signature was found.
Unpacking the package...
Installing the plugin...
Plugin installed successfully.
Success: Installed 1 of 1 plugins.
```

2. **Login** to your WordPress admin interface and **activate** the URLsLab plugin in the **plugins section**.
3. Visit **URLsLab** menu in the left sidebar of your WordPress admin interface and **configure the plugin**.

# Install URLsLab WordPress plugin with composer
https://wpackagist.org/ mirrors all WordPress plugins and themes as composer packages.
To install URLsLab plugin with composer you need to do few simple steps.
1. In your composer.json file add `wpackagist` repository and require section with `urlslab` plugin:
```
{
    "name": "your-project/your-project-name",
    "description": "My brilliant WordPress site",
    "repositories":[
        {
            "type":"composer",
            "url":"https://wpackagist.org",
            "only": [
                "wpackagist-plugin/*"
            ]
        }
    ],
    "require": {
        "wpackagist-plugin/urlslab":">=2.0.2"
    },
    "extra": {
        "installer-paths": {
            "wp-content/plugins/{$name}/": [
                "type:wordpress-plugin"
            ]
        }
    }
}
```

2. run composer install command:
```
composer install
```
3. Visit **URLsLab menu** in the left sidebar of your WordPress admin interface and **configure the plugin**.
