import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function HtmlOptimizerOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests - requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.' ) }</p>
					<p>{ __( 'Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed. The Optimisations module allows you to overview and process CSS and JavaScript files from one convenient interface.' ) }</p>
					<p>{ __( 'Using URLsLab’s Optimisations allows you to optimize such files even without extensive coding skills, making it an accessible solution for website owners and SEO professionals across the board. Using this module results in improved website performance, enhanced SEO rankings, and ultimately better user experience.' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'How does the Optimisations module improve website performance?' ) }</h4>
						<p>{ __( 'By removing content-blocker requests, the Optimisations module assists in boosting your website performance.' ) }</p>
						<h4>{ __( 'Can I use the Optimisations module on a large website?' ) }</h4>
						<p>{ __( 'Yes, all URLsLab modules are designed to integrate with websites of all sizes, including those with high volumes of content and pages.' ) }</p>
					</section>
			}
		</Overview>
	);
}
