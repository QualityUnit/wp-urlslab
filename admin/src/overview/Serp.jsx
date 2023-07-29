import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function SerpOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) } noIntegrate>
			{
				section === 'about' &&
				<section>
					<h4>How to start</h4>
					<p>0. Review settings of module - some of the module options are paid, so set the module from the beginning to match your expectations before you start with importing the data. Module imports thousands of lines of data into your Mysql database, think about limits of your database as well when you are choosing the import limits.</p>
					<p>1. Connect Urlslab with your Search Console in URLsLab account: https://www.urlslab.com/dashboard/</p>
					<p>2. In Tab Google Search Console Sites selects sites you want to import.</p>
					<p>3. If you want to analyze Google SERP positions of your competitors, define list of your direct competitora in Tab Domains. It will help with computation of relevant keywords to your business and optimize spendings. (Irelevant queries will not be processed next time)</p>
					<p>4. In Tab Queries you can see list of queries for selected sites. You can filter queries by site, query, position, date, etc. If you have selected correctly who is your direct competitor, you will find here the most relevant queries to your business. Those are the queries you should focus when building new content and and you should build internal links containing those keywords to rank your website higher.</p>
					<p>5. In the Tab URLs you will find the highest ranking urls related to your business. If you are importing the Google SERP data, you will see here also the most valuable URLs of your competitors. Once you know what does your competition well, you can learn and improve your content as well.</p>
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
