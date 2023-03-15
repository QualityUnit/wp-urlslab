import image1 from '../assets/images/overview/liveagent_screenshot.jpeg';

export default function ScreenShotOverview() {
	return (
		<>
			<p>The URLslab WordPress plugin is an essential tool for automating screenshots of any URL (internal or external) and adding those screenshots to content of your website with just a simple shortcode.
				Screenshots are taken automatically based on defined schedule and are updated as the destination URL changes.</p>
			<p>Add screenshot of any URL (internal or external) to content of your website by adding simple shortcode. No manual screenshotting, all updated as the destination URL changes automatically.</p>


			<h3>Usage</h3>
			<h4>Shortcode:</h4>
			<code>
				[urlslab-screenshot alt="Homepage" url="https://www.liveagent.com" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg" screenshot-type="carousel"]
			</code>

			<h3>Shortcode Attributes</h3>
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

			<h2>How it works</h2>
			<p>To process screenshots can take few hours up to few days based on your schedule settings (e.g. ratelimits can delay processing significantly).
				Screenshots are done by service running on www.urlslab.com and plugin just checks periodically status of screenshot.
				You can define how often is screenshot updated by custom schedules.</p>
		</>
	);
}
