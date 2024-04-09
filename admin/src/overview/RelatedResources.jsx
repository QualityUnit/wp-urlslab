import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function RelatedResourcesOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'The internal link structure plays a crucial role in the SEO of every successful website. It helps increase website visibility, caters to visitor’s needs, and enhances your internal link-building overall. One of the most powerful ways of building effective internal link structures is creating pairs of related pages, known as content clusters.', 'urlslab' ) }</p>
					<p>{ __( 'So how can URLsLab help? You don’t need to manually review all your posts to find similarities because the Related Articles module automatically creates content clusters and appends them to your pages. Ultimately, a properly planned and executed internal link structure will enable search engines to crawl your website and increase its visibility easily.', 'urlslab' ) }</p>
					<p>{ __( 'This module is also highly customizable, so the results perfectly fit your website. You can choose the post types and the number of related articles. Additionally, you can set up the Related Articles module to add screenshots and summary texts to your related articles, keeping them informative and engaging.', 'urlslab' ) }</p>
					<p>{ __( 'This will lead to more organic traffic and help your website achieve success. When you use the Related Articles module, you can look forward to multiple benefits including enhanced topic coverage, higher SERP scores, and improved visitor engagement and overall experience.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'integrate' &&
				<section>
					<h4>{ __( 'How to use the feature?', 'urlslab' ) }</h4>
					<p>{ __( 'It’s almost effortless and will only take a maximum of five minutes to set up. All you have to do is add a simple shortcode to your theme template, and the module will do the rest of the work for you. Moreover, you can use a setting to conveniently append the shortcode at the end of the page or article.', 'urlslab' ) }</p>

					<h4>{ __( 'Shortcode', 'urlslab' ) }</h4>
					<code>
						[urlslab-related-resources]
					</code>

					<p><strong>{ __( 'Shortcode Attributes', 'urlslab' ) }</strong></p>

					<table border="1">
						<tbody>
							<tr>
								<th>{ __( 'Attribute', 'urlslab' ) }</th>
								<th>{ __( 'Required', 'urlslab' ) }</th>
								<th>{ __( 'Description', 'urlslab' ) }</th>
								<th>{ __( 'Default Value', 'urlslab' ) }</th>
								<th>{ __( 'Possible Values', 'urlslab' ) }</th>
							</tr>
							<tr>
								<td>{ __( 'url', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'URL of the page for which we are searching related articles', 'urlslab' ) }</td>
								<td>{ __( 'The current URL', 'urlslab' ) }</td>
								<td>{ __( ' ', 'urlslab' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'related-count', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'The number of items', 'urlslab' ) }</td>
								<td>{ __( '8', 'urlslab' ) }</td>
								<td>{ __( ' ', 'urlslab' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'show-image', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'Show a screenshot of the destionation URL', 'urlslab' ) }</td>
								<td>{ __( 'false', 'urlslab' ) }</td>
								<td>{ __( 'true, false', 'urlslab' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'image-size', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'Define size of the screenshot image', 'urlslab' ) }</td>
								<td>{ __( 'carousel-thumbnail', 'urlslab' ) }</td>
								<td>{ __( 'carousel-thumbnail', 'urlslab' ) }<br />{ __( 'full-page-thumbnail', 'urlslab' ) }<br />{ __( 'carousel', 'urlslab' ) }<br />{ __( 'full-page', 'urlslab' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'show-summary', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'Show a summary text', 'urlslab' ) }</td>
								<td>{ __( 'false', 'urlslab' ) }</td>
								<td>{ __( 'true, false', 'urlslab' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'default-image', 'urlslab' ) }</td>
								<td>{ __( 'optional', 'urlslab' ) }</td>
								<td>{ __( 'URL of default image used until screenshot image is available', 'urlslab' ) }</td>
								<td>{ __( '-', 'urlslab' ) }</td>
								<td>{ __( ' ', 'urlslab' ) }</td>
							</tr>
						</tbody>
					</table>

					<h4>{ __( 'Examples', 'urlslab' ) }</h4>

					<p><strong>{ __( 'Simple Form', 'urlslab' ) }</strong></p>
					<code>[urlslab-related-resources]</code>

					<p><strong>{ __( 'Complex Form', 'urlslab' ) }</strong></p>
					<code>[urlslab-related-resources url="https://www.liveagent.com" related-count="4" show-image="true" show-summary="true"]</code>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'How can I integrate the URLsLab Related Articles module into my website?', 'urlslab' ) }</h4>
						<p>{ __( 'To use the functionality, simply add the provided shortcode to your theme template. In addition, some shortcode attributes can be added to extend this module’s functionality.', 'urlslab' ) }</p>
						<h4>{ __( 'How does the module determine which articles are related?', 'urlslab' ) }</h4>
						<p>{ __( 'This AI-powered module groups the articles based on their content rather than keywords. This results in a more cohesive and comprehensive coverage of a particular topic.', 'urlslab' ) }</p>
						<h4>{ __( 'How does the Related Articles module improve the user experience on my website?', 'urlslab' ) }</h4>
						<p>{ __( 'Appending related articles to your content enhances the user experience because it provides a wider and more thorough topic coverage, and encourages exploration. This approach results in increased engagement and reduced bounce rates.', 'urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
