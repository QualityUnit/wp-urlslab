<?php

require_once URLSLAB_PLUGIN_DIR . '/includes/cron/class-urlslab-cron.php';

class Urlslab_Update_Url_Http_Status_Cron extends Urlslab_Cron {
	public function get_description(): string {
		return __( 'Checking HTTP status of scheduled URLs in plugin database', 'urlslab' );
	}

	protected function execute(): bool {
		if ( ! Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Link_Enhancer::SLUG ) ) {
			return false;
		}

		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Link_Enhancer::SLUG );
		if ( ! $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_VALIDATE_LINKS ) ) {
			return false;
		}

		global $wpdb;
		$url_row = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . URLSLAB_URLS_TABLE . ' WHERE http_status = %d OR (http_status > 0 AND update_http_date < %s) OR (http_status = %d AND update_http_date < %s) ORDER BY update_http_date LIMIT 1', // phpcs:ignore
				Urlslab_Url_Row::HTTP_STATUS_NOT_PROCESSED,
				Urlslab_Data::get_now( time() - $widget->get_option( Urlslab_Link_Enhancer::SETTING_NAME_LINK_HTTP_STATUS_VALIDATION_INTERVAL ) ),                                                                  // PENDING urls will be retried in one hour again
				Urlslab_Url_Row::HTTP_STATUS_PENDING,
				Urlslab_Data::get_now( time() - 3600 )
			),
			ARRAY_A
		);
		if ( empty( $url_row ) ) {
			return false;
		}

		$url = new Urlslab_Url_Row( $url_row );

		if ( ! $url->get_url()->is_url_valid() ) {
			$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_CLIENT_ERROR );
			$url->update();

			return true;
		}

		if ( $url->get_url()->is_url_blacklisted() ) {
			$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_OK );
			$url->update();

			return true;
		}

		if ( ! strlen( trim( $url->get_url_title() ) ) ) {
			$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_h1() ) ) ) {
			$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
		}
		if ( ! strlen( trim( $url->get_url_meta_description() ) ) ) {
			$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
		}
		$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_PENDING );
		$url->update();    // lock the entry, so no other process will start working on it

		return $this->updateUrl( $url );
	}

	private function get_final_redirect_url( $url, $hop = 1 ): string {
		$response = wp_remote_head( $url );

		if ( is_wp_error( $response ) ) {
			return $url;
		}

		$response_code = (int) wp_remote_retrieve_response_code( $response );

		if ( 15 > $hop && 300 < $response_code && 399 > $response_code ) {
			/** @var WP_HTTP_Requests_Response $http_response */
			$http_response = $response['http_response'];
			if ( strlen( $http_response->get_response_object()->url ) && $url !== $http_response->get_response_object()->url ) {
				return $this->get_final_redirect_url( $http_response->get_response_object()->url, $hop + 1 );
			} else {
				return $url;
			}
		}

		return $url;
	}

	/**
	 * @param $url
	 *
	 * @return object
	 */
	function check_url_status( $url ) {
		$response = wp_remote_head( $url );

		$first_response_code = wp_remote_retrieve_response_code( $response );
		if ( empty( $first_response_code ) ) {
			$first_response_code = 500;
		}

		if ( 300 < $first_response_code && 399 > $first_response_code ) {
			/** @var WP_HTTP_Requests_Response $http_response */
			$http_response = $response['http_response'];
			if ( $url !== $http_response->get_response_object()->url ) {
				$url = $this->get_final_redirect_url( $http_response->get_response_object()->url );
			} else {
				$url = $http_response->get_response_object()->url;
			}
		}

		return (object) array(
			'code' => $first_response_code,
			'url'  => $url,
		);

	}

	private function updateUrl( Urlslab_Url_Row $url ) {
		try {

			$status_obj = $this->check_url_status( $url->get_url()->get_url_with_protocol() );
			$final_url  = new Urlslab_Url( $status_obj->url, true );
			$url->set_final_url_id( $final_url->get_url_id() );

			// setting the url in pending state
			$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_PENDING );

			if ( Urlslab_Url_Row::HTTP_STATUS_OK <= $status_obj->code && 400 > $status_obj->code && $final_url->get_url_id() == $url->get_url_id() && $this->is_html_extension( $url->get_url()->get_extension() ) ) {
				$page_content_file_name = download_url( $url->get_url()->get_url_with_protocol() );

				if ( is_wp_error( $page_content_file_name ) ) {
					$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
					$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
					$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
				} else {
					if ( empty( $page_content_file_name ) || ! file_exists( $page_content_file_name ) || 0 == filesize( $page_content_file_name ) ) {
						$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
						$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
						$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
					} else {

						try {
							$html_title = $this->get_text_from_tag( 'title', $page_content_file_name );
							if ( ! empty( $html_title ) ) {
								$url->set_url_title( $html_title );
							}
							if ( empty( $url->get_url_title() ) ) {
								$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
							}

							$h1 = $this->get_text_from_tag( 'h1', $page_content_file_name );
							if ( ! empty( $h1 ) ) {
								$url->set_url_h1( $h1 );
							}
							if ( empty( $url->get_url_h1() ) ) {
								$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
							}

							//process lang attribute
							$fp = fopen( $page_content_file_name, 'r' );
							if ( $fp ) {
								$html_tag = fread( $fp, 300 );
								fclose( $fp );

								if ( strlen( $html_tag ) ) {
									if ( preg_match( '/<html[^>]+lang=([^\s>]+)/i', $html_tag, $match ) ) {
										$url->set_url_lang( trim( $match[1], '"\' ' ) );
									} else {
										$url->set_url_lang( Urlslab_Url_Row::VALUE_EMPTY );
									}
								}
							}


							$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
							$document->encoding            = 'utf-8';
							$document->strictErrorChecking = false; // phpcs:ignore
							$libxml_previous_state         = libxml_use_internal_errors( true );
							$html_text                     = $this->get_html_from_tag( 'head', $page_content_file_name );
							if ( strlen( $html_text ) ) {
								$document->loadHTML( mb_convert_encoding( $html_text, 'HTML-ENTITIES', 'utf-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE | LIBXML_NOWARNING );
								libxml_clear_errors();
								libxml_use_internal_errors( $libxml_previous_state );
								$xpath            = new DOMXPath( $document );
								$metadescriptions = $xpath->evaluate( '//meta[@name="description"]/@content' );
								if ( $metadescriptions->length > 0 ) {
									$url->set_url_meta_description( $xpath->evaluate( '//meta[@name="description"]/@content' )->item( 0 )->value );
								}
								if ( empty( $url->get_url_meta_description() ) ) {
									$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
								}
							}
						} catch ( Exception $e ) {
						}
						unlink( $page_content_file_name );
					}
				}
			} else {
				$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
				$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
				$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
			}

			if ( 300 < $status_obj->code && 399 > $status_obj->code && $final_url->get_url_id() == $url->get_url_id() ) {
				$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_OK );    //if the url is same as original, then it is OK and not redirect
			} else if ( 429 == $status_obj->code ) {
				$url->set_http_status( Urlslab_Url_Row::HTTP_STATUS_PENDING );    //rate limit hit, process later
			} else {
				$url->set_http_status( $status_obj->code );
				if ( 300 < $status_obj->code && 399 > $status_obj->code ) {
					$url_row_obj = new Urlslab_Url_Row();
					$url_row_obj->insert_urls( array( $final_url ) );
				}
			}
		} catch ( Exception $e ) {
			$url->set_url_title( Urlslab_Url_Row::VALUE_EMPTY );
			$url->set_url_h1( Urlslab_Url_Row::VALUE_EMPTY );
			$url->set_url_meta_description( Urlslab_Url_Row::VALUE_EMPTY );
		}

		return $url->update();
	}

	private function get_html_from_tag( string $tag_name, $file_name ) {
		$html   = '';
		$handle = fopen( $file_name, 'r' );

		$tag_started = false;
		$tag_ended   = false;
		if ( $handle ) {
			while ( ( $line = fgets( $handle ) ) !== false ) {
				if ( ! $tag_started && preg_match( '/<' . $tag_name . '[^>]*?>(.*)/is', $line, $matches ) ) {
					$tag_started = true;
					$line        = $matches[1];
				}
				if ( $tag_started ) {
					$closing_tag_pos = strpos( $line, '</' . $tag_name . '>' );
					if ( false !== $closing_tag_pos ) {
						$line = substr( $line, 0, $closing_tag_pos );
						$html .= $line;
						break;
					} else {
						$html .= $line;
					}
				}
			}
			fclose( $handle );
		}

		return $html;
	}

	private function get_text_from_tag( $tag_name, $file_name ) {
		$document                      = new DOMDocument( '1.0', get_bloginfo( 'charset' ) );
		$document->encoding            = 'utf-8';
		$document->strictErrorChecking = false; // phpcs:ignore
		$libxml_previous_state         = libxml_use_internal_errors( true );

		$html_text = $this->get_html_from_tag( $tag_name, $file_name );
		if ( empty( $html_text ) ) {
			return '';
		}
		$document->loadHTML( mb_convert_encoding( $html_text, 'HTML-ENTITIES', 'utf-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_BIGLINES | LIBXML_PARSEHUGE | LIBXML_NOWARNING );
		libxml_clear_errors();
		libxml_use_internal_errors( $libxml_previous_state );

		return $document->textContent; //phpcs:ignore
	}

	private function is_html_extension( $extension ): bool {
		switch ( strtolower( $extension ) ) {
			case 'jpeg':
			case 'jpg':
			case 'gif':
			case 'webp':
			case 'png':
			case 'svg':
			case 'pdf':
			case 'doc':
			case 'docx':
			case 'xls':
			case 'xlsx':
			case 'ppt':
			case 'pptx':
			case 'txt':
			case 'rtf':
			case 'zip':
			case 'rar':
			case '7z':
			case 'tar':
			case 'gz':
			case 'mp3':
			case 'wav':
			case 'ogg':
			case 'mp4':
			case 'avi':
			case 'mov':
			case 'wmv':
			case 'css':
			case 'js':
			case 'json':
			case 'xml':
				return false;
			default:
				return true;
		}
	}
}
