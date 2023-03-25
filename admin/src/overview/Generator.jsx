
export default function GeneratorOverview() {
	return (
		<>
			<p>Generate with AI content in your website with simple shortcode. AI takes into consideration the content of your website related to the query.</p>
			<p>
				Shortcode
				<code>[urlslab-generator template="templates/summary.php" query="Summarize text from context and return output in language |$lang|" context="https://www.liveagent.com,https://www.postaffiliatepro" default-value="This is my default summarization ..."]</code>
			</p>
		</>
	);
}
