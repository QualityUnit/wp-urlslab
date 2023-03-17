import image1 from '../assets/images/overview/liveagent_screenshot.jpeg';

export default function ScreenShotOverview() {
	return (
		<>
			<p>Screenshots are a great way to grab an audience's attention and make your content more appealing. With this module, you can easily add automatically generated screenshots via a shortcode into the content. It will not only save you time but will also give your content a professional look.</p>
			<p>Using the Automated Screenshots module can be especially useful for websites with many pages, where manually taking screenshots for each one can be time-consuming. With the module, you can quickly generate screenshots for each page.</p>
			<p>Overall, the module makes screenshots easy to use with zero effort. It is a great way to save time and make your content stand out.</p>

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
