import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function KeywordLinksOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'URLsLab’s Link Building module is an effective tool to manage and monitor the internal keyword linking on your website. Whether you are a website manager or SEO professional, effectively implementing internal links is a significant part of all successful SEO efforts. Let’s look at how the Link Building module can make your work easier and more streamlined.', 'wp-urlslab' ) }</p>
					<p>{ __( 'Through the Link Building module, you can monitor and manage all the keywords throughout your entire website in a convenient and easy-to-navigate interface. In addition to extracting all the keywords from your pages, the Keyword list contains vital information such as the linked URL, language, SEO rank, and usage.', 'wp-urlslab' ) }</p>
					<p>{ __( 'Despite its usefulness in keyword monitoring, the Link Building module is not limited to that. This tool can be customized to meet your specific needs. With customizable features like keyword replacement and keywords import, you can automate essential link-building processes and ensure that your content is well-optimized for maximum search engine visibility.', 'wp-urlslab' ) }</p>
					<p>{ __( 'Using the Link Building module to strengthen the internal links structure on your website comes with numerous benefits, including enhanced SEO rankings, improved user experience, and overall engagement.', 'wp-urlslab' ) }</p>
					<h3>{ __( 'Backlink monitoring', 'wp-urlslab' ) }</h3>
					<p>{ __( 'Backlink monitoring is essential tool when doing outreach. It helps you measure the success of your efforts, maintain the quality of your backlink profile, and quickly respond to any changes that could impact your website’s search engine rankings and overall online authority. It ensures that your link-building strategy is achieving the desired results and allows you to nurture relationships with key influencers and authority sites in your niche.', 'wp-urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'Can I customize the Link Building module?', 'wp-urlslab' ) }</h4>
						<p>{ __( 'Yes, you can set up the Link Building module to suit your needs and requirements. You can customize the module’s functionalities in the Settings tab.', 'wp-urlslab' ) }</p>
						<h4>{ __( 'Can I import keywords using the Link Building module?', 'wp-urlslab' ) }</h4>
						<p>{ __( 'Yes, you can. The Link Building module allows you to import both internal and external keywords.', 'wp-urlslab' ) }</p>
						<h4>{ __( 'How does the Link Building module help improve my website’s SEO ranking?', 'wp-urlslab' ) }</h4>
						<p>{ __( 'By improving your internal links structure, the Link Building module contributes to the overall SEO ranking of your website. Implementing this tool can lead to higher SERP scores, improved organic traffic, and visitor engagement.', 'wp-urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
