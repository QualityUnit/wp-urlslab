import { __ } from '@wordpress/i18n';

export const domainTypes = {
	X: __( 'Uncategorized', 'wp-urlslab' ),
	M: __( 'My Domain', 'wp-urlslab' ),
	C: __( 'Competitor', 'wp-urlslab' ),
	I: __( 'Ignored', 'wp-urlslab' ),
};

export const urlHeaders = {
	url_name: __( 'URL', 'wp-urlslab' ),
	url_title: __( 'Title', 'wp-urlslab' ),
	url_description: __( 'Description', 'wp-urlslab' ),
	domain_type: __( 'Domain type', 'wp-urlslab' ),
	comp_intersections: __( 'Competitors', 'wp-urlslab' ),
	best_position: __( 'Best position', 'wp-urlslab' ),
	top10_queries_cnt: __( 'Top 10', 'wp-urlslab' ),
	top100_queries_cnt: __( 'Top 100', 'wp-urlslab' ),
	top_queries: __( 'Top queries', 'wp-urlslab' ),
	my_urls_ranked_top10: __( 'My URLs in Top 10', 'wp-urlslab' ),
	my_urls_ranked_top100: __( 'My URLs in Top 100', 'wp-urlslab' ),
	country_volume: __( 'Volume', 'wp-urlslab' ),
	country_value: __( 'Traffic Value', 'wp-urlslab' ),
};

