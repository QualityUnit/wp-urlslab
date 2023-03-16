import image1 from '../assets/images/overview/liveagent_screenshot.jpeg';

export default function ScreenShotOverview() {
	return (
		<>
			<p>The URLslab WordPress plugin (module Screenshot automation) is an essential tool for automating screenshots of any URL (internal or external) in large scale and<br/>
				adding those screenshots to content of your website with just a simple shortcode.
				Screenshots are taken automatically based on defined schedule and are updated as the destination URL changes.</p>
			<p>Add screenshot of any URL (internal or external) to content of your website by adding simple wordpress shortcode. <br/>
				No manual screenshotting, all updated as the destination URL changes automatically.</p>

			<h2>How it works?</h2>
			<p>First you need to schedule processing of screenshots from any domain in Settings - Scheules menu.<br/>
				To process screenshots can take few hours up to few days based on size of your schedules (e.g. What can affect the speed? Ratelimits, number of URLs in sitemap or speed of destination page).<br/>
				Screenshots are done by service running on www.urlslab.com and plugin just syncs periodically status of screenshot.<br/>
				You can define how often is screenshot updated by schedules and also you can define interval how often plugin sync changes from www.urlslab.com to your local database.
			</p>

			<h2>Why we use it?</h2>
			<p>
				All features developped in our plugins are based on our own needs.<br/>
				We developed screenshot automation to replace manual work with automated process for our own websites (<a href="https://www.liveagent.com}">www.liveagent.com</a> and <a href="https://www.postaffiliatepro.com}">www.postaffiliatepro.com</a>) <br/>
				Part of our website describes customer support contacts of various companies and we needed to update screenshots of their websites regularly. (Example: <a href="https://www.liveagent.com/directory/">Customer Service Directory</a>).<br/>
				Another example is affiliate directory where we need to update screenshots of affiliate programs regularly. (Example: <a href="https://www.postaffiliatepro.com/affiliate-program-directory/">Affiliate Directory</a>).<br/>
			</p>

			<h3>How to use this feature?</h3>
			<p>Just add shortcode to your page content or HTML template and plugin will take care of the rest.</p>
			<h4>Shortcode:</h4>
			<code>
				[urlslab-screenshot alt="Homepage" url="https://www.liveagent.com" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg" screenshot-type="carousel"]
			</code>

			<h4>Shortcode Attributes</h4>
			<ul>
				<li>alt - (optional) value of image alt text attribute</li>
				<li>url - link to page, which screenshot should be taken</li>
				<li>width - (optional, default=100%) width attribute of image</li>
				<li>height - (optional, default=100%) height attribute of image</li>
				<li>default-image - optional - URL of default image in case we do not have screenshot yet</li>
				<li>screenshot-type: (optional, default=carousel) carousel, full-page, carousel-thumbnail, full-page-thumbnail</li>
			</ul>
			<h2>Example</h2>
			<p>Example of shortcode to include screenshot of www.liveagent.com to your website content: <code>[urlslab-screenshot url="https://www.liveagent.com"]</code></p>
			<img src={ image1 } alt="Example of screenshot for URL www.liveagent.com" />

		</>
	);
}
