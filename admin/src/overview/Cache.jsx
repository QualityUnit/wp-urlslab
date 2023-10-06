import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function CacheOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Search engines prefer websites that load quickly and perform well. Keeping your website performance up is a necessary, although often difficult task. Our state-of-the-art caching module is engineered to boost your website's loading speed and overall performance.</p>
					<h5>Cache rules</h5>
					<p>Your Wordpress sends a Cache-Control HTTP header field with each request, which contains directives or instructions how should browser handle the page cache. These exist in both requests and responses that manage caching in browsers and shared caches such as Proxies and CDNs. The Cache rules feature enables easy configuration and precise adjustment of cache control headers, catering to the specific requirements of your website. You can establish custom caching headers for each file type or section of your website, which can then be used by browsers or your CDN.</p>
					<h5>Page cache</h5>
					<p>The Page Cache feature enables you to decrease the time taken to generate a page. It does this by storing pre-generated pages on the local file system, serving them until they expire. The Page Cache is first created when you access a specific page which then is stored to a file and served from there. The module also supports multiple application server environments, with each server storing its own version of the cache file.</p>
					<h5>Link Preloading</h5>
					<p>UrlsLab plugin optionally enhances the user experience of your website by preloading pages and links. As your users navigate through your site, the plugin silently works in the background, preloading potential pages they might click on next. Here's how it works: if a user is scrolling on one of your landing pages and decides to click on a link, the plugin has already loaded the page they're about to visit. This enables the page to be displayed instantly from the browser cache, eliminating any loading delay. Therefore, preloading ensures that every click on a link swiftly loads the page from cache, providing a seamless browsing experience.</p>
					<h5>CloudFront Support</h5>
					<p>The plugin includes a connector specifically designed for website owners using WordPress installations behind AWS CloudFront CDN. This feature allows you to conveniently purge the cache of a specific page or the entire website as required.</p>
				</section>
			}
			{
				section === 'faq' &&
				<section>
					<h4>Can I specify a cache validity period?</h4>
					<p>Yes, you can. In the Settings section, you can set up the lifespan of cached objects, as well as newly added items. This gives you complete control over the Cache module’s behavior. There is one global setting for page cache validity and optionally you can rewrite default value with custom rules.</p>
					<h4>How can the Cache module help my business save money?</h4>
					<p>By conserving server load and bandwidth, the Cache module can help your business save valuable resources. By delivering cached versions of your pages, the module eliminates the need for retrieving redundant data, which leads to reduced server load and bandwidth consumption.</p>
					<h4>Can the Cache module handle high-traffic websites?</h4>
					<p>Yes, it can. All URLsLab’s modules are designed to seamlessly integrate with websites of all sizes, including those with high content and traffic volumes. We recommend to combine local page cache with any content delivery network (CDN) to reach maximum performance of your website.</p>
					<h4>Does the Cache module require regular maintenance or updates?</h4>
					<p>No, it does not. All you need to do is set up caching rules and the module is good to go. It is also possible to perform a manual action, such as invalidating the cache immediately.</p>
				</section>
			}
		</Overview>
	);
}
