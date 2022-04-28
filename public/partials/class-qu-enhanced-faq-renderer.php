<?php

	/**
	 * Provide a public-facing view for the plugin
	 *
	 * This file is used to markup the public-facing aspects of the plugin.
	 *
	 * @link       https://www.liveagent.com
	 * @since      1.0.0
	 *
	 * @package    QU_Enhanced_FAQ
	 * @subpackage QU_Enhanced_FAQ/public/partials
	 * 
	 * 
	 */

function render_qu_enhanced_faq_item( $attr ) {
	// Always define proper Schema microdata at schema.org
	return '
		<div class="qu-enhancedFAQ__item" itemprop="mainEntity" itemscope itemtype="https://schema.org/Question">
			<h3 data-quTarget="' . $attr['targetId'] . '" class="qu-enhancedFAQ__item--question"  itemprop="name" >' . esc_html( $attr['question'] ) . '
			</h3>
			<div data-quTargetId="' . $attr['targetId'] . '" class="qu-enhancedFAQ__item--answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
			<div itemprop="text">' . 
					$attr['content'] //@codingStandardsIgnoreLine 
			. '</div>
			</div>
		</div>
	';
}

register_block_type(
	'qu/enhanced-faq-item',
	array(
		'render_callback' => 'render_qu_enhanced_faq_item',
		// Here goes attributes that are stored in React edit.js part
		'attributes'      => array(
			'targetId' => array(
				'type'    => 'string',
				'default' => '',
			),
			'question' => array(
				'type'    => 'string',
				'default' => __( 'Some default header name', 'qu-enhancedFAQ' ),
			),
			'content'  => array(
				'type'    => 'string',
				'default' => '',
			),
		), 
	),
);

function render_qu_enhanced_faq( $attr, $content ) {
	return '
		<div class="qu-enhancedFAQ" itemscope itemtype="https://schema.org/FAQPage">
			<h2 class="qu-enhancedFAQ__title">' . $attr['title'] . '</h2>' .
			$content
		. '</div>';
}

register_block_type(
	'qu/enhanced-faq',
	array(
		'attributes'      => array(
			'title' => array(
				'type'    => 'string',
				'default' => __( 'FAQ', 'qu-enhancedFAQ' ),
			),
		),
		'render_callback' => 'render_qu_enhanced_faq',
	),
);
