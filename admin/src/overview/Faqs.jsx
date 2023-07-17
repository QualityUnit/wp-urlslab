import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function FaqsOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h4>About the module</h4>
					<p>Frequently asked questions generates content in your website with correct schema.org attributes</p>
					<p>Shortcode: [urlslab-faq url="https://www.liveagent.com" count=10]</p>
					<p>Shortcode attributes: </p>
					<p>url - optional, by default is chosen canonical url of current page</p>
					<p>count - optional, number of questions, default value is 8</p>
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
