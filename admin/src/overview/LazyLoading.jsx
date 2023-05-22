import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function LazyLoadingOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<h4>About the module</h4>
					<p>Lazy loading is an essential technique for optimising page performance and reducing page load time. By deferring loading of images, videos, iframes, and large content chunks, you can drastically improve the speed at which pages load. This is especially important for those with slower internet connections, who are more likely to be affected by page loading times.</p>
					<p>The main idea behind lazy loading is to delay loading assets until they are actually needed. This means that instead of loading all assets simultaneously, the browser will only load them when they are visible on the user’s screen. It decreases the amount of data that needs to be transferred and therefore increases page loading speed. It also reduces server load, as the server does not have to process every asset simultaneously.</p>
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
						<h4>FAQ</h4>
						<p>Available soon.</p>
					</section>
			}
		</Overview>
	);
}
