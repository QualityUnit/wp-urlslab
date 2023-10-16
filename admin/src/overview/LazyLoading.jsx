import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function LazyLoadingOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>Lazy loading is an essential technique for optimizing page performance and reducing page load time. Traditionally, all the images and videos are loaded upon accessing a website. By using lazy loading, this content is loaded only when it enters a user’s viewport.</p>
					<p>URLsLab’s Lazy Loading module takes care of lazy loading throughout your website. It ensures that the browser loads all the necessary assets only when they are actually needed. The Lazy Loading module allows you to do this with various pieces of content, including YouTube videos. You can set up and employ the Lazy Loading module from one convenient interface without the need to be skilled in coding.</p>
					<p>So how can the Lazy Loading module help your website? By decreasing the amount of data that needs to be transferred, lazy loading boosts page loading speed. This comes with a plethora of benefits, including higher SEO rankings, improved visitor experience and engagement, and enhanced organic traffic. Moreover, using the Lazy Loading module saves resources, as it reduces server load.</p>
				</section>
			}
			{
				section === 'integrate' &&
					<section>
						<h4>Video data shortcode</h4>
						<code>[urlslab-video videoid="YT-video-ID" attribute="atr_name"]</code>
						<p>Supported video attribute names: title, description, thumbnail_url, published_at, duration, captions, captions_text, channel_title</p>
					</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>What are the SEO benefits of using the Lazy Loading module?</h4>
						<p>Websites with peak performance are usually favored by search engines. When you use lazy loading, you can decrease page loading times, and improve your overall website performance.</p>
						<h4>Does the Lazy Loading allow me to specify which parts of my web page to lazy load?</h4>
						<p>Using URLsLab's Lazy Loading module, you can select which web page parts to lazy load. For controlling content lazy loading, extra parameters can be defined in the content settings.</p>
					</section>
			}
		</Overview>
	);
}
