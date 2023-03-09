import image1 from '../assets/images/overview/image-1.jpg';

export default function RelatedResourcesOverview() {
	return (
		<>
			<p>Related resources builds automatically for you internal linkbuilding between pages in content cluster. It is important to link similar content on your website together and this feature is generating exactly these connections.</p>

			<img src={ image1 } alt="Keywords 1" />

			<h3>Shortcode:</h3>
			<code>
				[urlslab-related-resources]
			</code>
			<h3>Shortcode Attrributes:</h3>
			<ul>
				<li>url - (optional, default=current url) url of page to which we are searching related resources</li>
				<li>related-count - (optional, default=8) count of most similar pages to input url</li>
				<li>show-image - (optional, default=false) show screenshot image if is available</li>
				<li>default-image - (optional, default='') url of default image used until screenshot image is available for specific url</li>
			</ul>
			<h3>Examples</h3>
			<code>[urlslab-screenshot url="https://www.liveagent.com" related-count=16 show-image=true]</code>
			<h3>How it works</h3>
			<p>www.urlslab.com scans your website (based on your schedule) and index content from your website to our vector database. Once you want to display related resources to current page, plugin loads the most similar pages from www.urlslab.com. All is running on the background in the cron to keep your website fast. Once the data are loaded by cron, shortcode will start showing related resource widget (otherwise it will be empty til the data are processed). Processing can take up to few days.</p>

		</>
	);
}
