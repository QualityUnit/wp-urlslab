import { useState } from 'react';
import { __ } from '@wordpress/i18n/';
import Overview from '../components/OverviewTemplate';

export default function GeneratorOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>{ __( 'Adding fresh and relevant content is a vital part of boosting your online presence and staying relevant in the digital landscape. However, generating new content can be a daunting and time-consuming task. The URLsLab AI Content is the ultimate solution for all websites that value efficient, high-quality content creation. This state-of-the-art AI-powered module simplifies and streamlines content creation with a simple shortcode or Gutenberg integration.', 'urlslab' ) }</p>
					<p>{ __( 'AI Content creates captivating and unique text content for your website using the advanced GPT model version 4 or older version 3.5. This tool generates high-quality content with a simple prompt, whether it’s an H1 tag, URL, or another piece of text. From there, you can further customize the content by specifying the language, and length of the text, or setting up automated grammar correction.', 'urlslab' ) }</p>
					<p>{ __( 'One of the many benefits of this module is its ability to save resources. Content creation that is effective and efficient not only saves time but also frees up your employees from writing each piece manually. Additionally, posting high-quality relevant content frequently helps you gain a competitive advantage in the market, enhance your SEO efforts, and captivate larger audiences.', 'urlslab' ) }</p>
				</section>
			}
			{
				section === 'integrate' &&
				<section>
					<h4>{ __( 'Shortcode', 'urlslab' ) }</h4>
					<code>[urlslab-generator id="1" input="any text or variable"]</code>
					{ __( 'Supported variables:', 'urlslab' ) }
					<ul>
						<li>{ __( 'id - The ID of the generator to use. Required in shortcode.', 'urlslab' ) }</li>
						<li>{ __( 'template - Name of HTML template to use to visualize generated value. Leave empty of the value should be returned as simple text', 'urlslab' ) }</li>
						<li>{ __( 'value - Value variable is used in the template as: {{value}}', 'urlslab' ) }</li>
						<li>{ __( 'page_url - {{page_url}} variable can be used in prompt, url filter or template', 'urlslab' ) }</li>
						<li>{ __( 'page_title - {{page_title}} variable can be used in prompt, url filter or template', 'urlslab' ) }</li>
						<li>{ __( 'domain - {{domain}} variable can be used in prompt, url filter or template', 'urlslab' ) }</li>
						<li>{ __( 'language_code - {{language_code}} variable can be used in prompt, url filter or template', 'urlslab' ) }</li>
						<li>{ __( 'language - {{language}} variable can be used in prompt, url filter or template', 'urlslab' ) }</li>
					</ul>
					{ __( 'if you want to use any other variable in the HTML template or prompt, you can use it as { { variable_name } } and add this as attribute to shortcode', 'urlslab' ) }
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>{ __( 'How can I integrate the AI Content into my website?', 'urlslab' ) }</h4>
						<p>{ __( 'Simply add a WordPress shortcode to your theme template and you’re good to go. You can find the shortcode together with the accompanying variables in the Integration section.', 'urlslab' ) }</p>
						<h4>{ __( 'Does AI Content offer a mass content creation functionality?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, the AI Content module allows users to generate large amounts of uniform content across multiple web pages, saving valuable time and energy. With its customization capabilities, the module produces content that isn’t repetitive but still encompasses your brand voice.', 'urlslab' ) }</p>
						<h4>{ __( 'Can the AI Content create content for any industry or niche?', 'urlslab' ) }</h4>
						<p>{ __( 'Yes, it can. The AI Content module creates content based on the prompts you provide. This way it can write expert articles regardless of your industry or niche.', 'urlslab' ) }</p>
					</section>
			}
		</Overview>
	);
}
