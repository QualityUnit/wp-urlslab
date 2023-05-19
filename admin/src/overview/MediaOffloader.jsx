import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function MediaOffloaderOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>The Media Manager module can be a great tool for improving the performance of any website. With its automatic image enhancement, it can make images smaller while also offloading them to the cloud or a database. This will help reduce the load time when a user accesses a website. In addition to this, it can also generate modern image formats such as WebP and Avif, which are more efficient and provide better compression ratios.</p>
					<p>Moreover, it can also help with SEO by automatically removing broken images from the content, thus improving the overall experience for the users. It can be a great way to ensure your website is optimized and running at its best.</p>
				</section>
			}
		</Overview>
	);
}
