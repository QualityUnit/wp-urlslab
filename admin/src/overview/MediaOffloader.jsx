import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function MediaOffloaderOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>Having a top-notch website performance is a must in the competitive digital sphere. Owners of successful websites can’t afford lags, long loading times, and user-unfriendly pages. However, keeping your website performance up can be a daunting task, especially if you’re running a larger site. Luckily, URLsLab’s Media Manager module can help you out.</p>
					<p>Media Manager is responsible for offloading media on your website which results in shorter loading times and enhanced overall website performance. By storing the media such as images and videos in an external database, the module streamlines the content delivery while preventing data loss in case your hosting server goes down.</p>
					<p>Additionally, URLsLab's Media Manager module offloads media files using CDN support, ensuring they are distributed across a global network of servers, resulting in improved website performance.</p>
					<p>Moreover, Media Manager converts your images into WebP and AVIF formats automatically. Your images will be visually stunning, as well as load quickly, thanks to the superior quality and smaller size of these formats.</p>
					<p>Managing the media on your website is a must if you want to maintain peak website performance and ensure your visitors have a great experience. URLsLab’s Media Manager module helps you do this while conserving bandwidth and saving resources.</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How does the Media Manager module improve website performance?</h4>
						<p>The Media Manager module offloads your media files with CDN support and uses image compression to conserve bandwidth and boost your website performance.</p>
						<h4>How does the Media Manager module prevent data loss?</h4>
						<p>This URLsLab module stores your media files in an external database. This ensures that even if your hosting server goes down unexpectedly, your media files are left untouched. Moreover, this approach serves as a reliable way of backing up your content.</p>
						<h4>Is Media Manager easy to use for someone without technical knowledge?</h4>
						<p>Yes, it is. Like the rest of the modules available in the URLsLab plugin, Media Manager offers an easy-to-use interface that doesn’t require technical expertise. However, if you find yourself struggling with any aspect of the plugin, you can reach out for help by contacting customer support.</p>
					</section>
			}
		</Overview>
	);
}
