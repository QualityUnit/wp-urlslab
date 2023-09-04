import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function RedirectsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>404 errors can dampen your website’s SEO performance and user engagement alike. For larger websites, even identifying broken pages can be a time-consuming and difficult task. Luckily, URLsLab’s Redirects and 404 Monitor module is here to help.</p>
					<p>With this module’s advanced monitoring system, you can effortlessly identify and resolve 404 errors, helping to maintain your site's integrity and keeping it broken-link-free. You can also set up permanent or temporary redirects, ensuring your visitors always land on the correct page. All of this can be done through a simple and easy-to-use interface.</p>
					<p>The Redirects and 404 Monitor module also contributes to your website’s SEO efforts. By proactively rectifying 404 errors, your website is more likely to perform better, both in terms of user experience and SEO rankings.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How does the Redirects and 404 Monitor module identify 404 errors on my website?</h4>
						<p>URLsLab’s Redirects and 404 Monitor module uses an advanced monitoring system to identify 404 errors throughout your website. In the module’s dashboard, you are notified each time it finds a 404 error.</p>
						<h4>Does the Redirects and 404 Monitor module allow me to customize its settings?</h4>
						<p>Yes, it does. With the Redirects and 404 Monitor module's Settings tab, you can customize its functionalities according to your website's needs.</p>
					</section>
			}
		</Overview>
	);
}
