import { __ } from '@wordpress/i18n';

export const queryTypes = {
	U: __( 'User Defined', 'wp-urlslab' ),
	C: __( 'Search Console', 'wp-urlslab' ),
	S: __( 'People also search for', 'wp-urlslab' ),
	F: __( 'People also ask', 'wp-urlslab' ),
};

export const queryStatuses = {
	X: __( 'Not processed', 'wp-urlslab' ),
	P: __( 'Processing', 'wp-urlslab' ),
	A: __( 'Processed', 'wp-urlslab' ),
	E: __( 'Disabled', 'wp-urlslab' ),
	S: __( 'Irrelevant', 'wp-urlslab' ),
};

export const countryVolumeStatuses = {
	N: __( 'Waiting', 'wp-urlslab' ),
	P: __( 'Processing', 'wp-urlslab' ),
	F: __( 'Available', 'wp-urlslab' ),
	E: __( 'Not available', 'wp-urlslab' ),
};

export const queryScheduleIntervals = {
	D: __( 'Daily', 'wp-urlslab' ),
	W: __( 'Weekly', 'wp-urlslab' ),
	M: __( 'Monthly', 'wp-urlslab' ),
	Y: __( 'Yearly', 'wp-urlslab' ),
	O: __( 'Once', 'wp-urlslab' ),
	'': __( 'System Default', 'wp-urlslab' ),
};
export const queryLevels = {
	H: __( 'High', 'wp-urlslab' ),
	M: __( 'Medium', 'wp-urlslab' ),
	L: __( 'Low', 'wp-urlslab' ),
	'': __( '-', 'wp-urlslab' ),
};

export const queryIntents = {
	U: __( 'Undefined', 'wp-urlslab' ),
	O: __( 'Other', 'wp-urlslab' ),
	Q: __( 'Question', 'wp-urlslab' ),
	I: __( 'Informational', 'wp-urlslab' ),
	C: __( 'Commercial', 'wp-urlslab' ),
	N: __( 'Navigational', 'wp-urlslab' ),
	T: __( 'Transactional', 'wp-urlslab' ),
};

export const queryHeaders = {
	query: __( 'Query', 'wp-urlslab' ),
	country: __( 'Country', 'wp-urlslab' ),
	type: __( 'Type', 'wp-urlslab' ),
	status: __( 'Status', 'wp-urlslab' ),
	updated: __( 'Updated', 'wp-urlslab' ),
	comp_intersections: __( 'Competitors in top 10', 'wp-urlslab' ),
	comp_urls: __( 'Competitor URLs', 'wp-urlslab' ),
	my_position: __( 'My Position', 'wp-urlslab' ),
	my_urls: __( 'My URLs', 'wp-urlslab' ),
	my_urls_ranked_top10: __( 'My URLs in Top10', 'wp-urlslab' ),
	my_urls_ranked_top100: __( 'My URLs in Top100', 'wp-urlslab' ),
	internal_links: __( 'Internal Links', 'wp-urlslab' ),
	schedule_interval: __( 'Update Interval', 'wp-urlslab' ),
	schedule: __( 'Next update', 'wp-urlslab' ),
	country_vol_status: __( 'Volumes Status', 'wp-urlslab' ),
	country_last_updated: __( 'Volumes Updated', 'wp-urlslab' ),
	country_volume: __( 'Volume', 'wp-urlslab' ),
	country_kd: __( 'Competition Index', 'wp-urlslab' ),
	country_level: __( 'Level', 'wp-urlslab' ),
	country_high_bid: __( 'High Bid', 'wp-urlslab' ),
	country_low_bid: __( 'Low Bid', 'wp-urlslab' ),
	intent: __( 'Intent', 'wp-urlslab' ),
	labels: __( 'Tags', 'wp-urlslab' ),
};

