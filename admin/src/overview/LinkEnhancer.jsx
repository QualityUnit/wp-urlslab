import { useState } from 'react';
import Overview from '../components/OverviewTemplate';
import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function LinkEnhancerOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>The Links Manager module is a must-have for any website owner. It is designed to help you monitor and maintain all your internal and external links.</p>
					<p>The module can also hide all invalid and non-SEO-friendly links. This is a great feature as it can help to improve your website’s overall performance in search engine rankings. Plus, it eliminates any risks connected with having broken links. It is especially important as it can have a detrimental effect on your organic traffic.</p>
					<p>Overall, it is a great tool that can help ensure that all your links are working properly and that your website runs optimally. As a result, it can improve the user experience and protect your website from any potential risks associated with broken links.</p>
				</section>
			}
		</Overview>
	);
}
