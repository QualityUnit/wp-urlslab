import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function OptimizeOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } noCheckbox section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Keeping your database clutter-free is essential for your website’s health. However, performing regular housekeeping manually can take a lot of time. The Database Optimiser automates such processes in the background, so you can ensure that your website is running at its peak.', 'urlslab' ) }</p>
					<p>{ __( 'The module automatically deletes post revisions, auto-draft posts, and posts in the trash, thus freeing up space and resources. In addition, expired transient options and orphaned data in the database can also be cleared, allowing the system to run much more efficiently. This can significantly improve the speed and performance of your website.', 'urlslab' ) }</p>
					<p>{ __( 'Employing URLsLab’s Database Optimiser module comes with a number of benefits, including enhanced website performance, higher SEO rankings, improved user experience, and even better employee productivity.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'What types of data does the Database Optimiser module automatically delete?', 'urlslab' ) }</h4>
						<p>{ __( 'Database Optimiser removes post revisions, auto-draft posts, posts in the trash, expired transient options, and orphaned data.', 'urlslab' ) }</p>
						<h4>{ __( 'Is it possible to control what data the Database Optimiser module removes?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, it is. You can configure the cleanup of various types of data in the Settings tab. To keep some of the data, simply disable their regular removal.', 'urlslab' ) }</p>
						<h4>{ __( 'Can I manually trigger a cleanup process?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, if you want to remove data earlier than the scheduled time, you can trigger a manual cleanup in the module’s Settings tab.', 'urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
