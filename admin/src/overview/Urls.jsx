import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function UrlsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Invaluable for all website owners, managers, and SEO professionals, the URL Monitoring module helps you manage and monitor all the internal and external links throughout your website without the need for much manual input.' ) }</p>
					<p>{ __( 'So, what are some of the most useful features included in the URLsLab URL Monitoring module? Firstly, using the URL Monitoring module you can hide certain URLs, which gives you complete control over what appears on your site. This module also allows you to easily track any changes made to each URL, providing you with valuable data. Furthermore, you can enable the link validation feature to automatically check and report all broken or invalid links. This way you can rectify faulty links before they make a dent in your SEO efforts.' ) }</p>
					<p>{ __( 'Implementing the URL Monitoring module into your daily website operations can lead to higher SEO rankings, increased organic traffic, improved user experience, and enhanced overall website performance.' ) }</p>
					<h3>{ __( 'Meta tags' ) }</h3>
					<p>{ __( 'Meta tags are an invaluable tool for all SEO professionals and website owners alike. Although not visible to users, meta tags help search engines understand your website’s content which allows them to index it better.' ) }</p>
					<p>{ __( 'URLsLab’s Meta Tags Manager module allows you to control and optimize your website’s meta tags. By doing this you effectively dictate how your website is presented in search results. Besides adding and updating meta tags, the Meta Tags Manager module generates open graph meta tags using your pages’ screenshots. This is an invaluable tool when it comes to boosting your social media posts’ visibility. Moreover, this module includes the “add if missing” functionality which ensures all your pages contain appropriate meta tags.' ) }</p>
					<p>{ __( 'It’s no secret that meta tags are the backbone of SEO. Having an effective meta tag optimization strategy is crucial for higher click-through rates and increased organic traffic. With URLsLab’s Meta Tags Manager, you can rest assured that no page will go unoptimized.' ) }</p>
					<h3>{ __( 'Screenshots' ) }</h3>
					<p>{ __( 'Screenshots are a great way to grab an audience’s attention and make your content more appealing. With URLsLab’s Screenshots module, you can easily insert automatically generated screenshots into your content with just a simple shortcode integration. Not only will you save time, but your content will look more professional.' ) }</p>
					<p>{ __( 'Using the Screenshots module is especially suitable for larger websites with many pages. Instead of manually taking and inserting a screenshot on each page, the Screenshots module will do it for you. You can also choose from various screenshot types, so the result suits your website perfectly.' ) }</p>
					<p>{ __( 'Adding captivating screenshots to your content will not only make your website more visually appealing but will also help increase user engagement, which in turn will boost your SEO ranking.' ) }</p>
					<h4>{ __( 'How to use screenshots?' ) }</h4>
					<p>{ __( 'It’s almost effortless and will only take a maximum of five minutes. All you have to do is add a shortcode to your theme template, and the module will take care of the rest for you.' ) }</p>

					<h4>{ __( 'Shortcode' ) }</h4>
					<code>
						[urlslab-screenshot screenshot-type="carousel" url="https://www.liveagent.com" alt="Home" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg"]
					</code>

					<p><strong>{ __( 'Shortcode Attributes' ) }</strong></p>

					<table border="1">
						<tbody>
							<tr>
								<th>{ __( 'Attribute' ) }</th>
								<th>{ __( 'Required' ) }</th>
								<th>{ __( 'Description' ) }</th>
								<th>{ __( 'Default Value' ) }</th>
								<th>{ __( 'Possible Values' ) }</th>
							</tr>
							<tr>
								<td>{ __( 'screenshot-type' ) }</td>
								<td>{ __( 'optional' ) }</td>
								<td>{ __( ' ' ) }</td>
								<td>{ __( 'carousel' ) }</td>
								<td>{ __( 'carousel, full-page, carousel-thumbnail, full-page-thumbnail' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'url' ) }</td>
								<td>{ __( 'mandatory' ) }</td>
								<td>{ __( 'Link to the page from which a screenshot should be taken.' ) }</td>
								<td>{ __( ' ' ) }</td>
								<td>{ __( ' ' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'alt' ) }</td>
								<td>{ __( 'optional' ) }</td>
								<td>{ __( 'Value of the image alt text.' ) }</td>
								<td>{ __( 'A summary of the destination URL' ) }</td>
								<td>{ __( ' ' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'width' ) }</td>
								<td>{ __( 'optional' ) }</td>
								<td>{ __( 'The width of the image.' ) }</td>
								<td>{ __( '100%' ) }</td>
								<td>{ __( ' ' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'height' ) }</td>
								<td>{ __( 'optional' ) }</td>
								<td>{ __( 'The height of the image.' ) }</td>
								<td>{ __( '100%' ) }</td>
								<td>{ __( ' ' ) }</td>
							</tr>
							<tr>
								<td>{ __( 'default-image' ) }</td>
								<td>{ __( 'optional' ) }</td>
								<td>{ __( 'The URL of the default image in case we don’t yet have the screenshot.' ) }</td>
								<td>{ __( '-' ) }</td>
								<td>{ __( ' ' ) }</td>
							</tr>
						</tbody>
					</table>

					<h4>{ __( 'Example' ) }</h4>
					<p>{ __( 'Example of shortcode to include a screenshot of www.liveagent.com to your website content: ' ) }<code>[urlslab-screenshot url="https://www.liveagent.com"]</code></p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'How does the URL Monitoring module help in improving SEO rankings?' ) }</h4>
						<p>{ __( 'Using a tool such as the URL Monitoring module allows you to automate your link-building processes, and provides valuable insights to help you make data-driven decisions. Remember, the better your link structure is, the more likely search engines are to index your pages favorably, leading to higher rankings and better visibility.' ) }</p>
						<h4>{ __( 'Is the URL Monitoring module easy to implement into daily website operations?' ) }</h4>
						<p>{ __( 'By including all the data in one convenient interface, the URL Monitoring module is very easy to integrate into your daily website operations. All you need to do is configure the module according to your needs, and regularly monitor the data the URL Monitoring module generates.' ) }</p>
						<h4>{ __( 'Is the URL Monitoring module suitable for robust websites with high page and content volume?' ) }</h4>
						<p>{ __( 'The URL Monitoring module is suitable for websites of all sizes. Due to the module’s automation capabilities, however, it can bring the most noticeable benefits to larger websites with a greater volume of pages.' ) }</p>
						<h4>{ __( 'Can the URL Monitoring module improve the user experience on my website?' ) }</h4>
						<p>{ __( 'Yes, it can. This module contributes to a smooth and enjoyable user experience by removing broken links and improving website performance.' ) }</p>
						<h4>{ __( 'Is the Screenshots module easy to integrate into my website?' ) }</h4>
						<p>{ __( 'Yes, the Screenshots module is very easy to add to your website. All you need to do is add a WordPress shortcode to your theme template, and you’re ready to start using this functionality.' ) }</p>
						<h4>{ __( 'Can I use the Screenshots module for multiple pages on my website?' ) }</h4>
						<p>{ __( 'Yes, you can. URLsLab’s Screenshots module is suitable for websites of all sizes but it can be especially useful for larger sites including many pages.' ) }</p>
						<h4>{ __( 'Can I choose the type of screenshot thayt the module generates?' ) }</h4>
						<p>{ __( 'The Screenshots module gives you four options to choose from: first screen screenshot, full, page screenshot, first screen thumbnail, and full page thumbnail.' ) }</p>
						<h4>{ __( 'How does the Meta Tags Manager module help in improving my website’s SEO?' ) }</h4>
						<p>{ __( 'Meta tags help search engines understand and index your website. Optimizing these tags is a reliable way to boost your SEO rankings and attract organic traffic. The Meta Tags module ensures that all your pages contain well-optimized meta tags and, therefore, it directly contributes to your SEO efforts.' ) }</p>
						<h4>{ __( 'Can I use Meta Tags Manager to update existing meta tags on my website?' ) }</h4>
						<p>{ __( 'Yes, you can. You can use the “replace the current value” functionality which allows you to update your meta tags at any time.' ) }</p>
					</section>
			}
		</Overview>
	);
}
