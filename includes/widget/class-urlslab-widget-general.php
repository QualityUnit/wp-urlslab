<?php

// phpcs:disable WordPress
use FlowHunt_Vendor\GuzzleHttp\Client;
use FlowHunt_Vendor\OpenAPI\Client\FlowHunt\AuthApi;

class Urlslab_Widget_General extends Urlslab_Widget {
	public const SLUG = 'general';

	public const SETTING_NAME_FLOWHUNT_API_KEY = 'flowhunt-api-key';
	public const SETTING_NAME_FLOWHUNT_CREDITS = 'flowhunt-credits';
	public const SETTING_NAME_FLOWHUNT_WORKSPACE_ID = 'flowhunt-workspace-id';
	const SETTING_NAME_DOMAIN_BLACKLIST = 'urlslab-url-blacklist';
	const SETTING_NAME_URL_PATH_BLACKLIST = 'urlslab-url-path-blacklist';
	const SETTING_NAME_CLASSNAMES_BLACKLIST = 'urlslab-classnames-blacklist';
	const SETTING_NAME_GEOIP = 'urlslab-geoip';
	const SETTING_NAME_GEOIP_API_KEY = 'urlslab-geoip-api-key';
	const SETTING_NAME_GEOIP_DB_PATH = 'urlslab-geoip-db-path';
	const SETTING_NAME_GEOIP_DOWNLOAD = 'urlslab-geoip-download';

	const SETTING_NAME_USE_HTACCESS = 'urlslab-cache-htaccess';
	const SETTING_NAME_HTACCESS_VERSION = 'urlslab-htaccess-version';

	const SETTING_NAME_IP_ANONYMIZATION = 'urlslab-ip-anonym';
	const SETTING_NAME_IGNORE_PARAMETERS = 'urlslab-param-blacklist';
	const SETTING_NAME_DOMAIN_WHITELIST = 'urlslab-domain-whitelist';
	const SETTING_NAME_IGNORE_HTML_PARSING_ERRORS = 'urlslab-ignore-html-err';
	const SETTING_NAME_DEBUG = 'urlslab-debug';


	public function get_widget_slug(): string {
		return self::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'URLsLab Integration', 'urlslab' );
	}

	public function get_widget_description(): string {
		return __( 'Connect Urlslab.com services to your Wordpress.', 'urlslab' );
	}

	public function is_api_key_required(): bool {
		return true;
	}

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_action( 'init', $this, 'init_check' );
	}

	public function init_check( $is_404 = false ) {

		foreach ( Urlslab_User_Widget::get_instance()->get_activated_widgets() as $widget ) {
			$widget->rewrite_rules();
		}

		//update htaccess file
		$htaccess = new Urlslab_Tool_Htaccess();
		if ( $htaccess->needs_update() ) {
			if ( $htaccess->is_writable() ) {
				if ( $this->get_option( self::SETTING_NAME_USE_HTACCESS ) ) {
					$htaccess->update();
				} else {
					$htaccess->cleanup();
					Urlslab_Tool_Config::clear_advanced_cache();
				};
			}
			$cache_widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_Cache::SLUG );
			if ( $cache_widget && $cache_widget->get_option( Urlslab_Widget_Cache::SETTING_NAME_PAGE_CACHING ) ) {
				Urlslab_Tool_Config::init_advanced_cache();
			} else {
				Urlslab_Tool_Config::clear_advanced_cache();
			}
		}
	}

	public function update_option( $option_id, $value ): bool {
		$ret = parent::update_option( $option_id, $value );
		if ( $ret ) {
			switch ( $option_id ) {
				case self::SETTING_NAME_USE_HTACCESS:
					$this->update_option( Urlslab_Widget_General::SETTING_NAME_HTACCESS_VERSION, time() );
					break;
				case self::SETTING_NAME_HTACCESS_VERSION:
					$this->init_check();
					break;
				default:
					break;
			}
		}

		return $ret;
	}

	protected function add_options() {
		$this->add_options_form_section(
			'api',
			function () {
				return __( 'Integration with FlowHunt', 'urlslab' );
			},
			function () {
				return __( 'Use the FlowHunt service to automate tasks. Save hours of tedious work and obtain precise results - it\'s the efficient way to automate data processing!', 'urlslab' );
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_FLOWHUNT_API_KEY,
			'',
			true,
			function () {
				return __( 'FlowHunt API Key', 'urlslab' );
			},
			function () {
				return __( 'Link your website with the FlowHunt service using an API Key. Obtain your API Key from https://www.flowhunt.io', 'urlslab' );
			},
			self::OPTION_TYPE_PASSWORD,
			false,
			function ( $value ) {
				if (is_string( $value ) and 0 === strlen( $value )) {
					return true;
				}

				if ( Urlslab_Widget::PASSWORD_PLACEHOLDER == $value ) {
					return true;
				}

				$apiInstance = new AuthApi(
					new Client(),
					Urlslab_Connection_FlowHunt::get_configuration( $value )
				);

				try {
					$result = $apiInstance->getUser();

					if ( strlen( $result->getApiKeyWorkspaceId() ) ) {
						$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );
						$widget->update_option( Urlslab_Widget_General::SETTING_NAME_FLOWHUNT_WORKSPACE_ID, $result->getApiKeyWorkspaceId() );

						return true;
					}
				} catch ( Exception $e ) {
					return false;
				}

				return false;
			},
			'api'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FLOWHUNT_CREDITS,
			-1,
			false,
			function () {
				return __( 'FlowHunt Credits', 'urlslab' );
			},
			function () {
				return __( 'Latest known credits balance', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'api'
		);
		$this->add_option_definition(
			self::SETTING_NAME_FLOWHUNT_WORKSPACE_ID,
			'',
			true,
			function () {
				return __( 'FlowHunt Workspace ID', 'urlslab' );
			},
			function () {
				return __( 'Workspace ID of API Key', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'api'
		);

		$this->add_options_form_section(
			'disallowed',
			function () {
				return __( 'Domains Processing', 'urlslab' );
			},
			function () {
				return __( 'Preserve your server\'s computational capacity and cut down on costs associated with operations such as screen captures or summaries on unrelated domains or URLs to your SEO strategy.', 'urlslab' );
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_DOMAIN_BLACKLIST,
			'',
			true,
			function () {
				return __( 'Blacklisted Domains', 'urlslab' );
			},
			function () {
				return __( 'Enter a list of disallowed domain names, excluding www and protocol. URLs with hostnames that match these domain names will be bypassed for processing specific actions in your plugin. This can significantly cut down processing power and expenses. Some well known domains are already blacklisted.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			function ( $value ) {
				return is_string( $value );
			},
			'disallowed',
		);
		$this->add_option_definition(
			self::SETTING_NAME_URL_PATH_BLACKLIST,
			'',
			true,
			function () {
				return __( 'Blacklisted URL paths', 'urlslab' );
			},
			function () {
				return __( 'Enter a list of disallowed paths. URLs with path that match these strings will be skipped. This can significantly cut down processing power and expenses.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			function ( $value ) {
				return is_string( $value );
			},
			'disallowed',
		);
		$this->add_option_definition(
			self::SETTING_NAME_DOMAIN_WHITELIST,
			'',
			true,
			function () {
				return __( 'My Domains', 'urlslab' );
			},
			function () {
				return __( 'Enter a new line or comma separated list of domain names you want to evaluate as yours. By default we try to load this information from WordPress installation.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			function ( $value ) {
				return is_string( $value );
			},
			'disallowed',
		);
		$this->add_option_definition(
			self::SETTING_NAME_IGNORE_PARAMETERS,
			'_branch_match_id, _bta_c, _bta_tid, _ga, _gl, _ke, adgroupid, adid, age-verified, ao_noptimize, campaignid,campid,cn-reloaded, customid,dm_i, ef_id, epik, fb_action_ids, fb_action_types, fb_source, fbclid, gclid, gclsrc, gdffi, gdfms, gdftrk,hsa_acc,hsa_ad,hsa_cam,hsa_grp,hsa_kw,hsa_mt,hsa_net,hsa_src,hsa_tgt,hsa_ver,igshid,matomo_campaign,matomo_cid,matomo_content,matomo_group,matomo_keyword,matomo_medium,matomo_placement,matomo_source,mc_cid,mc_eid,mkcid,mkevt,mkrid,mkwid,msclkid,mtm_campaign,mtm_cid,mtm_content,mtm_group,mtm_keyword,mtm_medium,mtm_placement,mtm_source,pcrid,piwik_campaign,piwik_keyword,piwik_kwd,pk_campaign,pk_cid,pk_content,pk_keyword,pk_kwd,pk_medium,pk_source,pp,redirect_log_mongo_id,redirect_mongo_id,ref,s_kwcid,sadid,sadsrc,saduid,sc_campaign,sc_content,sc_camp,sc_cid,sc_eid,sc_ekw,sc_ek,sc_ic,sc_ip,sc_llid,sc_llp,sc_lid,sc_lkw,sb_referer_host,si,sscid,toolid,trk_contact,trk_module,trk_msg,trk_sid,usqp,utm_campaign,utm_content,utm_expid,utm_id,utm_medium, utm_source,utm_term',
			true,
			function () {
				return __( 'Ignored Parameters', 'urlslab' );
			},
			function () {
				return __( 'Enter a comma separated list of ignored URL parameter names. Those parameters will not be tracked in the system and will be removed from each url before processing.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			function ( $value ) {
				return is_string( $value ) && ( empty( $value ) || preg_match( '/^[\s\t\na-zA-Z0-9_,-]+$/', $value ) );
			},
			'disallowed',
		);

		$this->add_options_form_section(
			'dom',
			function () {
				return __( 'DOM modifications', 'urlslab' );
			},
			function () {
				return __( 'Multiple modules in this plugin modify HTML DOM objects what could in some places damage parts of your website. To skip processing some parts of your website simply define list of classnames we should never touch in yur HTML.', 'urlslab' );
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_CLASSNAMES_BLACKLIST,
			'blogbutton, wp-block-archives, readmore-btn, post_meta, wp-block-post-date, wp-block-post-author-name, wp-block-post-terms, wp-block-comments, wp-block-post-navigation-link, wp-block-navigation',
			true,
			function () {
				return __( 'CSS Classnames to skip', 'urlslab' );
			},
			function () {
				return __( 'Comma-separated list of CSS classnames. If any HTML element contains one of these CSS classnames (or substring in classname), we will not process it with any of UrlsLab plugin modules.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXTAREA,
			false,
			function ( $value ) {
				return is_string( $value );
			},
			'dom',
		);
		$this->add_option_definition(
			self::SETTING_NAME_IGNORE_HTML_PARSING_ERRORS,
			false,
			true,
			function () {
				return __( 'Ignore HTML Parsing errors', 'urlslab' );
			},
			function () {
				return __( 'The URLsLab plugin needs to process the HTML generated by WordPress to utilize some of its features. It attempts to parse this HTML, and should there be any parsing errors, the plugin can bypass these errors to continue processing. However, this approach carries the risk of excluding certain HTML tags. Consequently, the final HTML content may lack incorrect HTML elements. Choosing not to process erroneous HTML might ensure the integrity of the HTML but at the expense of disabling some plugin functionalities.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'dom',
			array( self::LABEL_EXPERT )
		);

		$this->add_options_form_section(
			'geoip',
			function () {
				return __( 'IP address & GeoIP integration', 'urlslab' );
			},
			function () {
				return __( 'Extract from IP address of visitor additional information like city or country. This information can be later used in modules like Web Vitals monitoring or 404 logging.', 'urlslab' );
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_GEOIP,
			false,
			true,
			function () {
				return __( 'Activate GeoIP recognition', 'urlslab' );
			},
			function () {
				return __( 'Once the feature is active, plugin will support conversion of IP address into more complex data. IP recognition can have performance impacts if used in each request. GeoIP requires geoip database from MaxMind. MaxMind offer it free of charge, but you need to register and provider access key to support automatic downlaods.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'geoip'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GEOIP_API_KEY,
			'',
			false,
			function () {
				return __( 'Maxmind License Key', 'urlslab' );
			},
			function () {
				return __( 'Login to your account at https://www.maxmind.com/ and get the license key to allow automatic installation of geoip db. Api key is not required if you will place the file GeoLite2-Country.mmdb on your server and enter full path it to `GeoIp DB Path` setting.', 'urlslab' );
			},
			self::OPTION_TYPE_PASSWORD,
			false,
			function ( $value ) {
				return is_string( $value ) && 255 > strlen( $value );
			},
			'geoip'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GEOIP_DB_PATH,
			'',
			false,
			function () {
				return __( 'GeoIp DB Path', 'urlslab' );
			},
			function () {
				return __( 'Enter full path to Maxmind db file with name GeoLite2-Country.mmdb on your server. If you leave setting empty, uploads directory will be checked if it contains the file', 'urlslab' ) . ( file_exists( wp_upload_dir()['basedir'] . '/GeoLite2-Country.mmdb' ) ? ' ' . __( 'Found:', 'urlslab' ) : ' ' . __( 'Not found:', 'urlslab' ) ) . wp_upload_dir()['basedir'] . '/GeoLite2-Country.mmdb';
			},
			self::OPTION_TYPE_TEXT,
			false,
			function ( $value ) {
				return is_string( $value ) && 500 > strlen( $value );
			},
			'geoip'
		);
		$this->add_option_definition(
			self::SETTING_NAME_GEOIP_DOWNLOAD,
			false,
			false,
			function () {
				return __( 'Automatic DB download', 'urlslab' );
			},
			function () {
				return __( 'If DB is missing on server, try to download it. You need to provide Maxmind License Key to access downloads', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'geoip'
		);

		$this->add_option_definition(
			self::SETTING_NAME_IP_ANONYMIZATION,
			true,
			true,
			function () {
				return __( 'IP Address Anonymization', 'urlslab' );
			},
			function () {
				return __( 'IP address anonymization is a method used to hide or disguise the real IP address of a device accessing the internet. The purpose of this technique is to protect the privacy and confidentiality of users by preventing the tracking or identification of their online activities (Required by multiple laws like GDPR, CCPA or VCDPA). (e.g. 192.168.100.123 will be stored as 192.***.***.123)', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'geoip'
		);

		$this->add_option_definition(
			Urlslab_Widget_General::SETTING_NAME_USE_HTACCESS,
			false,
			false,
			function () {
				return __( 'Allow updating .htaccess and config files', 'urlslab' );
			},
			function () {
				return __( 'To achieve maximum speed of caching, we need to add some web server configuration rules into file `.htaccess`. These rules are evaluated before PHP script executes first SQL query to your database server and can save processing time of your database server.', 'urlslab' );
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'general'
		);

		$this->add_option_definition(
			self::SETTING_NAME_HTACCESS_VERSION,
			0,
			true,
			function () {
				return __( '.htaccess version', 'urlslab' );
			},
			function () {
				return '';
			},
			self::OPTION_TYPE_HIDDEN,
			false,
			null,
			'general'
		);

		$this->add_options_form_section(
			'debug',
			function () {
				return __( 'Debugging', 'urlslab' );
			},
			function () {
				return __( 'Include HTML debug messages to make it easier to understand what is happening.', 'urlslab' );
			}
		);
		$this->add_option_definition(
			self::SETTING_NAME_DEBUG,
			false,
			true,
			function () {
				return __( 'Activate Debug Messages', 'urlslab' );
			},
			function () {
				return __( 'Include in the page html debug messages in html comments.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'debug'
		);
	}

	public static function is_flowhunt_configured(): bool {
		$widget = Urlslab_User_Widget::get_instance()->get_widget( Urlslab_Widget_General::SLUG );

		return strlen( $widget->get_option( self::SETTING_NAME_FLOWHUNT_API_KEY ) ) > 0 && $widget->get_option( self::SETTING_NAME_FLOWHUNT_CREDITS ) > 0;
	}


	public function register_routes() {
		( new Urlslab_Api_Modules() )->register_routes();
		( new Urlslab_Api_Settings() )->register_routes();
		( new Urlslab_Api_Labels() )->register_routes();
		( new Urlslab_Api_Billing() )->register_routes();
		( new Urlslab_Api_Cron() )->register_routes();
		( new Urlslab_Api_Permissions() )->register_routes();
		( new Urlslab_Api_Tasks() )->register_routes();
		( new Urlslab_Api_Urls() )->register_routes();
		( new Urlslab_Api_Url_Map() )->register_routes();
		( new Urlslab_Api_User_Info() )->register_routes();
		( new Urlslab_Api_Configs() )->register_routes();
	}
}
