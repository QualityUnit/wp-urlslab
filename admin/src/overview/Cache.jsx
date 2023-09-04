import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function CacheOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Keeping your website performance up is a necessary, although often difficult task. Our state-of-the-art caching module is engineered to boost your website's loading speed and overall performance.</p>
					<p>URLsLab’s Cache module pinpoints the most commonly requested resources on your website and effectively stores them. Whether it is frequently accessed files, images, or pages, the module makes them instantly accessible, reducing load times. As a result, redundant data retrieval from the server is eliminated, resulting in a reduction in server load and bandwidth consumption.</p>
					<p>Furthermore, the Cache module is highly adaptable. It allows you to effortlessly configure and fine-tune caching rules to perfectly fit your website's unique needs.</p>
					<p>Additionally, search engines prefer websites that load quickly and perform well. By using URLsLab's Cache module, you can reduce costs while improving SERP scores, user experience, and overall website performance.</p>
				</section>
			}
			{
				section === 'faq' &&
				<section>
					<h4>Can I specify a cache validity period?</h4>
					<p>Yes, you can. In the Settings section, you can set up the lifespan of cached objects, as well as newly added items. This gives you complete control over the Cache module’s behavior.</p>
					<h4>How can the Cache module help my business save money?</h4>
					<p>By conserving server load and bandwidth, the Cache module can help your business save valuable resources. By delivering cached versions of your pages, the module eliminates the need for retrieving redundant data, which leads to reduced server load and bandwidth consumption.</p>
					<h4>Can the Cache module handle high-traffic websites?</h4>
					<p>Yes, it can. All URLsLab’s modules are designed to seamlessly integrate with websites of all sizes, including those with high content and traffic volumes.</p>
					<h4>Does the Cache module require regular maintenance or updates?</h4>
					<p>No, it does not. All you need to do is set up caching rules and the module is good to go. It is also possible to perform a manual action, such as inactivating the cache immediately.</p>
				</section>
			}
		</Overview>
	);
}
