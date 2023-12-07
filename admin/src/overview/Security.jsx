import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function SecurityOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h2>Protect your website against simple attacks</h2>
					<p>Security is a crucial aspect of any website. The Security module helps you protect your website against simple attacks, such as SQL injections and XSS attacks. With URLsLab you can set CSP headers, block attackers visiting random 404 Not Found pages or protect against simple DDoS attacks from single IP address.</p>
				</section>
			}
			{
				section === 'faq' &&
				<section>
				</section>
			}
		</Overview>
	);
}
