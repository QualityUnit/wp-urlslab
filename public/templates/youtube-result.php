<?php
/*
* Template file to be included in get_video_shortcode_content function
*/

// Always use isset() to check if the variables exist
// and esc_html() to sanitize any output to the browser

// check if the variables are set before you use them
if ( isset( $atts['videoid'] ) ) {
	$video_id = $atts['videoid']; // use esc_html to sanitize the variable
}

if ( isset( $atts['caption_text'] ) ) {
	$caption_text = $atts['caption_text']; // use esc_html to sanitize the variable
}

if ( isset( $atts['captions'] ) ) {
	$captions = $atts['captions']; // use esc_html to sanitize the variable
}


if ( isset( $atts['summarization'] ) ) {
	$summarization = $atts['summarization']; // use esc_html to sanitize the variable
}

if ( isset( $atts['topics'] ) ) {
	$topics = $atts['topics']; // use esc_html to sanitize the variable
}

if ( isset( $atts['duration'] ) ) {
	$duration = $atts['duration']; // use esc_html to sanitize the variable
}

if ( isset( $atts['title'] ) ) {
	$youtube_title = $atts['title']; // use esc_html to sanitize the variable
}

if ( isset( $atts['video_tags'] ) ) {
	$video_tags = $atts['video_tags']; // use esc_html to sanitize the variable
}

if ( isset( $atts['channel_title'] ) ) {
	$channel_title = $atts['channel_title']; // use esc_html to sanitize the variable
}

if ( isset( $atts['show_summarization'] ) ) {
	$show_summarization = $atts['show_summarization']; // use esc_html to sanitize the variable
}

if ( isset( $atts['channel_title'] ) ) {
	$show_topics = $atts['show_topics']; // use esc_html to sanitize the variable
}

if ( isset( $atts['transcript_type'] ) ) {
	$transcript_type = $atts['transcript_type']; // use esc_html to sanitize the variable
}

// Now you can output the variables safely
?>

<div class="shortcode-content">
	<h2><?php echo esc_html( $video_id ?? '' ); ?></h2>
	<?php
	if ( 'true' == $show_summarization ) {
		echo esc_html( '<h3>Summarization</h3>' );
		echo esc_html( '<p>' . $summarization ?? '' . '</p>' );
	} 
	?>

	<?php
	if ( 'true' == $show_topics ) {
		echo esc_html( '<h3>Topics</h3>' );
		echo esc_html( '<pre>' . $topics ?? '' . '</pre>' );
	}
	?>

	<?php 
	if ( 'TRANSCRIPT_TEXT' == $transcript_type ) {
		echo esc_html( '<h3>Transcription</h3>' );
		echo esc_html( '<p>' . $caption_text ?? '' . '</p>' );
	} 
	?>

	<?php 
	if ( 'TRANSCRIPT' == $transcript_type ) {
		echo esc_html( '<h3>Transcription</h3>' );
		echo esc_html( '<p>' . $captions ?? '' . '</p>' );
	} 
	?>

	<p><?php echo esc_html( $duration ?? '' ); ?></p>
	<p><?php echo esc_html( $youtube_title ?? '' ); ?></p>
	<?php
	foreach ( $video_tags as $video_tag ) {
		echo esc_html( $video_tag );
	}
	?>
	<p><?php echo esc_html( $channel_title ?? '' ); ?></p>

	<!-- You can use the variables anywhere in the template -->
	<!-- More template code goes here... -->
</div>
