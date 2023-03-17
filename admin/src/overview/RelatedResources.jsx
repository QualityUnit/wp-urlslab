import image1 from '../assets/images/overview/related_resources.jpeg';
import image2 from '../assets/images/overview/related_resources_complex.png';

export default function RelatedResourcesOverview() {
	return (
		<>
			<p>Internal link structure is a crucial SEO element of a successful website. It can increase website visibility, cater to visitors' needs, and boost your internal link-building. One of the best ways to create an effective internal link structure is by creating pairs of related pages, known as content clusters. This will provide additional interesting content to visitors and improve your rankings in the search engine results pages.</p>
			<p>When creating related pages, it is essential to ensure they are interconnected in terms of topics and keywords. Fortunately, the AI-powered URLsLab service can help to compute the best pairs of pages with zero effort.</p>
			<p>Ultimately, a properly planned internal link structure will enable search engines to crawl your website and increase its visibility easily. This will lead to more organic traffic and help your website achieve success. With the help of the URLsLab service, creating an effective internal link structure is extremely simple.</p>


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
		</>
	);
}
