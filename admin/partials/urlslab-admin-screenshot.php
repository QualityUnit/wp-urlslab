<?php
?>
<?php
$user = Urlslab_User_Widget::get_instance();
if ( ! isset( $_GET['tab'] ) or ( 'screenshot-widget' == $_GET['tab'] ) ) {

	?>


	<div id="urlslab-active-accordion" class="accordion col-12">

		<!-- Section 1 -->
		<div class="urlslab-accordion-header col-12">
			<div>
				<h3>Explanation</h3>
			</div>
		</div>
		<div class="urlslab-card-container">
			<div class="urlslab-card-content">
				<div class="mar-bottom-1">
					Embed a screenshot of any website into your own website and enhance your UI/UX
				</div>
			</div>
		</div>

		<!-- Section 2 -->
		<div class="urlslab-accordion-header col-12">
			<h3>How to Integrate?</h3>
		</div>
		<div class="urlslab-card-container">
			<div class="mar-bottom-1">
				<?php
				$widget = Urlslab_Available_Widgets::get_instance()->get_widget( 'urlslab-link-enhancer' );
				require plugin_dir_path( __FILE__ ) . 'urlslab-admin-activation-card-header.php';
				?>
				<br class="clear">
				<br class="clear">
				<div>
					Use one of the following shortcodes to generate the screenshot automatically.
				</div>
				<code>
					<?php echo esc_html( '[urlslab-screenshot width="<DEFAULT_WIDTH_OF_SCREENSHOT>" height="<DEFAULT_HEIGHT_OF_SCREENSHOT>" alt="<DEFAULT_ALT_TEXT>" default-image="<DEFAULT_IMAGE_TO_USE>" url="<URL_TO_TAKE_SCREENSHOT_HERE>" screenshot-type="<SCREENSHOT_TYPE_HERE>"]' ); ?>
				</code>
				<h2>Attributes:</h2>
				<ol>
					<li>
						width => width of the image in pixels or % => by default 100% of the parent element
					</li>
					<li>
						height => height of the image in pixels or % => by default 100% of the parent element relative to width
					</li>
					<li>
						alt => alt tag for the screenshot => by default "Screenshot taken by URLSLAB.com"
					</li>
					<li>
						default-image => url of default image when the screenshot hasen't been generated yet =>  nothing (screenshot will not be generated) this is only in case there is a problem in status of the url
					</li>
					<li>
						url => url that user wants to embed the screenshot of => by default "https://www.urlslab.com"
					</li>
					<li>
						screenshot-type => the type of screenshot (It affects the size of the screenshot that is served from urlslab) =>
						<ol>
							<li>
								full-page-thumbnail: a full-page thumbnail-like screenshot of the webpage with <code>200px</code> width
							</li>
							<li>
								carousel-thumbnail: a thumbnail-like screenshot showing only the webpage in viewport with <code>200px</code> width
							</li>
							<li>
								full-page: a full-page screenshot with 1368px width
							</li>
							<li>
								carousel: non-full-page screenshot showing only the webpage in viewport with <code>1368px</code>
							</li>
						</ol>
					</li>
				</ol>
			</div>
		</div>
	</div>

<?php } ?>
