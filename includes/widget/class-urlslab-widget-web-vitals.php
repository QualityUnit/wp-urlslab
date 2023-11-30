<?php

// phpcs:disable WordPress.NamingConventions

class Urlslab_Widget_Web_Vitals extends Urlslab_Widget {
	public const SLUG = 'web-vitals';
	const SETTING_NAME_WEB_VITALS = 'urlslab-web-vitals';
	const SETTING_NAME_WEB_VITALS_ATTRIBUTION = 'urlslab-web-vitals-attr';
	const SETTING_NAME_WEB_VITALS_CLS = 'urlslab-web-vitals-cls';
	const SETTING_NAME_WEB_VITALS_FID = 'urlslab-web-vitals-fid';
	const SETTING_NAME_WEB_VITALS_FCP = 'urlslab-web-vitals-fcp';
	const SETTING_NAME_WEB_VITALS_INP = 'urlslab-web-vitals-inp';
	const SETTING_NAME_WEB_VITALS_LCP = 'urlslab-web-vitals-lcp';
	const SETTING_NAME_WEB_VITALS_TTFB = 'urlslab-web-vitals-ttfb';
	const SETTING_NAME_WEB_VITALS_LOG_LEVEL = 'urlslab-web-vitals-level';
	const SETTING_NAME_WEB_VITALS_URL_REGEXP = 'urlslab-web-vitals-url-regexp';
	const SETTING_NAME_WEB_VITALS_LOG_TTL = 'urlslab-web-vitals-log-ttl';

	public function init_widget() {
		Urlslab_Loader::get_instance()->add_filter( 'urlslab_head_content_raw', $this, 'raw_head_content', 1 );
		Urlslab_Loader::get_instance()->add_action( 'rest_api_init', $this, 'register_routes' );
	}

	public function get_widget_slug(): string {
		return Urlslab_Widget_Web_Vitals::SLUG;
	}

	public function get_widget_title(): string {
		return __( 'Web Vitals', 'urlslab' );
	}

	public function is_api_key_required(): bool {
		return false;
	}

	public function get_widget_labels(): array {
		return array( self::LABEL_TOOLS, self::LABEL_FREE );
	}

	public function get_widget_description(): string {
		return __( 'Measure web vitals of your website and analyze impact of your changes on performance of your pages.', 'urlslab' );
	}

	public function raw_head_content( $content ) {
		if (
			! is_user_logged_in() &&
			! is_search() &&
			! is_404() &&
			! Urlslab_Url::get_current_page_url()->is_blacklisted() &&
			$this->get_option( self::SETTING_NAME_WEB_VITALS ) &&
			(
				$this->get_option( self::SETTING_NAME_WEB_VITALS_CLS ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_FID ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_FCP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_INP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_LCP ) ||
				$this->get_option( self::SETTING_NAME_WEB_VITALS_TTFB )
			) &&
			@preg_match( '|' . str_replace( '|', '\\|', $this->get_option( self::SETTING_NAME_WEB_VITALS_URL_REGEXP ) ) . '|uim', Urlslab_Url::get_current_page_url()->get_url_with_protocol() )
		) {
			$content .= '<script>';
			$content .= 'const queue=new Set();let qflshTmr=null;';
			$content .= 'function addToQueue(metric) {';
			$content .= 'if(qflshTmr!==null){clearTimeout(qflshTmr);}';
			$content .= 'qflshTmr=setTimeout(function(){flushQueue();},5000);';
			$content .= "let rating_level=metric.rating=='good'?0:metric.rating=='poor'?2:1;";
			$content .= 'if (rating_level<' . ( (int) $this->get_option( self::SETTING_NAME_WEB_VITALS_LOG_LEVEL ) ) . '){return;}';
			$content .= 'queue.add(metric);';
			$content .= '}';
			$content .= 'function flushQueue(){';
			$content .= 'if(qflshTmr!==null){clearTimeout(qflshTmr);qflshTmr=null;}';
			$content .= 'if(queue.size>0){';
			$content .= "const body=JSON.stringify({url: window.location.href,pt:'" . ( esc_html( get_post_type() ) ) . "', entries:[...queue]});const api_url='" . esc_js( rest_url( 'urlslab/v1/web-vitals/wvmetrics' ) ) . "';";
			$content .= "(navigator.sendBeacon && navigator.sendBeacon(api_url,body))||fetch(api_url,{body,method:'POST',keepalive:true,headers:{'content-type':'application/json'}});queue.clear();}}";
			$content .= "(function(){var script=document.createElement('script');script.src='";
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_ATTRIBUTION ) ) {
				$content .= URLSLAB_PLUGIN_URL . 'assets/js/web-vitals.attribution.iife.js?v=' . URLSLAB_VERSION;
			} else {
				$content .= URLSLAB_PLUGIN_URL . 'assets/js/web-vitals.iife.js?v=' . URLSLAB_VERSION;
			}
			$content .= "';script.onload=function(){";
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_CLS ) ) {
				$content .= 'webVitals.onCLS(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_FID ) ) {
				$content .= 'webVitals.onFID(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_FCP ) ) {
				$content .= 'webVitals.onFCP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_INP ) ) {
				$content .= 'webVitals.onINP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_LCP ) ) {
				$content .= 'webVitals.onLCP(addToQueue);';
			}
			if ( $this->get_option( self::SETTING_NAME_WEB_VITALS_TTFB ) ) {
				$content .= 'webVitals.onTTFB(addToQueue);';
			}
			$content .= '};document.head.appendChild(script);})();';
			$content .= "addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){flushQueue();}});addEventListener('pagehide',flushQueue);</script>";
		}

		return $content;
	}


	protected function add_options() {
		$this->add_options_form_section(
			'vitals',
			function() {
				return __( 'Web Vitals', 'urlslab' );
			},
			function() {
				return __( 'The Web Vitals module helps measure real user performance data, also known as RUM, in a manner that accurately aligns with Google\'s measurement methods. By analyzing detailed log entries, you can pinpoint the reasons why your Core Web Vitals may not be performing optimally. These logs are stored in your WordPress database. However, it is not advisable to keep logging all data long-term on a production installation. Instead, it should be used only for short-term monitoring to identify any issues.', 'urlslab' );
			},
			array( self::LABEL_FREE )
		);
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS,
			false,
			true,
			function() {
				return __( 'Activate Web Vitals Measurement', 'urlslab' );
			},
			function() {
				return __( 'The plugin will include a small JavaScript library in the website\'s source code. This library measures web vitals in the browser of your visitors as they browse your page.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);
		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_CLS,
			true,
			true,
			function() {
				return __( 'CLS Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for Cumulative Layout Shift (CLS). <br />Read more about the CLS - https://web.dev/articles/cls', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_LCP,
			true,
			true,
			function() {
				return __( 'LCP Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for Largest Contentful Paint (LCP). <br />Read more about the LCP - https://web.dev/articles/lcp', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_FCP,
			true,
			true,
			function() {
				return __( 'FCP Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for First Contentful Paint (FCP). <br />Read more about the FCP - https://web.dev/articles/fcp', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_FID,
			true,
			true,
			function() {
				return __( 'FID Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for First Input Delay (FID). <br />Read more about the FID - https://web.dev/articles/fid', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_INP,
			true,
			true,
			function() {
				return __( 'INP Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for Interaction to Next Paint (INP). <br />Read more about the INP - https://web.dev/articles/inp', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_TTFB,
			true,
			true,
			function() {
				return __( 'TTFB Measurements', 'urlslab' );
			},
			function() {
				return __( 'Enable logging for Time to First Byte (TTFB). <br />Read more about the TTFB - https://web.dev/articles/ttfb', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_LOG_LEVEL,
			0,
			true,
			function() {
				return __( 'Minimum Log Level', 'urlslab' );
			},
			function() {
				return __( 'Store only entries with a rating that is equal to or worse than the selected rating.', 'urlslab' );
			},
			self::OPTION_TYPE_LISTBOX,
			function() {
				return array(
					0 => __( 'Good', 'urlslab' ),
					1 => __( 'Needs Improvement', 'urlslab' ),
					2 => __( 'Poor', 'urlslab' ),
				);
			},
			function( $value ) {
				return is_numeric( $value ) && $value >= 0 && $value <= 2;
			},
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_URL_REGEXP,
			'.*',
			true,
			function() {
				return __( 'URL Filter', 'urlslab' );
			},
			function() {
				return __( 'Measure the performance only for URLs that match the given regular expression. To include measurements for all pages on your website, enter the value `.*`.', 'urlslab' );
			},
			self::OPTION_TYPE_TEXT,
			false,
			function( $value ) {
				if ( ! is_string( $value ) ) {
					return false;
				}
				@preg_match( '|' . str_replace( '|', '\\|', $value ) . '|uim', '' );
				if ( PREG_NO_ERROR !== preg_last_error() ) {
					return false;
				}

				return true;
			},
			'vitals'
		);

		$this->add_option_definition(
			self::SETTING_NAME_WEB_VITALS_ATTRIBUTION,
			true,
			true,
			function() {
				return __( 'Attribution Measurements', 'urlslab' );
			},
			function() {
				return __( 'Measuring attributions can be complex and require more storage beyond basic logs. It is not advisable to extensively use this option in production. However, it is the only method to identify the underlying reason for subpar performance on specific pages. Once the main issue is pinpointed, we suggest disabling this option and solely monitoring performance metrics without logging in-depth data.', 'urlslab' );
			},
			self::OPTION_TYPE_CHECKBOX,
			false,
			null,
			'vitals'
		);

		if ( Urlslab_User_Widget::get_instance()->is_widget_activated( Urlslab_Widget_Optimize::SLUG ) ) {
			$this->add_options_form_section(
				'cleanup',
				function() {
					return __( 'Maintenance', 'urlslab' );
				},
				function() {
					return __( 'Web Vitals monitoring can generate thousands log entries per day based on traffic on your website. To keep reasonable size of your database, you can set limits how long are the web vitals logs stored in your database.', 'urlslab' );
				},
				array( self::LABEL_FREE )
			);
			$this->add_option_definition(
				self::SETTING_NAME_WEB_VITALS_LOG_TTL,
				168,
				false,
				function() {
					return __( 'Time to keep web vitals logs (hours)', 'urlslab' );
				},
				function() {
					return __( 'Define time to keep the web vitals logs in your database (in hours). Default value: 168 hours = one week.', 'urlslab' );
				},
				self::OPTION_TYPE_NUMBER,
				false,
				function( $value ) {
					return is_numeric( $value ) && $value >= 0;
				},
				'cleanup'
			);
		}

	}

	public function register_routes() {
		( new Urlslab_Api_Web_Vitals() )->register_routes();
	}

	public function get_widget_group() {
		return (object) array( 'Tools' => __( 'Tools', 'urlslab' ) );
	}
}
