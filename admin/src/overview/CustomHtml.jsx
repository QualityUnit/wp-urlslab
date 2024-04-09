import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function CustomHtmlOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Modifying your website’s content or behavior can be a time-consuming process. The Code Injection module is a versatile and powerful solution designed to inject custom HTML code into any sectioncof your web page. This module allows you to seamlessly integrate various third-party applications, such as', 'urlslab' ) } <a href="https://tagmanager.google.com/" target="_blank" rel="noreferrer">Google Tag Manager</a>, <a href="https://analytics.google.com/" target="_blank" rel="noreferrer">Google Analytics</a>, <a href="https://www.liveagent.com" target="_blank" rel="noreferrer">{ __( 'live chat', 'urlslab' ) }</a>, <a
						href="https://www.postaffiliatepro.com" target="_blank" rel="noreferrer">{ __( 'affiliate tracking', 'urlslab' ) }</a> { __( 'or any other external service.', 'urlslab' ) }</p>
					<p>{ __( 'With this module, you can define specific rules for loading your custom HTML code, giving you complete control over where your code will be executed. As a result, you can ensure your code has the desired impact on your site’s user experience while avoiding any potential conflicts.', 'urlslab' ) }</p>
					<p>{ __( 'Using URLsLab’s Code Injection module adds a level of versatility to your website. The module allows you to improve user experience while streamlining website operations and saving resources.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
				<section>
					<h4>{ __( 'When would I need this module?', 'urlslab' ) }</h4>
					<p>{ __( 'Example could be adding Google Analytics tracking code or ', 'urlslab' ) }<a href="https://www.liveagent.com">Live
						Chat</a> { __( 'button to your website. Thanks to this module you will just copy and paste the given HTML/javascript to this module and on each page of your website will be included the code automatically. No need to edit Wordpress templates anymore.', 'urlslab' ) }</p>
					<h4>{ __( 'Can I control where my custom HTML code will be injected?', 'urlslab' ) }</h4>
					<p>{ __( 'Yes, you can. In the module’s Settings tab, you can define each parameter in intricate detail when adding a new rule, ensuring that the custom HTML is executed according to your specifications. Your custom HTML code will be applied to all your pages if you add a default rule.', 'urlslab' ) }</p>
					<h4>{ __( 'How does the Code Injection module avoid potential conflicts with other codes on my website?', 'urlslab' ) }</h4>
					<p>{ __( 'With the Code Injection module, you can specify where your custom HTML code will be executed, eliminating conflicts with other elements. Thanks to flexible rules you can cherry-pick pages where will be custom HTML included while other pages will be intact.', 'urlslab' ) }</p>
				</section>
			}
		</Overview>
	);
}
