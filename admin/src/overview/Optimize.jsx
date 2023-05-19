import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function OptimizeOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>The Database Optimizer module is a great tool that helps you to get the most out of your website's performance. By automating the optimization process in the background, you can easily ensure that your website is running at its peak.</p>
					<p>The module automatically deletes post revisions, auto-draft posts and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.</p>
				</section>
			}
		</Overview>
	);
}
