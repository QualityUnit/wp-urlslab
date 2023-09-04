import { useState } from 'react';
import Overview from '../components/OverviewTemplate';

import image1 from '../assets/images/overview/liveagent_screenshot.jpeg';
import editIcon from '../assets/images/icons/icon-edit.svg';

export default function ScreenShotOverview( { moduleId } ) {
	const [ section, setSection ] = useState( 'about' );

	// Custom sections here – will be before FAQ in the menu. Add into customSections prop (not required)

	const sections = [
		{ id: 'section1', title: 'My Section', icon: editIcon },
	];

	return (
		// has also property title for custom title like <Overview moduleId=xxx title="my title"
		// noCheckbox property hides "disable overview" checkbox on modules without tables (just overview and setttings in menu)
		// customSections={ sections }
		<Overview moduleId={ moduleId } section={ ( val ) => setSection( val ) }>
			{
				section === 'about' &&
				<section>
					<p>Screenshots are a great way to grab an audience's attention and make your content more appealing. With URLsLab's Screenshots module, you can easily insert automatically generated screenshots into your content with just a simple shortcode integration. Not only will you save time, but your content will look more professional.</p>
					<p>Using the Screenshots module is especially suitable for larger websites with many pages. Instead of manually taking and inserting a screenshot on each page, the Screenshots module will do it for you. You can also choose from various screenshot types, so the result suits your website perfectly.</p>
					<p>Adding captivating screenshots to your content will not only make your website more visually appealing but will also help increase user engagement, which in turn will boost your SEO ranking.</p>
				</section>
			}

			{
				section === 'integrate' &&
				<section>
					<h4>How to use the feature?</h4>
					<p>It's almost effortless and will only take a maximum of five minutes. All you have to do is add a shortcode to your theme template, and the module will take care of the rest for you.</p>

					<h4>Shortcode</h4>
					<code>
						[urlslab-screenshot screenshot-type="carousel" url="https://www.liveagent.com" alt="Home" width="100%" height="100%" default-image="https://www.yourdomain.com/default_image.jpg"]
					</code>

					<p><strong>Shortcode Attributes</strong></p>

					<table border="1">
						<tbody>
							<tr>
								<th>Attribute</th>
								<th>Required</th>
								<th>Description</th>
								<th>Default Value</th>
								<th>Possible Values</th>
							</tr>
							<tr>
								<td>screenshot-type</td>
								<td>optional</td>
								<td> </td>
								<td>carousel</td>
								<td>carousel, full-page, carousel-thumbnail, full-page-thumbnail</td>
							</tr>
							<tr>
								<td>url</td>
								<td>mandatory</td>
								<td>Link to the page from which a screenshot should be taken.</td>
								<td> </td>
								<td> </td>
							</tr>
							<tr>
								<td>alt</td>
								<td>optional</td>
								<td>Value of the image alt text.</td>
								<td>A summary of the destination URL</td>
								<td> </td>
							</tr>
							<tr>
								<td>width</td>
								<td>optional</td>
								<td>The width of the image.</td>
								<td>100%</td>
								<td> </td>
							</tr>
							<tr>
								<td>height</td>
								<td>optional</td>
								<td>The height of the image.</td>
								<td>100%</td>
								<td> </td>
							</tr>
							<tr>
								<td>default-image</td>
								<td>optional</td>
								<td>The URL of the default image in case we don't yet have the screenshot.</td>
								<td>-</td>
								<td> </td>
							</tr>
						</tbody>
					</table>

					<h4>Example</h4>
					<p>Example of shortcode to include a screenshot of www.liveagent.com to your website content: <code>[urlslab-screenshot url="https://www.liveagent.com"]</code></p>
				</section>
			}
			{
				section === 'faq' &&
					<section>
						<h4>Is the Screenshots module easy to integrate into my website?</h4>
						<p>Yes, the Screenshots module is very easy to add to your website. All you need to do is add a WordPress shortcode to your theme template, and you’re ready to start using this functionality.</p>
						<h4>Can I use the Screenshots module for multiple pages on my website?</h4>
						<p>Yes, you can. URLsLab’s Screenshots module is suitable for websites of all sizes but it can be especially useful for larger sites including many pages.</p>
						<h4>Can I choose the type of screenshot thayt the module generates?</h4>
						<p>The Screenshots module gives you four options to choose from: first screen screenshot, full, page screenshot, first screen thumbnail, and full page thumbnail.</p>
					</section>
			}
		</Overview>
	);
}
