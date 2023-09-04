import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function FaqsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Adding effective user-interface elements such as FAQs to your content is a great way to enhance user experience and boost your SEO efforts. However, if you run a large website with a high content volume, going back to review each post and adding FAQs manually can be a very time-consuming task. Luckily, the Frequently Asked Questions module can do the legwork for you.</p>
					<p>This URLsLab module automates the creation and posting of FAQs while still allowing you complete control over your content. This module can seamlessly generate FAQs and append them to your posts without needing much manual input. However, you can also add custom FAQs and add them to your preferred URLs. Additionally, you can customize how many FAQs will be added to your posts, as well as which types of posts they will be added to.</p>
					<p>Including FAQs in your posts helps visitors quickly find answers and engage with your content, while search engines understand and index it better. The Frequently Asked Questions module is a game-changer for your website operations. Automating such an important element can save you time, and resources, and over time lead to improved SEO rankings and higher organic traffic for your website.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How many FAQs can I add to each post?</h4>
						<p>By default, the Frequently Asked Questions module generates 8 questions and answers, however, you can change this number in the Settings tab.</p>
						<h4>Will the FAQs be relevant to the content of my posts?</h4>
						<p>Yes, the automatically generated FAQs will be based on your post, and therefore, they will be contextually relevant. On top of that, you can create custom FAQs for each post.</p>
						<h4>How does the Frequently Asked Questions module enhance user experience on my website?</h4>
						<p>In the online space, convenience is everything. Adding FAQs to your posts allows users to find information quickly and easily. Furthermore, the more user-oriented elements you add to your website, the more engaged your visitors will be.</p>
					</section>
			}
		</Overview>
	);
}
