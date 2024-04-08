import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function ImageAltAttributeOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } noCheckbox section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Including captivating imagery in your content is essential for user engagement and SEO alike. The Image SEO module is an essential tool for website owners and SEO professionals looking to maximize their site’s visibility by optimizing for SEO.', 'wp-urlslab' ) }</p>
					<p>{ __( 'Having a website full of appealing images is important, however, if they are not properly optimized for SEO, they may not show up in search engine results. This can be detrimental to the website’s overall visibility and organic traffic. The Image SEO module helps prevent such issues by adding descriptive alt texts to images. This helps search engines comprehend and accurately index images on your site. Moreover, adding alt attributes is also a great way to ensure accessibility for visually-impaired users.', 'wp-urlslab' ) }</p>
					<p>{ __( 'The Image SEO module bridges the gap between user’s perception of visual content and search engines data-driven approach. Additionally, it can make the website more user-friendly, which can help to improve the overall experience for visitors.', 'wp-urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'Does the Image SEO module require any technical knowledge to use?', 'wp-urlslab' ) }</h4>
						<p>{ __( 'All URLsLab’s features are very easy to use and don’t require technical expertise. After you integrate the Image SEO module, you can control everything from an easy-to-navigate interface. However, if you find yourself struggling, you can reach out to the customer support team for help.', 'wp-urlslab' ) }</p>
						<h4>{ __( 'How does the Image SEO module help boost my website’s SEO?', 'wp-urlslab' ) }</h4>
						<p>{ __( 'The Image SEO module generates and inserts alt text to images throughout your website, making them easy for search engines to understand and index. By doing so, you can increase your site’s visibility on SERPs.', 'wp-urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
