import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function SchedulesOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } title={ 'Domain Scheduling' } noIntegrate>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Monitoring your website’s performance is crucial if you want to stay relevant in the competitive digital landscape. URLsLab’s Domain Scheduling module allows you to do just that. This module is a website analysis tool you can customize to exactly fit your needs. It periodically scans your website, bringing forth valuable insights.' ) }</p>
					<p>{ __( 'The Domain Scheduling module is packed with useful functionalities, such as analyzing text, following links, processing sitemaps, and monitoring changes over time. Besides pre-set website scans, you can trigger a one-time crawl of your website. It also provides you with a daily summary of your resource utilization, as well as a detailed description of your credit expenditure.' ) }</p>
					<p>{ __( 'Additionally, the Domain Scheduling module allows you to crawl your competitors’ websites, shedding light on their efforts, and helping you develop data-driven strategies.' ) }</p>
					<p>{ __( 'The Domain Scheduling module comes with its fair share of advantages. Regular website scans lead to improved site heath, higher SEO rankings, and wider reach. Moreover, keeping tabs on your competitors gives you a competitive edge and aids in developing successful SEO strategies.' ) }</p>
				</section>
			}
			{
				section === 'faq' &&
				<section>
					<h4>{ __( 'Is it possible to schedule a one-time domain scan?' ) }</h4>
					<p>{ __( 'URLsLab’s Schedules feature allows you to schedule a single, thorough domain scan using the “One Time Scheduling” option.' ) }</p>
					<h4>{ __( 'How does the Domain Scheduler help save my resources?' ) }</h4>
					<p>{ __( 'This module generates daily credit-utilization reports, allowing you to better allocate your resources.' ) }</p>
					<h4>{ __( 'How fast does URLsLab crawl my pages?' ) }</h4>
					<p>{ __( 'It depends on your preference. With URLsLab, you can control the scan speed in terms of pages per minute. As a result, you reduce the risk of your website crashing due to excessive scanning, as this feature prevents overloading your server.' ) }</p>
				</section>
			}
		</Overview>
	);
}
