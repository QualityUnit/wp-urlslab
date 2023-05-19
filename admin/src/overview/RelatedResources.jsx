import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/related_resources.jpeg';
import image2 from '../assets/images/overview/related_resources_complex.png';

export default function RelatedResourcesOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>Internal link structure is a crucial SEO element of a successful website. It can increase website visibility, cater to visitors' needs, and boost your internal link-building. One of the best ways to create an effective internal link structure is by creating pairs of related pages, known as content clusters. This will provide additional interesting content to visitors and improve your rankings in the search engine results pages.</p>
					<p>When creating related pages, it is essential to ensure they are interconnected in terms of topics and keywords. Fortunately, the AI-powered URLsLab service can help to compute the best pairs of pages with zero effort.</p>
					<p>Ultimately, a properly planned internal link structure will enable search engines to crawl your website and increase its visibility easily. This will lead to more organic traffic and help your website achieve success. With the help of the URLsLab service, creating an effective internal link structure is extremely simple.</p>

				</section>
			}
			{
				section === 'integrate' &&
				<section>
					<h4>How to use the feature?</h4>
					<p>It's almost effortless and will only take a maximum of five minutes to set up. All you have to do is add a simple shortcode to your theme template, and the module will do the rest of the work for you. Moreover, you can use a setting to conveniently append the shortcode at the end of the page or article.</p>

					<h4>Shortcode</h4>
					<code>
						[urlslab-related-resources]
					</code>

					<p><strong>Shortcode Attributes</strong></p>

					<table border="1">
						<tbody>
							<tr>
								<th>Attribute</th>
								<th>Required</th>
								<th>Description</th>
								<th>Default Value</th>
								<th>Possible Values</th>
							</tr>
							<tr>
								<td>url</td>
								<td>optional</td>
								<td>URL of the page for which we are searching related articles</td>
								<td>The current URL</td>
								<td> </td>
							</tr>
							<tr>
								<td>related-count</td>
								<td>optional</td>
								<td>The number of items</td>
								<td>8</td>
								<td> </td>
							</tr>
							<tr>
								<td>show-image</td>
								<td>optional</td>
								<td>Show a screenshot of the destionation URL</td>
								<td>false</td>
								<td>true, false</td>
							</tr>
							<tr>
								<td>image-size</td>
								<td>optional</td>
								<td>Define size of the screenshot image</td>
								<td>carousel-thumbnail</td>
								<td>carousel-thumbnail<br />full-page-thumbnail<br />carousel<br />full-page</td>
							</tr>
							<tr>
								<td>show-summary</td>
								<td>optional</td>
								<td>Show a summary text</td>
								<td>false</td>
								<td>true, false</td>
							</tr>
							<tr>
								<td>default-image</td>
								<td>optional</td>
								<td>URL of default image used until screenshot image is available</td>
								<td>-</td>
								<td> </td>
							</tr>
						</tbody>
					</table>

					<h4>Examples</h4>

					<p><strong>Simple Form</strong></p>
					<code>[urlslab-related-resources]</code>
					<img src={ image1 } alt="Related Resources Simple Version" />

					<p><strong>Complex Form</strong></p>
					<code>[urlslab-related-resources url="https://www.liveagent.com" related-count="4" show-image="true" show-summary="true"]</code>
					<img src={ image2 } alt="Related Resources Complex Version" />
				</section>
			}
		</Overview>
	);
}
