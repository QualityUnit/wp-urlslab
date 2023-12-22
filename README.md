# URLsLab = ( SEO + PERFORMANCE + AI ) * IN_SCALE.

We noticed many features were missing in WordPress, so we created a plugin to optimize our websites, LiveAgent and PostAffiliatePro. Since it worked well for us, we decided to share it with the world.

**The plugin helps us with:**
- SEO - Internal Link Building in Scale
- SEO - Link Exchange - scheduling links from your website to your partners
- SEO - Backlink Monitoring - monitoring backlinks from partners to your website
- SEO - AI-Generated Meta Descriptions and Titles
- SEO - AI-Generated Summarized Link Titles
- SEO - Related Articles - Content Cluster Mapping with AI
- SEO - FAQs - Answering 'People Also Ask' Questions through AI-Generated Responses Based on Your Website Content
- SERP - Monitoring Positions for Thousands of Queries
- SERP - Content Gap between Your Page and Competitors
- SERP - Keyword Frequncy and heatmap analyses of top ranking pages for keyword 
- CONTENT - AI-Generated Content in Scale
- CONTENT - Complex Rule-Based HTML Injections
- CONTENT - Large Scale Search and Replace with Complex Rules
- CACHING - Complex Rules for Cache Control Headers
- CACHING - Page Caching
- CACHING - Browser Page Preloading
- CACHING - Domain behind the CDN (CloudFront Support)
- SECURITY - CSP - Content Security Policy Setup
- SECURITY - Basic DDOS attacks protection (attacks on 404 page)
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
### HTML modifications
All modifications to your website are made on the fly. We don't modify your original content in the database or on the disk. In case something goes wrong and you turn off some features of the plugin or the entire plugin, your website will revert back to its original state.
We developed a plugin with a focus on performance and speed. HTML modifications are dependent on HTML DOM parsing. The process works in the following way:
- A visitor requests a page
- WordPress and your other plugins generate the page
- URLsLab catches the HTML output and parses it into a DOM representation
- All URLsLab plugin modules make modifications in the DOM objects in memory for optimal performance
- Once everything is modified, we regenerate the page to HTML and output it to the visitor

The process is efficient from a speed standpoint, but it has one drawback. If your HTML is not valid, we can't parse it and make the modifications. In the worst case, the page will be corrupted, as the HTML parser will not be able to reconstruct your page in the same way with original HTML errors. To avoid problems, simply ensure all your HTML templates generate valid HTML.

### How to start SEO Insights
Standard SERP monitoring tools helps you to monitor hundreds search query positions.
With URLsLab you get the ability to monitor hundred thousands search queries and analyze just queries relevant to your business thanks to unique matching of intersections of queries with your competition.
To get perfect results follow these steps:
1. Visit URLsLab > SEO Insights > Settings and disable checkbox **Synchronization of SERP Data**. We will activate it once we prepare set of competitors.
2. Visit URLsLab > SEO Insights > Queries and add up to 5 the most important keywords for your business. (e.g. Imagine you are selling [multichannel help desk software](https://www.liveagent.com), you would enter keywords:
- help desk software
- live chat software
- call center software
- ticketing system
- knowledge base software
3. If you entered up to 5 SERP queries, they should be analyzed within few seconds and you should see data about your position for these queries - it is possible, that you are not ranking for these keywords yet, but it is all right - you will get there :).
4. Visit URLsLab > SEO Insights > Domains and categorize domains you see in the list into competitor, my domains or irrelevant domains. (e.g. domain like youtube, instagram, twitter or facebook you can categorize as Ignored. Domains you recognize as your direct competitors you can categorize as **Competitor**. Domains you own you can categorize as **My Domain**.) It would be great to identify at least 10 competitors to your business, later you can come back to this tab and categorize some more competitors if we process few more queries in your installation.
5. Visit again URLsLab > SEO Insights > Settings and activate checkboxes:
- **Synchronization of SERP Data**
- **Synchronization of Query Volumes Data**
- **Import "People Also Search For" as New Query**
- **Import "People Also Ask" as New Query**
- **Import FAQ Queries as Questions Into FAQ Module**.
- **Unrelated Query Restriction** - set to 5 (if you identified at least 10 competitors in previous step)
- **Limit import of new queries** - set to reasonable number (e.g. 1000 or more - check pricing page for more details about the costs of API calls). e.g. in our installation we are monitoring about 500.000 keywords to map content clusters and keywords people search.
Now reprocess the first queries you entered in first step (The most simple way is to delete them and add them again).

Plugin will start to process all queries search for their positions in search results on background by cron task. 
You can speed up the cron execution in the top right corner of the URLsLab plugin admin page.

## SUPPORT

Please let us know [on the GitHub](https://github.com/QualityUnit/wp-urlslab/issues) if you discover any issues or incompatibilities with other plugins.
If you need any help, you can use the plugin's support forum here on [wordpress.org](https://wordpress.org/support/plugin/urlslab/).

##  PRICING

- The plugin is free to install and try.
- Most of the features are free forever.
- Some plugin modules require paid API calls (AI Content, SERP Queries Monitoring, etc.).
- [Visit our website](https://www.urlslab.com/pricing/) for more details about paid features.

#  INSTALLATION

## Install URLsLab plugin from WordPress marketplace
The simplest way to install URLsLab plugin is to find it in WordPress Marketplace. Just follow these steps:
1. Login to your WordPress admin interface and click **Plugins** menu in the left sidebar of your WordPress admin interface.
2. Click **Add New** button at the top of the page.
3. Search for **URLsLab** plugin.
4. Click **Install Now** button.

## Install URLsLab plugin from ZIP file
1. Download the latest URLsLab plugin ZIP file from [URLsLab Releases](https://github.com/QualityUnit/wp-urlslab/releases). Brave can try even Beta releases :)
2. Login to your WordPress admin interface and click **Plugins** menu in the left sidebar of your WordPress admin interface.
3. Click **Add New** button at the top of the page.
4. Click **Upload Plugin** button at the top of the page.
5. Click **Choose File** button and select the downloaded URLsLab plugin ZIP file.
6. Click **Install Now** button.
7. Plugin should be installed. Login to WP admin interface and click **URLsLab** menu in the left sidebar of your WordPress admin interface and **configure the plugin**.

## Install URLsLab plugin with `wp cli` command
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

## Install URLsLab WordPress plugin with composer
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

## Install URLsLab WordPress plugin with Git (Not recommended)
You can also install URLsLab plugin with Git. It is not recommended, because of special post-build scripts, which are executed after plugin installation.
URLsLab plugin needs to make sure that there will be no dependency conflicts with other plugins, that are installed in your installation. hence, an additional vendor directory `vendor_prefixed` is built and scoped, in order to avoid dependency conflict. these are the steps to install using git:
1. Clone the repository into your plugins directory:
```
git clone https://github.com/QualityUnit/wp-urlslab.git
```
2. Run the following command in the checked out plugin directory:
```
bash ./.github/scripts/build-files.sh
```

# Dev Contribution
Pull requests or feature suggestions are welcome. To start development clone the repository and run the following command in the checked out plugin directory:
```
bash ./.github/scripts/build-files-dev.sh
```
It will build all required files and download all required composer libraries.
