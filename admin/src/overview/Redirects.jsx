import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function RedirectsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h4>About the module</h4>
					<p>Enhance your website's user experience and search engine optimisation with the essential Redirects and 404 Monitor module. Effortlessly identify and resolve 404 errors, maintain your site's integrity, and keep broken links at bay.</p>
					<p>Featuring a user-friendly interface, this module simplifies the process of creating and managing redirects. Set up permanent or temporary redirects with ease, ensuring your visitors always land on the correct page. Stay informed of any 404 errors with the advanced monitoring system, allowing you to promptly address issues.</p>
					<p>Don't let broken links and 404 errors hinder your website's performance. Equip your site with the Redirects and 404 Monitor module, and experience the benefits of a seamless browsing experience for users and improved SEO for your website.</p>
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
