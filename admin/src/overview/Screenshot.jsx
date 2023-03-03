import image1 from '../assets/images/overview/image-1.jpg';

export default function ScreenShotOverview() {
	return (
		<>
			<p>Add screenshot of any URL (internal or external) to content of your website by adding simple shortcode. No manual screenshotting, all updated as the destination URL changes automatically.</p>

			<img src={ image1 } alt="Keywords 1" />

			<h2>Shortcode:</h2>
			<code>
				[urlslab-screenshot alt="Homepage" url="https://www.liveagent.com" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg" screenshot-type="carousel"]
			</code>
			<h3>Shortcode Attrributes</h3>
			<code>
			alt - [optional] value of image alt text attribute<br/>
			url - link to page, which screenshot should be taken<br/>
			width - [optional, default=100%] width attribute of image<br/>
			height - [optional, default=100%] height attribute of image<br/>
			screenshot-type: [optional, default=carousel] carousel, full-page, carousel-thumbnail, full-page-thumbnail<br/>
			</code>
			<h2>Examples</h2>
			Example of shortcode to include screenshot of www.liveagent.com to your website content: <code>[urlslab-screenshot url="https://www.liveagent.com"]</code>
			<h2>How it works</h2>
			<p>To process screenshots can take few hours up to few days. Screenshots are done by service running on www.urlslab.com and your server just checks periodically status of screenshot. You can define how often is screenshot updated in domain schedules.</p>
		</>
	);
}
