<?php

class Urlslab_Redirects extends Urlslab_Widget
{
    public const SLUG = 'redirects';
    public const SETTING_NAME_LOGGING = 'urlslab_redir_log';
    public const SETTING_NAME_LOG_HISTORY_MAX_TIME = 'urlslab_redir_log_max_time';
    public const SETTING_NAME_LOG_HISTORY_MAX_ROWS = 'urlslab_redir_log_max_rows';
    public const SETTING_NAME_DEFAULT_REDIRECT_URL = 'urlslab_redir_default_url';
    public const SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE = 'urlslab_redir_default_url_image';

    public const CACHE_GROUP = 'urlslab_redirects';

    public function init_widget()
    {
        Urlslab_Loader::get_instance()->add_filter(
            'template_redirect',
            $this,
            'template_redirect',
            PHP_INT_MAX,
            0
        );
    }

    public function template_redirect()
    {
        if (isset($_SERVER['REQUEST_URI'])) {
            $url = new Urlslab_Url($_SERVER['REQUEST_URI']);

            $redirects = $this->get_redirects();
            foreach ($redirects as $redirect) {
                if ($this->is_match(
                    $redirect,
                    $url
                )
                ) {
                    $redirect->increase_cnt();
                    wp_redirect(
                        $redirect->get_replace_url(),
                        $redirect->get_redirect_code(),
                        'URLsLab'
                    );
                    exit;
                }
            }
        }

        if (is_404()) {
            $this->log_not_found_url();
            $this->default_image_redirect();
            $this->default_redirect(); // last option should be default redirect
        }
    }

    public function is_match(Urlslab_Redirect_Row $redirect, Urlslab_Url $url)
    {
        switch ($redirect->get_match_type()) {
        case Urlslab_Redirect_Row::MATCH_TYPE_EXACT:
            if ($redirect->get_match_url() != $url->get_url_with_protocol()) {
                return false;
            }
            break;
        case Urlslab_Redirect_Row::MATCH_TYPE_SUBSTRING:
            if (false === strpos(
                    $url->get_url_with_protocol(),
                    $redirect->get_match_url()
                )
            ) {
                return false;
            }
            break;
        case Urlslab_Redirect_Row::MATCH_TYPE_REGEXP:
            if ( ! @preg_match(
                '|' . str_replace(
                    '|',
                    '\\|',
                    $redirect->get_match_url()
                ) . '|uim',
                $url->get_url_with_protocol()
            )
            ) {
                return false;
            }
            break;
        default:
            return false;
        }

        switch ($redirect->get_if_not_found()) {
        case Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY:
            break;
        case Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND:
            if ( ! is_404()) {
                return false;
            }
            break;
        case Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND:
            if (is_404()) {
                return false;
            }
            break;
        default:
        }

        switch ($redirect->get_is_logged()) {
        case Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED:
            if ( ! is_user_logged_in()) {
                return false;
            }
            break;
        case Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN:
            if (is_user_logged_in()) {
                return false;
            }
            break;
        case Urlslab_Redirect_Row::LOGIN_STATUS_ANY:
            break;
        default:
        }

        if ( ! empty($redirect->get_capabilities())) {
            $capabilities = explode(
                ',',
                $redirect->get_capabilities()
            );
            if ( ! empty($capabilities)) {
                $has_cap = false;
                foreach ($capabilities as $capability) {
                    if (current_user_can(trim($capability))) {
                        $has_cap = true;
                        break;
                    }
                }
                if ( ! $has_cap) {
                    return false;
                }
            }
        }

        if ( ! empty($redirect->get_roles())) {
            $user = wp_get_current_user();
            $roles = explode(
                ',',
                $redirect->get_roles()
            );
            if ( ! empty($roles)) {
                $has_role = false;
                foreach ($roles as $role) {
                    if (in_array(
                        $role,
                        $user->roles
                    )
                    ) {
                        $has_role = true;
                        break;
                    }
                }
                if ( ! $has_role) {
                    return false;
                }
            }
        }

        if ( ! empty($redirect->get_browser())
            && isset($_SERVER['HTTP_USER_AGENT'])
        ) {
            $browsers = explode(
                ',',
                strtolower($redirect->get_browser())
            );
            if ( ! empty($browsers)) {
                $has_browser = false;
                $agent = strtolower($_SERVER['HTTP_USER_AGENT']);// phpcs:ignore
                foreach ($browsers as $browser_name) {
                    if (false !== strpos(
                            $agent,
                            trim($browser_name)
                        )
                    ) {
                        $has_browser = true;
                        break;
                    }
                }
                if ( ! $has_browser) {
                    return false;
                }
            }
        }

        if ( ! empty($redirect->get_cookie())) {
            $cookies = explode(
                ',',
                $redirect->get_cookie()
            );
            if ( ! empty($cookies)) {
                $has_cookie = false;
                if ( ! empty($_COOKIE)) {
                    foreach ($cookies as $cookie_str) {
                        $cookie = explode(
                            '=',
                            $cookie_str
                        );

                        if (isset($_COOKIE[trim($cookie[0])])
                            && ( ! isset($cookie[1])
                                || $_COOKIE[trim(
                                    $cookie[0]
                                )] == trim($cookie[1]))
                        ) {// phpcs:ignore
                            $has_cookie = true;
                            break;
                        }
                    }
                }
                if ( ! $has_cookie) {
                    return false;
                }
            }
        }

        if ( ! empty($redirect->get_headers())) {
            $headers = explode(
                ',',
                $redirect->get_headers()
            );
            if ( ! empty($headers)) {
                $has_header = false;
                if ( ! empty($_SERVER)) {
                    foreach ($headers as $header_str) {
                        $header = explode(
                            '=',
                            $header_str
                        );

                        if (isset($_SERVER[trim($header[0])])
                            && ( ! isset($header[1])
                                || $_SERVER[trim(
                                    $header[0]
                                )] == trim($header[1]))
                        ) {// phpcs:ignore
                            $has_header = true;
                            break;
                        }
                    }
                }
                if ( ! $has_header) {
                    return false;
                }
            }
        }

        if ( ! empty($redirect->get_params())) {
            $params = explode(
                ',',
                $redirect->get_params()
            );
            if ( ! empty($params)) {
                $has_param = false;
                if ( ! empty($_REQUEST)) {
                    foreach ($params as $param_str) {
                        $param = explode(
                            '=',
                            $param_str
                        );

                        if (isset($_REQUEST[trim($param[0])])
                            && ( ! isset($param[1])
                                || $_REQUEST[trim(
                                    $param[0]
                                )] == trim($param[1]))
                        ) {// phpcs:ignore
                            $has_param = true;
                            break;
                        }
                    }
                }
                if ( ! $has_param) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * @return string
     */
    public function get_widget_slug(): string
    {
        return Urlslab_Redirects::SLUG;
    }

    /**
     * @return string
     */
    public function get_widget_title(): string
    {
        return __('Redirects and 404 Monitor');
    }

    /**
     * @return string
     */
    public function get_widget_description(): string
    {
        return __(
            'Easily detect 404 errors and effortlessly set up redirects on your site, ensuring a seamless user experience and improved SEO'
        );
    }

    public function is_api_key_required(): bool
    {
        return false;
    }

    /**
     * @return void
     * @throws Exception
     */
    public function log_not_found_url(): void
    {
        if ($this->get_option(self::SETTING_NAME_LOGGING)
            && isset($_SERVER['REQUEST_URI'])
        ) {
            $url = new Urlslab_Url(
                wp_unslash(
                    filter_var(
                        $_SERVER['REQUEST_URI'],
                        FILTER_SANITIZE_URL
                    )
                )
            );
            $log = new Urlslab_Not_Found_Log_Row(
                array(
                    'url'          => $url->get_url_with_protocol(),
                    'url_id'       => $url->get_url_id(),
                    'cnt'          => 1,
                    'request_data' => wp_json_encode(
                        array(
                            'request' => $_REQUEST,
                            'server'  => array(
                                'lang'     => $_SERVER['HTTP_ACCEPT_LANGUAGE']
                                    ?? '',
                                'encoding' => $_SERVER['HTTP_ACCEPT_ENCODING']
                                    ?? '',
                                'accept'   => $_SERVER['HTTP_ACCEPT'] ?? '',
                                'agent'    => $_SERVER['HTTP_USER_AGENT'] ?? '',
                                // phpcs:ignore
                                'referer'  => $_SERVER['HTTP_REFERER'] ?? '',
                                // phpcs:ignore
                            ),
                        )
                    ),
                )
            );
            $log->upsert();
        }
    }

    private function default_image_redirect()
    {
        if (isset($_SERVER['REQUEST_URI'])
            && preg_match(
                '/\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico|jfif|heic|heif|avif)/i',
                $_SERVER['REQUEST_URI']
            )
        ) {
            if ( ! empty(
            $this->get_option(
                self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE
            )
            )
            ) {
                wp_redirect(
                    $this->get_option(
                        self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE
                    ),
                    301,
                    'URLsLab'
                );
                exit;
            }
        }
    }

    /**
     * @return void
     */
    public function default_redirect(): void
    {
        if ( ! empty(
        $this->get_option(
            self::SETTING_NAME_DEFAULT_REDIRECT_URL
        )
        )
        ) {
            wp_redirect(
                $this->get_option(self::SETTING_NAME_DEFAULT_REDIRECT_URL),
                301,
                'URLsLab'
            );
            exit;
        }
    }

    protected function add_options()
    {
        $this->add_options_form_section(
            'redirecting',
            __('Default Redirects Settings'),
            __('Effortlessly personalize redirects for 404 error URLs.')
        );

        $this->add_option_definition(
            self::SETTING_NAME_DEFAULT_REDIRECT_URL,
            '',
            false,
            __('Default Redirect URL'),
            __(
                'Redirect unmatched 404 requests to a default URL, or leave empty for the standard 404 page.'
            ),
            self::OPTION_TYPE_TEXT,
            false,
            function ($value) {
                return empty($value)
                    || filter_var(
                        $value,
                        FILTER_VALIDATE_URL
                    );
            },
            'redirecting'
        );
        $this->add_option_definition(
            self::SETTING_NAME_DEFAULT_REDIRECT_URL_IMAGE,
            '',
            false,
            __('Default Redirect URL for Images'),
            __(
                'Redirect 404 image requests to a default image URL, or leave empty for the standard 404 page.'
            ),
            self::OPTION_TYPE_TEXT,
            false,
            function ($value) {
                return empty($value)
                    || filter_var(
                        $value,
                        FILTER_VALIDATE_URL
                    );
            },
            'redirecting'
        );

        $this->add_options_form_section(
            'logging',
            __('Logging Settings'),
            __(
                'Effortlessly log all 404 URLs and create efficient redirect rules, while safeguarding your system from potential overload during attacks.'
            )
        );

        $this->add_option_definition(
            self::SETTING_NAME_LOGGING,
            true,
            false,
            __('Activate Logging'),
            __('Log every 404 error event in the database.'),
            self::OPTION_TYPE_CHECKBOX,
            false,
            null,
            'logging'
        );

        $this->add_option_definition(
            self::SETTING_NAME_LOG_HISTORY_MAX_TIME,
            604800,
            false,
            __('Delete Old Logs'),
            __(
                'Manage log history duration for 404 errors; old rows auto-delete after a specified time without errors.'
            ),
            self::OPTION_TYPE_LISTBOX,
            array(
                86400   => __('1 day'),
                172800  => __('3 days'),
                604800  => __('1 week'),
                1209600 => __('2 weeks'),
                2419200 => __('1 month'),
                7257600 => __('3 months'),
                0       => __('Never'),
            ),
            function ($value) {
                return is_numeric($value) && 0 < $value;
            },
            'logging'
        );

        $this->add_option_definition(
            self::SETTING_NAME_LOG_HISTORY_MAX_ROWS,
            10000,
            false,
            __('Limit Rows'),
            __(
                'Set a limit for rows in the redirects log table. Once reached, all rows are deleted, and logging resumes with an empty table, ensuring optimal database size management.'
            ),
            self::OPTION_TYPE_LISTBOX,
            array(
                0       => __('Unlimited'),
                100     => __('100'),
                1000    => __('1.000'),
                10000   => __('10.000'),
                50000   => __('50.000'),
                100000  => __('100.000'),
                1000000 => __('1.000.000'),
            ),
            function ($value) {
                return is_numeric($value) && 0 < $value;
            },
            'logging'
        );

    }

    private function get_cache_key()
    {
        return 'redirects' . (is_404() ? '_404' : '') . (is_user_logged_in()
                ? '_logged' : '');
    }

    /**
     * @return Urlslab_Redirect_Row[]
     */
    private function get_redirects(): array
    {
        if (wp_using_ext_object_cache()) {
            $redirects = wp_cache_get(
                $this->get_cache_key(),
                self::CACHE_GROUP
            );
            if (false === $redirects) {
                $redirects = $this->get_redirects_from_db();
                wp_cache_set(
                    $this->get_cache_key(),
                    $redirects,
                    self::CACHE_GROUP,
                    3600
                );
            }
        } else {
            if (Urlslab_File_Cache::get_instance()->is_active()) {
                $redirects = Urlslab_File_Cache::get_instance()->get(
                    $this->get_cache_key(),
                    self::CACHE_GROUP,
                    $found,
                    array('Urlslab_Redirect_Row')
                );
                if (false === $redirects) {
                    $redirects = $this->get_redirects_from_db();
                    Urlslab_File_Cache::get_instance()->set(
                        $this->get_cache_key(),
                        $redirects,
                        self::CACHE_GROUP
                    );
                }
            } else {
                $redirects = $this->get_redirects_from_db();
            }
        }

        return $redirects;
    }

    /**
     * @return Urlslab_Redirect_Row[]
     */
    private function get_redirects_from_db()
    {
        $redirects = array();
        global $wpdb;
        $where_data = array();
        $where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_ANY;
        if (is_404()) {
            $where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_NOT_FOUND;
        } else {
            $where_data[] = Urlslab_Redirect_Row::NOT_FOUND_STATUS_FOUND;
        }
        $where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_ANY;
        if (is_user_logged_in()) {
            $where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_LOGIN_REQUIRED;
        } else {
            $where_data[] = Urlslab_Redirect_Row::LOGIN_STATUS_NOT_LOGGED_IN;
        }

        $results = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . URLSLAB_REDIRECTS_TABLE
                . ' WHERE if_not_found IN (%s,%s) AND is_logged IN (%s,%s)',
                $where_data
            ),
            'ARRAY_A'
        ); // phpcs:ignore
        foreach ($results as $result) {
            $redirects[] = new Urlslab_Redirect_Row($result);
        }

        return $redirects;
    }

    public static function delete_cache()
    {
        if (wp_using_ext_object_cache()) {
            if (wp_cache_supports('flush_group')) {
                wp_cache_flush_groups(self::CACHE_GROUP);
            } else {
                wp_cache_delete(
                    'redirects',
                    self::CACHE_GROUP
                );
                wp_cache_delete(
                    'redirects_404',
                    self::CACHE_GROUP
                );
                wp_cache_delete(
                    'redirects_logged',
                    self::CACHE_GROUP
                );
                wp_cache_delete(
                    'redirects_404_logged',
                    self::CACHE_GROUP
                );
            }
        }
        if (Urlslab_File_Cache::get_instance()->is_active()) {
            Urlslab_File_Cache::get_instance()->clear(self::CACHE_GROUP);
        }
    }
}
