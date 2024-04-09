import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function SecurityOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h2>{ __( 'Protect your website against simple attacks', 'urlslab' ) }</h2>
					<p>{ __( 'Security is a crucial aspect of any website. The Security module helps you protect your website against simple attacks, such as SQL injections and XSS attacks. With URLsLab you can set CSP headers, block attackers visiting random 404 Not Found pages or protect against simple DDoS attacks from single IP address.', 'urlslab' ) }</p>
					<h2>{ __( 'Threats', 'urlslab' ) }</h2>
					<h3>{ __( 'DDoS attacks', 'urlslab' ) }</h3>
					<p>{ __( 'A DDoS (Distributed Denial of Service) attack targeting a WordPress installation from a single IP can manifest as an overwhelming number of requests to valid pages, severely straining server resources and potentially causing legitimate traffic to slow down or the site to crash. Simultaneously, this IP may also barrage the site with requests to non-existent pages, leading to a surge in 404 errors, which add unnecessary load to the server as it attempts to handle these invalid requests. The combined effect of high-volume traffic to both valid and invalid pages can disrupt service availability and degrade website performance, necessitating robust security measures like IP-based rate limiting and real-time monitoring to mitigate the threat.', 'urlslab' ) }</p>
					<h3>{ __( 'Mitigating cross-site scripting', 'urlslab' ) }</h3>
					<p>{ __( 'The main purpose of Content Security Policy (CSP) is to reduce or prevent XSS (Cross-Site Scripting) attacks, which take advantage of the browser’s inherent trust in content from the server, allowing malicious scripts to run. CSP enables server admins to specify trusted domains from which executable scripts can be run by the browser, effectively blocking potentially harmful scripts from other sources. For maximum security, sites can use CSP to completely prohibit script execution, fortifying against XSS attacks.', 'urlslab' ) }</p>
					<h3>{ __( 'Mitigating packet sniffing attacks', 'urlslab' ) }</h3>
					<p>{ __( 'To bolster security, servers can dictate not just the permitted domains for content loading but also mandate the use of secure protocols, particularly HTTPS. Comprehensive data security strategies encompass HTTPS enforcement, secure attribute usage for cookies, and HTTP-to-HTTPS automatic redirection. Additionally, employing the Strict-Transport-Security HTTP header forces browsers to communicate with sites exclusively through encrypted connections.', 'urlslab' ) }</p>
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
