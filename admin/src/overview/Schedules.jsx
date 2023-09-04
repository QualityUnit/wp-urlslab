import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function SchedulesOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } title="Urlslab service">
			{
				section === 'about' &&
				<section>
					<h4>How can paid service help my Wordpress?</h4>
					<p>Even you can use our plugin for free and laverage from multiple cool features, integration with our paid service will boost your web in the eyes of search engines thanks to following features:</p>
					<p>Here should be explanation how credits work, what type of actions we charge and why sometime we return the credit to user (e.g. when we discover, that url doesn't need to be crawled</p>
				</section>
			}
		</Overview>
	);
}
