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
