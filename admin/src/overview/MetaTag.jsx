import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function MetaTagOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Meta tags are an invaluable tool for all SEO professionals and website owners alike. Although not visible to users, meta tags help search engines understand your website’s content which allows them to index it better.</p>
					<p>URLsLab’s Meta Tags Manager module allows you to control and optimize your website’s meta tags. By doing this you effectively dictate how your website is presented in search results. Besides adding and updating meta tags, the Meta Tags Manager module generates open graph meta tags using your pages’ screenshots. This is an invaluable tool when it comes to boosting your social media posts’ visibility. Moreover, this module includes the “add if missing” functionality which ensures all your pages contain appropriate meta tags.</p>
					<p>It’s no secret that meta tags are the backbone of SEO. Having an effective meta tag optimization strategy is crucial for higher click-through rates and increased organic traffic. With URLsLab’s Meta Tags Manager, you can rest assured that no page will go unoptimized.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How does the Meta Tags Manager module help in improving my website's SEO?</h4>
						<p>Meta tags help search engines understand and index your website. Optimizing these tags is a reliable way to boost your SEO rankings and attract organic traffic. The Meta Tags module ensures that all your pages contain well-optimized meta tags and, therefore, it directly contributes to your SEO efforts.</p>
						<h4>Can I use Meta Tags Manager to update existing meta tags on my website?</h4>
						<p>Yes, you can. You can use the “replace the current value” functionality which allows you to update your meta tags at any time.</p>
					</section>
			}
		</Overview>
	);
}
