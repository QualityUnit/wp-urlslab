import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function SerpOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Many websites struggle with maintaining or improving their visibility online. Luckily, URLsLab’s SEO Insights tool is here to help. It improves your online visibility by identifying relevant search terms for your industry, organizing them for content creation, and providing competitor insights.', 'urlslab' ) }</p>
					<p>{ __( 'Analyzing and utilizing your SERP data is one of the most powerful features of the SEO Insights module. Paired with the AI Content module, it can help you automatically generate articles based on certain keywords. The functionality allows you to enhance your online visibility by directly utilizing the insights you have gained.', 'urlslab' ) }</p>
					<p>{ __( 'Furthermore, the SEO Insights module allows you to import data from the Google Search Console and compare it with your competitors. This module also groups various keywords with similar relevance and meaning according to SERP. To ensure that the module suits your website’s needs, you can customize and configure its functionalities in the Settings tab.', 'urlslab' ) }</p>
					<p>{ __( 'Implementing the SEO Insights module can lead to more data-driven decision-making processes due to its dashboards filled with valuable information. Additionally, employing this module gives you a competitive advantage, improves your online visibility, and helps attract wider audiences.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'Does the SERP data analysis cost extra credits?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, it does. Although fetching data from the Google Search Console doesn’t cost extra, your credit will decrease for every tracked query in SERP.', 'urlslab' ) }</p>
						<h4>{ __( 'How does the SEO Insights module help in improving my website’s ranking?', 'urlslab' ) }</h4>
						<p>{ __( 'The SEO Insights module contributes to enhanced SERP scores in multiple ways. In the first place, this module helps you find keywords that are relevant to your company. Secondly, it offers a wealth of data for you to analyze and optimize your SEO strategy. In addition, it enables you to keep track of your direct competitors, allowing you to take a proactive stance against them.', 'urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
