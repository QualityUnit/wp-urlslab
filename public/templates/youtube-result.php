<?php
/*
* Template file to be included in get_video_shortcode_content function
*/

// Always use isset() to check if the variables exist
// and esc_html() to sanitize any output to the browser

// check if the variables are set before you use them
if ( isset( $atts['videoid'] ) ) {
	$video_id = esc_html( $atts['videoid'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['caption_text'] ) ) {
	$caption_text = esc_html( $atts['caption_text'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['summarization'] ) ) {
	$summarization = esc_html( $atts['summarization'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['topics'] ) ) {
	$topics = esc_html( $atts['topics'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['duration'] ) ) {
	$duration = esc_html( $atts['duration'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['title'] ) ) {
	$title = esc_html( $atts['title'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['video_tags'] ) ) {
	$video_tags = esc_html( $atts['video_tags'] ); // use esc_html to sanitize the variable
}

if ( isset( $atts['channel_title'] ) ) {
	$channel_title = esc_html( $atts['channel_title'] ); // use esc_html to sanitize the variable
}
// Now you can output the variables safely
?>

<div class="shortcode-content">


	<!-- You can use the variables anywhere in the template -->
	<!-- More template code goes here... -->
</div>
