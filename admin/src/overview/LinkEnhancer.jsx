import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function LinkEnhancerOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>URL Monitoring is a robust module included in the URLsLab WordPress plugin’s toolbelt. Invaluable for all website owners, managers, and SEO professionals, the URL Monitoring module helps you manage and monitor all the internal and external links throughout your website without the need for much manual input.</p>
					<p>So, what are some of the most useful features included in the URLsLab URL Monitoring module? Firstly, using the URL Monitoring module you can hide certain URLs, which gives you complete control over what appears on your site. This module also allows you to easily track any changes made to each URL, providing you with valuable data. Furthermore, you can enable the link validation feature to automatically check and report all broken or invalid links. This way you can rectify faulty links before they make a dent in your SEO efforts.</p>
					<p>Implementing the URL Monitoring module into your daily website operations can lead to higher SEO rankings, increased organic traffic, improved user experience, and enhanced overall website performance.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How does the URL Monitoring module help in improving SEO rankings?</h4>
						<p>Using a tool such as the URL Monitoring module allows you to automate your link-building processes, and provides valuable insights to help you make data-driven decisions. Remember, the better your link structure is, the more likely search engines are to index your pages favorably, leading to higher rankings and better visibility.</p>
						<h4>Is the URL Monitoring module easy to implement into daily website operations?</h4>
						<p>By including all the data in one convenient interface, the URL Monitoring module is very easy to integrate into your daily website operations. All you need to do is configure the module according to your needs, and regularly monitor the data the URL Monitoring module generates.</p>
						<h4>Is the URL Monitoring module suitable for robust websites with high page and content volume?</h4>
						<p>The URL Monitoring module is suitable for websites of all sizes. Due to the module's automation capabilities, however, it can bring the most noticeable benefits to larger websites with a greater volume of pages.</p>
						<h4>Can the URL Monitoring module improve the user experience on my website?</h4>
						<p>Yes, it can. This module contributes to a smooth and enjoyable user experience by removing broken links and improving website performance.</p>
					</section>
			}
		</Overview>
	);
}
