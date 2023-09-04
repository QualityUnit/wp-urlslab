import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function RelatedResourcesOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>The internal link structure plays a crucial role in the SEO of every successful website. It helps increase website visibility, caters to visitors' needs, and enhances your internal link-building overall. One of the most powerful ways of building effective internal link structures is creating pairs of related pages, known as content clusters.</p>
					<p>So how can URLsLab help? You don’t need to manually review all your posts to find similarities because the Related Articles module automatically creates content clusters and appends them to your pages. Ultimately, a properly planned and executed internal link structure will enable search engines to crawl your website and increase its visibility easily.</p>
					<p>This module is also highly customizable, so the results perfectly fit your website. You can choose the post types and the number of related articles. Additionally, you can set up the Related Articles module to add screenshots and summary texts to your related articles, keeping them informative and engaging.</p>
					<p>This will lead to more organic traffic and help your website achieve success. When you use the Related Articles module, you can look forward to multiple benefits including enhanced topic coverage, higher SERP scores, and improved visitor engagement and overall experience.</p>
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

					<p><strong>Complex Form</strong></p>
					<code>[urlslab-related-resources url="https://www.liveagent.com" related-count="4" show-image="true" show-summary="true"]</code>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How can I integrate the URLsLab Related Articles module into my website?</h4>
						<p>To use the functionality, simply add the provided shortcode to your theme template. In addition, some shortcode attributes can be added to extend this module's functionality.</p>
						<h4>How does the module determine which articles are related?</h4>
						<p>This AI-powered module groups the articles based on their content rather than keywords. This results in a more cohesive and comprehensive coverage of a particular topic.</p>
						<h4>How does the Related Articles module improve the user experience on my website?</h4>
						<p>Appending related articles to your content enhances the user experience because it provides a wider and more thorough topic coverage, and encourages exploration. This approach results in increased engagement and reduced bounce rates.</p>
					</section>
			}
		</Overview>
	);
}
