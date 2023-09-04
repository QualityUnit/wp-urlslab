import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function CustomHtmlOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Modifying your website’s content or behavior can be a time-consuming process. The Code Injection module is a versatile and powerful solution designed to inject custom HTML code into any section of your web page. This module allows you to seamlessly integrate various third-party applications, such as Google Tag Manager. These applications cannot run scripts without it, which limits your site's functionality.</p>
					<p>With this module, you can define specific rules for loading your custom HTML code, giving you complete control over where your code will be executed. As a result, you can ensure your code has the desired impact on your site's user experience while avoiding any potential conflicts.</p>
					<p>Using URLsLab’s Code Injection module adds a level of versatility to your website. The module allows you to improve user experience while streamlining website operations and saving resources.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>Can I control where my custom HTML code will be executed?</h4>
						<p>Yes, you can. In the module’s Settings tab, you can define each parameter in intricate detail when adding a new rule, ensuring that the custom HTML is executed according to your specifications. Your custom HTML code will be applied to all your pages if you add a default rule.</p>
						<h4>How does the Code Injection module avoid potential conflicts with other codes on my website?</h4>
						<p>With the Code Injection module, you can specify where your custom HTML code will be executed, eliminating conflicts with other elements.</p>
					</section>
			}
		</Overview>
	);
}
