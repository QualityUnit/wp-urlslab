import { __ } from '@wordpress/i18n';

const labelsList = {
	paid: { name: __( 'Paid service', 'wp-urlslab' ), color: '#00c996' },
	free: { name: __( 'Free', 'wp-urlslab' ), color: '#edeff3' },
	experimental: { name: __( 'Experimental', 'wp-urlslab' ), color: '#ff8875' },
	alpha: { name: __( 'Alpha', 'wp-urlslab' ), color: '#ffb928' },
	beta: { name: __( 'Beta', 'wp-urlslab' ), color: '#75a9ff' },
	expert: { name: __( 'Experts', 'wp-urlslab' ), color: '#ffc996' },
	seo: { name: __( 'SEO', 'wp-urlslab' ), color: '#D4C5F9' },
	cron: { name: __( 'Cron', 'wp-urlslab' ), color: '#75a9ff' },
	performance: { name: __( 'Performance', 'wp-urlslab' ), color: '#65B5FF' },
	tools: { name: __( 'Tools', 'wp-urlslab' ), color: '#FFD189' },
	ai: { name: __( 'AI', 'wp-urlslab' ), color: '#ff7a7a' },
};

export default labelsList;
