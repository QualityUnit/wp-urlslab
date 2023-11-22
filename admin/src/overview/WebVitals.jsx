import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function WebVitalsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Web Vitals serve as a website health check, ensuring a positive visitor experience. These essential metrics cover the speed at which your main content loads (LCP), the responsiveness of your site to user interactions (FID), and the stability of page elements during the loading process (CLS). Search engines, such as Google, utilize these metrics to evaluate the quality of your site and determine its ranking in search results. </p>
					<p>Why should you prioritize Web Vitals? By improving your site's performance, you enhance visitor satisfaction and encourage longer engagement. For instance, a fast-loading website reduces the likelihood of immediate exits. When your site swiftly responds to user actions and maintains visual stability, visitors can effortlessly navigate and consume content without frustration. A positive user experience often leads to increased conversions and repeat visits.</p>
				</section>
			}
		</Overview>
	);
}
