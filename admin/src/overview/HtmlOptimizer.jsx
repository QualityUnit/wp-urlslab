import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function HtmlOptimizerOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests - requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.</p>
					<p>Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed. The Output Optimizer module allows you to overview and process CSS and JavaScript files from one convenient interface.</p>
					<p>Using URLsLab’s Output Optimizer allows you to optimize such files even without extensive coding skills, making it an accessible solution for website owners and SEO professionals across the board. Using this module results in improved website performance, enhanced SEO rankings, and ultimately better user experience.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How does the Output Optimizer module improve website performance?</h4>
						<p>By removing content-blocker requests, the Output Optimizer module assists in boosting your website performance.</p>
						<h4>Can I use the Output Optimizer module on a large website?</h4>
						<p>Yes, all URLsLab modules are designed to integrate with websites of all sizes, including those with high volumes of content and pages.</p>
					</section>
			}
		</Overview>
	);
}
