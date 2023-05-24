<?php

// phpcs:disable WordPress

class Urlslab_Meta_Tag extends Urlslab_Widget {
	public const SLUG = 'urlslab-meta-tag';

	public const SETTING_NAME_META_DESCRIPTION_GENERATION = 'urlslab_meta_description_generation';

	public const SETTING_NAME_META_OG_IMAGE_GENERATION = 'urlslab_og_image_generation';
	public const SETTING_NAME_META_OG_TITLE_GENERATION = 'urlslab_og_title_generation';

	public const SETTING_NAME_META_OG_DESC_GENERATION = 'urlslab_og_desc_generation';

	public const ADD_VALUE = 'A';
	public const REPLACE_VALUE = 'R';
	public const NO_CHANGE_VALUE = '';
	public const TWITTER_CARD_SUMMARY_LARGE_IMAGE = 'summary_large_image';
	public const SETTING_NAME_CARD_TYPE = 'urlslab_tw_card_type';
	public const TWITTER_CARD_SUMMARY = 'summary';
	public const TWITTER_CARD_APP = 'app';
	public const TWITTER_CARD_PLAYER = 'player';
	public const SETTING_NAME_TWITTER = 'urlslab_tw';
	public const SETTING_NAME_TW_HANLDE = 'urlslab_tw_handle';
	public const SETTING_NAME_TW_CREATOR = 'urlslab_tw_creator';
	public const SETTING_NAME_TW_PLAYER = 'urlslab_tw_player';
	public const SETTING_NAME_TW_PLAYER_WIDTH = 'urlslab_tw_player_width';
	public const SETTING_NAME_TW_PLAYER_HEIGHT = 'urlslab_tw_player_height';
	public const SETTING_NAME_TW_IPHONE_NAME = 'urlslab_tw_iphone_name';
	public const SETTING_NAME_TW_IPHONE_ID = 'urlslab_tw_iphone_id';
	public const SETTING_NAME_TW_IPHONE_URL = 'urlslab_tw_iphone_url';
	public const SETTING_NAME_TW_IPAD_URL = 'urlslab_tw_ipad_url';
	public const SETTING_NAME_TW_IPAD_ID = 'urlslab_tw_ipad_id';
	public const SETTING_NAME_TW_IPAD_NAME = 'urlslab_tw_ipad_name';
	public const SETTING_NAME_TW_GOOGLEPLAY_NAME = 'urlslab_tw_googleplay_name';
	public const SETTING_NAME_TW_GOOGLEPLAY_ID = 'urlslab_tw_googleplay_id';
	public const SETTING_NAME_TW_GOOGLEPLAY_URL = 'urlslab_tw_googleplay_url';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'urlslab_head_content', $this, 'theContentHook' );
	}

	public function get_widget_slug(): string {
		return Urlslab_Meta_Tag::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Meta Tags Manager' );
	}

	public function get_widget_description(): string {
		return __( 'Make your content go further by adding Meta Tags and maximize its shareability on all social media platforms' );
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_SEO, self::LABEL_FREE, self::LABEL_PAID );
	}

	public function theContentHook( DOMDocument $document ) {
		if ( is_admin() || is_404() || is_user_logged_in() ) {
			return;
		}
		try {
			$head_tag = $document->getElementsByTagName( 'head' )[0];
			if ( empty( $head_tag ) || ! is_object( $head_tag ) ) {
				return;
			}

			try {
				$url_data = Urlslab_Url_Data_Fetcher::get_instance()->load_and_schedule_url( $this->get_current_page_url() );
			} catch ( Exception $e ) {
				return;
			}

			if ( is_object( $url_data ) && $url_data->is_http_valid() ) {
				$summary = $url_data->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_SUMMARY );
				$title   = $url_data->get_summary_text( Urlslab_Link_Enhancer::DESC_TEXT_TITLE );

				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'description', self::SETTING_NAME_META_DESCRIPTION_GENERATION, $summary );

				//Open Graph
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:title', self::SETTING_NAME_META_OG_TITLE_GENERATION, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:description', self::SETTING_NAME_META_OG_DESC_GENERATION, $summary );
				if ( strlen( $url_data->get_screenshot_url() ) && $this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image', self::SETTING_NAME_META_OG_IMAGE_GENERATION, $url_data->get_screenshot_url() ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:width', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 1366 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:height', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 768 );
					$this->set_meta_tag( $document, $head_tag, 'meta', 'property', 'og:image:type', self::SETTING_NAME_META_OG_IMAGE_GENERATION, 'image/jpeg' );
				}

				//Twitter
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:card', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_CARD_TYPE ) );
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_HANLDE ) ) > 0 ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:site', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_HANLDE ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_CREATOR ) ) > 0 ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:creator', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_CREATOR ) );
				}
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:title', self::SETTING_NAME_TWITTER, $title );
				$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:description', self::SETTING_NAME_TWITTER, $summary );
				if ( strlen( $url_data->get_screenshot_url() ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:image', self::SETTING_NAME_TWITTER, $url_data->get_screenshot_url() );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER_WIDTH ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player:width', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER_WIDTH ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_PLAYER_HEIGHT ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:player:height', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_PLAYER_HEIGHT ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPHONE_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:iphone', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPHONE_URL ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_IPAD_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:ipad', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_IPAD_URL ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_NAME ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:name:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_NAME ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_ID ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:id:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_ID ) );
				}
				if ( strlen( $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_URL ) ) ) {
					$this->set_meta_tag( $document, $head_tag, 'meta', 'name', 'twitter:app:url:googleplay', self::SETTING_NAME_TWITTER, $this->get_option( self::SETTING_NAME_TW_GOOGLEPLAY_URL ) );
				}
			}
		} catch ( Exception $e ) {
		}
	}

	public function is_api_key_required(): bool {
		return true;
	}

	protected function add_options() {
		$this->add_options_form_section( 'main', __( 'Meta Tags Settings' ), __( 'The module can generate an enhanced page summary as a description that is more detailed and descriptive than a typical page description. This can help search engines better understand what your page is about, making it easier for users to find you in search results.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_DESCRIPTION_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Meta Description' ),
			__( 'Add or replace the current or missing meta description by summarizing the page\'s content or edited version from the manager.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'main'
		);

		$this->add_options_form_section( 'og', __( 'Open Graph Meta Tags Settings' ), __( 'Open Graph meta tags are essential for improving your content\'s reach and shareability on social media. They will help you stand out on social media with rich previews of your content that are engaging and click-worthy.' ) );

		$this->add_option_definition(
			self::SETTING_NAME_META_OG_TITLE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Open Graph Title' ),
			__( 'Add or replace the current or missing Open Graph title by edited version from the manager.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og'
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_DESC_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Open Graph Description' ),
			__( 'Add or replace the current or missing Open Graph description by summarizing the page\'s content or edited version from the manager' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og'
		);
		$this->add_option_definition(
			self::SETTING_NAME_META_OG_IMAGE_GENERATION,
			self::ADD_VALUE,
			true,
			__( 'Open Graph Image' ),
			__( 'Add or replace the current or missing Open Graph image by screenshot done with URLsLab service (it can take hours or days to generate all of the screenshots).' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'og'
		);

		$this->add_options_form_section( 'twitter', __( 'Twitter Card Meta Tags Settings' ), __( 'Elevate your content\'s social media presence with Twitter Card meta tags, providing rich previews that captivate users and increase shareability.' ) );
		$this->add_option_definition(
			self::SETTING_NAME_TWITTER,
			self::ADD_VALUE,
			true,
			__( 'Twitter Card Meta Tags' ),
			__( 'Add or replace the current or missing Twitter Card meta tags by edited version from the manager.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::NO_CHANGE_VALUE => __( 'No action' ),
				self::ADD_VALUE       => __( 'Add if missing' ),
				self::REPLACE_VALUE   => __( 'Replace the current values' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::NO_CHANGE_VALUE:
					case self::ADD_VALUE:
					case self::REPLACE_VALUE:
						return true;

					default:
						return false;
				}
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_CARD_TYPE,
			self::TWITTER_CARD_SUMMARY_LARGE_IMAGE,
			true,
			__( 'Twitter Card Type' ),
			__( 'Select a default style for the "twitter:card" meta field value.' ),
			self::OPTION_TYPE_LISTBOX,
			array(
				self::TWITTER_CARD_SUMMARY             => __( 'Summary' ),
				self::TWITTER_CARD_SUMMARY_LARGE_IMAGE => __( 'Summary with Large Image' ),
				self::TWITTER_CARD_APP                 => __( 'App' ),
				self::TWITTER_CARD_PLAYER              => __( 'Player' ),
			),
			function( $value ) {
				switch ( $value ) {
					case self::TWITTER_CARD_SUMMARY:
					case self::TWITTER_CARD_SUMMARY_LARGE_IMAGE:
					case self::TWITTER_CARD_APP:
					case self::TWITTER_CARD_PLAYER:
						return true;

					default:
						return false;
				}
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_HANLDE,
			'',
			true,
			__( 'Twitter Username' ),
			__( 'Enter default Twitter username starting with the "@" symbol.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_CREATOR,
			'',
			true,
			__( 'Twitter Creator' ),
			__( 'Enter default Twitter Creator username starting with the "@" symbol.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, '@' ) && 1 < strlen( $value ) && 16 > strlen( $value ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER,
			'',
			true,
			__( 'Twitter Player' ),
			__( 'Enter player iframe URL (HTTPS only) for Player Card use. Leave blank if unsure.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || ( false !== strpos( $value, 'http' ) );
			},
			'twitter'
		);

		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_WIDTH,
			'',
			true,
			__( 'Twitter Player Width' ),
			__( 'Enter Twitter Player iframe width in pixels.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_PLAYER_HEIGHT,
			'',
			true,
			__( 'Twitter Player Height' ),
			__( 'Enter Twitter Player iframe height in pixels.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_numeric( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_NAME,
			'',
			true,
			__( 'iPhone App Name' ),
			__( 'Enter your iPhone app\'s name in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_ID,
			'',
			true,
			__( 'iPhone App ID in the Apple App Store' ),
			__( 'Enter your iPhone App ID in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPHONE_URL,
			'',
			true,
			__( 'iPhone App\'s Custom URL Scheme' ),
			__( 'Enter your iPhone app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_NAME,
			'',
			true,
			__( 'iPad App Name' ),
			__( 'Enter your iPad app\'s name in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_ID,
			'',
			true,
			__( 'iPad App ID in the Apple App Store' ),
			__( 'Enter your iPad App ID in the Apple App Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_IPAD_URL,
			'',
			true,
			__( 'iPad App\'s Custom URL Scheme' ),
			__( 'Enter your iPad app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_NAME,
			'',
			true,
			__( 'Android App Name' ),
			__( 'Enter your Android app\'s name in the Google Play Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_ID,
			'',
			true,
			__( 'App ID in the Google Play Store' ),
			__( 'Enter your Android App ID in the Google Play Store, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);
		$this->add_option_definition(
			self::SETTING_NAME_TW_GOOGLEPLAY_URL,
			'',
			true,
			__( 'Android App\'s Custom URL Scheme' ),
			__( 'Enter your Android app\'s custom URL Scheme, applicable for App Card usage.' ),
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				return empty( $value ) || is_string( $value );
			},
			'twitter'
		);

	}

	private function set_meta_tag( $document, $head_tag, $tag, $attribute_name, $attribute_value, $setting_name, $content_value ): bool {
		if ( ! empty( $this->get_option( $setting_name ) ) && ! empty( $content_value ) ) {
			$xpath     = new DOMXPath( $document );
			$meta_tags = $xpath->query( '//' . $tag . '[@' . $attribute_name . "='{$attribute_value}']" );
			if ( 0 == $meta_tags->count() ) {
				$node = $document->createElement( $tag );
				$node->setAttribute( $attribute_name, $attribute_value );
				$node->setAttribute( 'content', $content_value );
				$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );
				$head_tag->appendChild( $node );

				return true;
			}
			if ( self::REPLACE_VALUE == $this->get_option( $setting_name ) ) {
				foreach ( $meta_tags as $node ) {
					$node->setAttribute( 'content', $content_value );
					$node->setAttribute( 'class', 'urlslab-seo-meta-tag' );

					return true;
				}
			}
		}

		return false;
	}
}
