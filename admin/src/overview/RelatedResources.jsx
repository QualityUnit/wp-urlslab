import image1 from '../assets/images/overview/related_resources.jpeg';
import image2 from '../assets/images/overview/related_resources_complex.png';

export default function RelatedResourcesOverview() {
	return (
		<>
			<p>Related resources builds automatically for you internal link building between pages in content cluster.
				It is important to link similar content on your website together and this feature is generating exactly these connections.
			Even it is possible to define relation between your urls manually, plugin can identify and build semantically relevant content relations automatically for you.</p>


			<h3>Shortcode:</h3>
			<code>
				[urlslab-related-resources]
			</code>
			<h3>Shortcode Attrributes:</h3>
			<ul>
				<li>url - (optional, default=current url) url of page to which we are searching related resources</li>
				<li>related-count - (optional, default=8) count of most similar pages to input url</li>
				<li>show-summary - (optional, default=false) show summary text under each link if content is already available</li>
				<li>default-image - (optional, default='') url of default image used until screenshot image is available for specific url</li>
			</ul>
			<h3>Examples</h3>

			<h4>Simple links</h4>
			<p>By adding following shortcode to specific page or template you could see e.g. following list of links related to current page content:</p>
			<code>[urlslab-related-resources]</code>
			<img src={ image1 } alt="Related resources simple example" />

			<h4>More Complex design and values</h4>
			<code>[urlslab-screenshot url="https://www.liveagent.com" related-count=4 show-image=true show-summary=true]</code>
			<img src={ image2 } alt="Related resources complex example" />

			<h3>How it works</h3>
			<p>https://www.urlslab.com scans your website (based on your schedule - see menu Settings - Schedules) and index content from your website to our vector database.<br/>
				Once you want to display related resources to current page, plugin loads the most similar pages from www.urlslab.com<br/>
				All is running on the background in the cron to keep your website fast.<br/>
				Once the data are loaded by cron, shortcode will start showing related resource widget (otherwise it will be empty til the data are processed).<br/>
				Processing can take up to few days.</p>

		</>
	);
}
