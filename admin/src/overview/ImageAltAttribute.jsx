import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function ImageAltAttributeOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );
  
	return (
		<Overview moduleId={ moduleId } noCheckbox section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>The Image SEO module is an essential tool for any website owner looking to maximize visibility and ensure that their images are properly optimized for SEO. This module can instantly improve image SEO by automatically adding descriptive alt texts to images.</p>
					<p>Images are an important part of any website, as they can help to draw in visitors and make the website more visually appealing. However, if images are not properly optimized for SEO, they may not show up in search engine results and can be detrimental to the website's overall visibility.</p>
					<p>The module also helps to improve user experience by making it easier for visitors to find and understand the images on the website. Visitors can more easily identify the images and understand their context by automatically adding descriptive alt texts to images. It can make the website more user-friendly, which can help to improve the overall experience for visitors.</p>
				</section>
			}
		</Overview>
	);
}
