import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function CssOptimizerOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h4>About the module</h4>
					<p>The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed.</p>
					<p>The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>FAQ</h4>
						<p>Available soon.</p>
					</section>
			}
		</Overview>
	);
}
