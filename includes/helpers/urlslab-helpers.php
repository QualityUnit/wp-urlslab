<?php

function get_action() {
	$current_action = '';
	if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
		$current_action = $_REQUEST['action'];
	}
	return $current_action;
}

function urlslab_admin_menu_page_url( $menu_slug ): string {
	return admin_url() . 'admin.php?page=' . urlencode( $menu_slug );
}

function urlslab_get_action(): string {
	$current_action = '';
	if ( isset( $_REQUEST['action'] ) and -1 != $_REQUEST['action'] ) {
		$current_action = $_REQUEST['action'];
	}
	return $current_action;
}

function urlslab_generate_keyword_form( ?Urlslab_Url_Keyword_Data $item ) {
	if ( isset( $_REQUEST['page'] ) ) {
		if ( null == $item ) {
			return sprintf(
				"<div id='%s' class='modal'>
			<div>
				<h2>Edit Keyword</h2>
				<button id='close-import-modal' data-close-modal-id='%s' class='modal-close'>
					<img src='%s' alt='info' width='17px' />
				</button>
			</div>
			<form method='post' action='?page=%s&action=keyword-edit'>
				<input type='hidden' name='keywordHash' value=''>
				<label for='keyword'>Keyword: </label>
				<input id='keyword' name='keyword' type='text' value='' placeholder='Keyword...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-link'>Keyword Link: </label>
				<input id='keyword-link' name='keyword-link' type='text' value='' placeholder='Keyword...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-prio'>Keyword Priority: </label>
				<input id='keyword-prio' name='keyword-prio' type='text' value='' placeholder='Keyword Prio...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-lang'>Keyword Lang: </label>
				<input id='keyword-lang' name='keyword-lang' type='text' value=''
					   placeholder='Keyword Lang...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-url-filter'>Keyword Url Filter: </label>
				<input id='keyword-url-filter' name='keyword-url-filter' type='text' value=''
					   placeholder='Keyword Url Filter...'>
				<br class='clear'/>
				<br class='clear'/>
				<input type='submit' name='submit' class='button' value='Edit Keyword'>
			</form>
		</div>",
				'add-keyword-modal',
				'add-keyword-modal',
				esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ),
				esc_attr( $_REQUEST['page'] ),
			);
		} else {
			return sprintf(
				"<div id='%s' class='modal'>
			<div>
				<h2>Edit Keyword</h2>
				<button id='close-import-modal' data-close-modal-id='%s' class='modal-close'>
					<img src='%s' alt='info' width='17px' />
				</button>
			</div>
			<form method='post' action='?page=%s&action=keyword-edit'>
				<input type='hidden' name='keywordHash' value='%s'>
				<label for='keyword'>Keyword: </label>
				<input id='keyword' name='keyword' type='text' value='%s' placeholder='Keyword...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-link'>Keyword Link: </label>
				<input id='keyword-link' name='keyword-link' type='text' value='%s' placeholder='Keyword...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-prio'>Keyword Priority: </label>
				<input id='keyword-prio' name='keyword-prio' type='text' value='%s' placeholder='Keyword Prio...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-lang'>Keyword Lang: </label>
				<input id='keyword-lang' name='keyword-lang' type='text' value='%s'
					   placeholder='Keyword Lang...'>
				<br class='clear'/>
				<br class='clear'/>
				<label for='keyword-url-filter'>Keyword Url Filter: </label>
				<input id='keyword-url-filter' name='keyword-url-filter' type='text' value='%s'
					   placeholder='Keyword Url Filter...'>
				<br class='clear'/>
				<br class='clear'/>
				<input type='submit' name='submit' class='button' value='Edit Keyword'>
			</form>
		</div>",
				'modal-k-' . $item->get_kw_md5(),
				'modal-k-' . $item->get_kw_md5(),
				esc_url( plugin_dir_url( URLSLAB_PLUGIN_DIR . '/admin/assets/icons/delete.png' ) . 'delete.png' ),
				esc_attr( $_REQUEST['page'] ),
				$item->get_kw_md5(),
				$item->get_keyword(),
				$item->get_keyword_url_link(),
				$item->get_keyword_priority(),
				$item->get_keyword_url_lang(),
				$item->get_keyword_url_filter(),
			);
		}
	}
}

function urlslab_file_upload_code_to_message( int $code ): string {
	switch ( $code ) {
		case UPLOAD_ERR_INI_SIZE:
			$message = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
			break;
		case UPLOAD_ERR_FORM_SIZE:
			$message = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
			break;
		case UPLOAD_ERR_PARTIAL:
			$message = 'The uploaded file was only partially uploaded';
			break;
		case UPLOAD_ERR_NO_FILE:
			$message = 'No file was uploaded';
			break;
		case UPLOAD_ERR_NO_TMP_DIR:
			$message = 'Missing a temporary folder';
			break;
		case UPLOAD_ERR_CANT_WRITE:
			$message = 'Failed to write file to disk';
			break;
		case UPLOAD_ERR_EXTENSION:
			$message = 'File upload stopped by extension';
			break;

		default:
			$message = 'Unknown upload error';
			break;
	}
	return $message;
}

function urlslab_admin_notice( string $status, ?string $message = '' ) {
	if ( 'unauthorized' == $status or 'failure' == $status ) {
		return sprintf(
			'<div class="notice notice-error"><p><strong>%1$s</strong>: %2$s</p></div>',
			esc_html( 'Error' ),
			esc_html( $message ?? 'Invalid operation' )
		);
	}

	if ( 'success' == $status ) {
		return sprintf(
			'<div class="notice notice-success"><p>%s</p></div>',
			esc_html( $message ?? 'Operation successful' )
		);
	}
}

function urlslab_is_same_domain_url( $url ): bool {
	$url_host_name = strtolower( parse_url( $url, PHP_URL_HOST ) );
	if ( ! strlen( $url_host_name ) ) {
		return true;
	}

	return strtolower( parse_url( get_site_url(), PHP_URL_HOST ) ) == $url_host_name;
}

function get_current_page_url(): Urlslab_Url {
	$current_url = get_permalink( get_the_ID() );
	if ( is_category() ) {
		$current_url = get_category_link( get_query_var( 'cat' ) );
	}
	return new Urlslab_Url( $current_url );
}

function urlslab_get_current_page_protocol(): string {
	$protocol = parse_url( get_site_url(), PHP_URL_SCHEME );
	if ( empty( $protocol ) ) {
		return 'http://';
	}
	return $protocol . '://';
}

function urlslab_get_language() {
	global $sitepress, $polylang;

	if ( ! empty( $sitepress ) && is_object( $sitepress ) && method_exists( $sitepress, 'get_active_languages' ) ) {
		return apply_filters( 'wpml_current_language', null );
	}

	if ( ! empty( $polylang ) && function_exists( 'pll_current_language' ) && strlen( pll_current_language() ) ) {
		return pll_current_language();
	}

	return substr( get_locale(), 0, 2 );
}

function urlslab_debug_log( Exception $e ) {
	if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
		// phpcs:disable WordPress.PHP.DevelopmentFunctions
		error_log( $e->getTraceAsString(), 3, URLSLAB_PLUGIN_LOG );
		// phpcs:enable
	}
}

function urlslab_update_widget_settings( array $option, string $setting_name, $setting_default_value ): array {
	if ( ! isset( $option[ $setting_name ] ) ) {
		$option = array_merge(
			$option,
			array(
				$setting_name => $setting_default_value,
			)
		);
	}
	return $option;
}

function urlslab_status_ui_convert( string $status_char ): string {
	switch ( $status_char ) {
		case Urlslab_Status::$available:
			return '<div class="status-circle background-success" title="available"></div>';
		case Urlslab_Status::$pending:
			return '<div class="status-circle background-warning" title="pending"></div>';
		case Urlslab_Status::$new:
			return '<div class="status-circle background-secondary" title="new"></div>';
		case Urlslab_Status::$not_crawling:
			return '<div class="status-circle background-danger" title="broken"></div>';
		case Urlslab_Status::$blocked:
			return '<div class="status-circle background-danger" title="blocked"></div>';
		case Urlslab_Status::$recurring_update:
			return '<div class="status-circle background-primary" title="updating"></div>';
		default:
			return $status_char;
	}
}

function urlslab_visibility_ui_convert( string $status_char ): string {
	switch ( $status_char ) {
		case Urlslab_Url_Data::VISIBILITY_VISIBLE:
			return '<div class="status-circle background-success" title="visible"></div>';
		case Urlslab_Url_Data::VISIBILITY_HIDDEN:
			return '<div class="status-circle background-danger" title="hidden"></div>';
		default:
			return $status_char;
	}
}

/**
 * Masks a password with asterisks (*).
 *
 * @param string $text
 *
 * @return string Text of masked password.
 */
function urlslab_masked_info( string $text ): string {
	if ( empty( $text ) ) {
		return '';
	}
	$masked_text = '';
	for ( $x = 0; $x <= strlen( $text ) - 4; $x++ ) {
		$masked_text = $masked_text . '*';
	}

	return $masked_text . substr( $text, -5 );
}

