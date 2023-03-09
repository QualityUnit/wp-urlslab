import image1 from '../assets/images/overview/image-1.jpg';

export default function RelatedResourcesOverview() {
	return (
		<>
			<p>Related resources builds automatically for you internal linkbuilding between pages in content cluster. It is important to link similar content on your website together and this feature is generating exactly these connections.</p>

			<img src={ image1 } alt="Keywords 1" />

			<h2>Shortcode:</h2>
			<code>
				[urlslab-related-resources]
			</code>
			<h3>Shortcode Attrributes:</h3>
			<code>
				url - [optional, default=current url] url of page to which we are searching related resources<br/>
				related-count - [optional, default=8] count of most similar pages to input url<br/>
				show-image - [optional, default=false] show screenshot image if is available<br/>
				show-summary - [optional, default=false] show summary text of destination url<br/>
				default-image - [optional, default=''] url of default image used until screenshot image is available for specific url<br/>
			</code>
			<h2>Examples</h2>
			<code>[urlslab-screenshot url="https://www.liveagent.com" related-count=16 show-image=true]</code>
			<h2>How it works</h2>
			<p>www.urlslab.com scans your website (based on your schedule) and index content from your website to our vector database. Once you want to display related resources to current page, plugin loads the most similar pages from www.urlslab.com. All is running on the background in the cron to keep your website fast. Once the data are loaded by cron, shortcode will start showing related resource widget (otherwise it will be empty til the data are processed). Processing can take up to few days.</p>

		</>
	);
}
