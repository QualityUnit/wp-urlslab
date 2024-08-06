import { __ } from '@wordpress/i18n';

export const queryTypes = {
	U: __( 'User Defined', 'urlslab' ),
	C: __( 'Search Console', 'urlslab' ),
	S: __( 'People also search for', 'urlslab' ),
	F: __( 'People also ask', 'urlslab' ),
};

export const queryStatuses = {
	X: __( 'Not processed', 'urlslab' ),
	P: __( 'Processing', 'urlslab' ),
	A: __( 'Processed', 'urlslab' ),
	E: __( 'Disabled', 'urlslab' ),
	S: __( 'Irrelevant', 'urlslab' ),
};

export const countryVolumeStatuses = {
	N: __( 'Waiting', 'urlslab' ),
	P: __( 'Processing', 'urlslab' ),
	F: __( 'Available', 'urlslab' ),
	E: __( 'Not available', 'urlslab' ),
};

export const queryScheduleIntervals = {
	D: __( 'Daily', 'urlslab' ),
	W: __( 'Weekly', 'urlslab' ),
	M: __( 'Monthly', 'urlslab' ),
	Y: __( 'Yearly', 'urlslab' ),
	O: __( 'Once', 'urlslab' ),
	'': __( 'System Default', 'urlslab' ),
};
export const queryLevels = {
	H: __( 'High', 'urlslab' ),
	M: __( 'Medium', 'urlslab' ),
	L: __( 'Low', 'urlslab' ),
	'': __( '-', 'urlslab' ),
};

export const queryIntents = {
	U: __( 'Undefined', 'urlslab' ),
	O: __( 'Other', 'urlslab' ),
	Q: __( 'Question', 'urlslab' ),
	I: __( 'Informational', 'urlslab' ),
	C: __( 'Commercial', 'urlslab' ),
	N: __( 'Navigational', 'urlslab' ),
	T: __( 'Transactional', 'urlslab' ),
};

export const queryHeaders = {
	query: __( 'Query', 'urlslab' ),
	country: __( 'Country', 'urlslab' ),
	type: __( 'Type', 'urlslab' ),
	status: __( 'Status', 'urlslab' ),
	updated: __( 'Updated', 'urlslab' ),
	comp_intersections: __( 'Competitors in top 10', 'urlslab' ),
	comp_urls: __( 'Competitor URLs', 'urlslab' ),
	my_position: __( 'My Position', 'urlslab' ),
	my_urls: __( 'My URLs', 'urlslab' ),
	my_urls_ranked_top10: __( 'My URLs in Top10', 'urlslab' ),
	my_urls_ranked_top100: __( 'My URLs in Top100', 'urlslab' ),
	internal_links: __( 'Internal Links', 'urlslab' ),
	next_update_delay: __( 'Next Update Delay', 'urlslab' ),
	schedule: __( 'Next update', 'urlslab' ),
	country_vol_status: __( 'Volumes Status', 'urlslab' ),
	country_last_updated: __( 'Volumes Updated', 'urlslab' ),
	country_volume: __( 'Volume', 'urlslab' ),
	country_kd: __( 'Competition Index', 'urlslab' ),
	country_level: __( 'Level', 'urlslab' ),
	country_high_bid: __( 'High Bid', 'urlslab' ),
	country_low_bid: __( 'Low Bid', 'urlslab' ),
	intent: __( 'Intent', 'urlslab' ),
	labels: __( 'Tags', 'urlslab' ),
};

