import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function SerpOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Many websites struggle with maintaining or improving their visibility online. Luckily, URLsLab’s SERP Monitoring tool is here to help. It improves your online visibility by identifying relevant search terms for your industry, organizing them for content creation, and providing competitor insights.</p>
					<p>Analyzing and utilizing your SERP data is one of the most powerful features of the SERP Monitoring module. Paired with the AI Content Generator module, it can help you automatically generate articles based on certain keywords. The functionality allows you to enhance your online visibility by directly utilizing the insights you have gained.</p>
					<p>Furthermore, the SERP Monitoring module allows you to import data from the Google Search Console and compare it with your competitors. This module also groups various keywords with similar relevance and meaning according to SERP. To ensure that the module suits your website’s needs, you can customize and configure its functionalities in the Settings tab.</p>
					<p>Implementing the SERP Monitoring module can lead to more data-driven decision-making processes due to its dashboards filled with valuable information. Additionally, employing this module gives you a competitive advantage, improves your online visibility, and helps attract wider audiences.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>Does the SERP data analysis cost extra credits?</h4>
						<p>Yes, it does. Although fetching data from the Google Search Console doesn’t cost extra, your credit will decrease for every tracked query in SERP.</p>
						<h4>How does the SERP Monitoring module help in improving my website's ranking?</h4>
						<p>The SERP Monitoring module contributes to enhanced SERP scores in multiple ways. In the first place, this module helps you find keywords that are relevant to your company. Secondly, it offers a wealth of data for you to analyze and optimize your SEO strategy. In addition, it enables you to keep track of your direct competitors, allowing you to take a proactive stance against them.</p>
					</section>
			}
		</Overview>
	);
}
