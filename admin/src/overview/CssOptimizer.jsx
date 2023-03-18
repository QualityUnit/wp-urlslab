import image1 from '../assets/images/overview/image-1.jpg';
import image2 from '../assets/images/overview/image-2.jpg';

export default function CssOptimizerOverview() {
	return (
		<>
			<p>The use of inline CSS instead of external CSS files is a great way to improve page performance and reduce content-blocker requests. Inline CSS is a way to add styling directly to an HTML element, eliminating the need to make additional requests to external CSS files, thus improving page speed.</p>
			<p>The content-blockers are requests that block other requests for some time during page load, and they are rapidly slowing down page performance and the grade in Core Web Vitals.</p>
		</>
	);
}
