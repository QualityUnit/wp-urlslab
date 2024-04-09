import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function SearchAndReplaceOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Managing a website with a large content volume can be a hassle. Luckily, URLsLab’s Search and Replace module can save you time and frustration by automatically mass-replacing URLs and content on the fly.', 'urlslab' ) }</p>
					<p>{ __( 'Using the Search and Replace module is a great way to resolve any issues with your content quickly and efficiently. It also provides a reliable fallback method, in case you want to roll back any actions. All changes are reversible at any time, so you don’t have to worry about making permanent changes to the database.', 'urlslab' ) }</p>
					<p>{ __( 'Overall, the Search and Replace module is also incredibly versatile and can be used for various purposes. From replacing incorrect URLs in the content to correcting typos and other mistakes, the module can help you streamline many manual tasks. With such a wide range of capabilities, the Search and Replace module is an invaluable tool for anyone who needs to quickly and effectively make changes in the content.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'How does the Search and Replace module handle incorrect URLs?', 'urlslab' ) }</h4>
						<p>{ __( 'Incorrect or outdated URLs are in the Search and Replace module’s realm of capabilities. You can replace incorrect URLs in bulk, or one one by. This is especially useful when rebranding your website.', 'urlslab' ) }</p>
						<h4>{ __( 'Can I undo changes made by the Search and Replace module?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, you can. With a single click, you can revert any changes. This way you don’t have to worry about making permanent changes in the database and not having a reliable fallback method.', 'urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
