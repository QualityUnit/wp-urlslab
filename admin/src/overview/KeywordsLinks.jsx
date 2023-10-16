import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function KeywordLinksOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>URLsLab’s Link Building module is an effective tool to manage and monitor the internal keyword linking on your website. Whether you are a website manager or SEO professional, effectively implementing internal links is a significant part of all successful SEO efforts. Let’s look at how the Link Building module can make your work easier and more streamlined.</p>
					<p>Through the Link Building module, you can monitor and manage all the keywords throughout your entire website in a convenient and easy-to-navigate interface. In addition to extracting all the keywords from your pages, the Keyword list contains vital information such as the linked URL, language, SEO rank, and usage.</p>
					<p>Despite its usefulness in keyword monitoring, the Link Building module is not limited to that. This tool can be customized to meet your specific needs. With customizable features like keyword replacement and keywords import, you can automate essential link-building processes and ensure that your content is well-optimized for maximum search engine visibility.</p>
					<p>Using the Link Building module to strengthen the internal links structure on your website comes with numerous benefits, including enhanced SEO rankings, improved user experience, and overall engagement.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>Can I customize the Link Building module?</h4>
						<p>Yes, you can set up the Link Building module to suit your needs and requirements. You can customize the module’s functionalities in the Settings tab.</p>
						<h4>Can I import keywords using the Link Building module?</h4>
						<p>Yes, you can. The Link Building module allows you to import both internal and external keywords.</p>
						<h4>How does the Link Building module help improve my website's SEO ranking?</h4>
						<p>By improving your internal links structure, the Link Building module contributes to the overall SEO ranking of your website. Implementing this tool can lead to higher SERP scores, improved organic traffic, and visitor engagement.</p>
					</section>
			}
		</Overview>
	);
}
