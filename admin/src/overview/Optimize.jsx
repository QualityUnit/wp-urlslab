import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function OptimizeOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } noCheckbox section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h4>About the module</h4>
					<p>The Database Optimiser module is a great tool that helps you to get the most out of your website's performance. By automating the optimisation process in the background, you can easily ensure that your website is running at its peak.</p>
					<p>The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.</p>
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
