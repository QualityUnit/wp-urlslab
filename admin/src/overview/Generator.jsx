import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

export default function GeneratorOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	return (
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>Adding fresh and relevant content is a vital part of boosting your online presence and staying relevant in the digital landscape. However, generating new content can be a daunting and time-consuming task. The URLsLab AI Content Generator is the ultimate solution for all websites that value efficient, high-quality content creation. This state-of-the-art AI-powered module simplifies and streamlines content creation with a simple shortcode or Gutenberg integration.</p>
					<p>AI Content Generator creates captivating and unique text content for your website using the advanced GPT model version 4 or older version 3.5. This tool generates high-quality content with a simple prompt, whether it's an H1 tag, URL, or another piece of text. From there, you can further customize the content by specifying the language, and length of the text, or setting up automated grammar correction.</p>
					<p>One of the many benefits of this module is its ability to save resources. Content creation that is effective and efficient not only saves time but also frees up your employees from writing each piece manually. Additionally, posting high-quality relevant content frequently helps you gain a competitive advantage in the market, enhance your SEO efforts, and captivate larger audiences.</p>
				</section>
			}
			{
				section === 'integrate' &&
				<section>
					<h4>Shortcode</h4>
					<code>[urlslab-generator id="1"]</code>
					Supported variables:
					<ul>
						<li>id - The ID of the generator to use. Required in shortcode.</li>
						<li>template - Name of HTML tamplate to use to visualize generated value. Leave empty of the value should be returned as simple text</li>
						<li>value - Value variable is used in the template as: { '\u007B\u007B' }value{ '\u007D\u007D' }</li>
						<li>page_url - { '\u007B\u007B' }page_url{ '\u007D\u007D' } variable can be used in prompt, url filter or template</li>
						<li>page_title - { '\u007B\u007B' }page_title{ '\u007D\u007D' } variable can be used in prompt, url filter or template</li>
						<li>domain - { '\u007B\u007B' }domain{ '\u007D\u007D' } variable can be used in prompt, url filter or template</li>
						<li>language_code - { '\u007B\u007B' }language_code{ '\u007D\u007D' } variable can be used in prompt, url filter or template</li>
						<li>language - { '\u007B\u007B' }language{ '\u007D\u007D' } variable can be used in prompt, url filter or template</li>
						<li>video_captions - { '\u007B\u007B' }video_captions{ '\u007D\u007D' } Video captions with time stamps, variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_captions_text - { '\u007B\u007B' }video_captions{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_title - { '\u007B\u007B' }video_title{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_description - { '\u007B\u007B' }video_description{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_published_at - { '\u007B\u007B' }video_published_at{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_duration - { '\u007B\u007B' }video_duration{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_channel_title - { '\u007B\u007B' }video_channel_title{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						<li>video_tags - { '\u007B\u007B' }video_tags{ '\u007D\u007D' } variable can be used if variable videoid is set in attributes of shortcode</li>
						if you want to use any other variable in the HTML template or prompt, you can use it as { '\u007B\u007B' }variable_name{ '\u007D\u007D' } and add this as attribute to shortcode
					</ul>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>How can I integrate the AI Content Generator into my website?</h4>
						<p>Simply add a WordPress shortcode to your theme template and you’re good to go. You can find the shortcode together with the accompanying variables in the Integration section.</p>
						<h4>Does AI Content Generator offer a mass content creation functionality?</h4>
						<p>Yes, the AI Content Generator module allows users to generate large amounts of uniform content across multiple web pages, saving valuable time and energy. With its customization capabilities, the module produces content that isn’t repetitive but still encompasses your brand voice.</p>
						<h4>Can the AI Content Generator create content for any industry or niche?</h4>
						<p>Yes, it can. The AI Content Generator module creates content based on the prompts you provide. This way it can write expert articles regardless of your industry or niche.</p>
					</section>
			}
		</Overview>
	);
}
