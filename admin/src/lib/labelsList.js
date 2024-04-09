import { __ } from '@wordpress/i18n';

const labelsList = {
	paid: { name: __( 'Paid service', 'urlslab' ), color: '#00c996' },
	free: { name: __( 'Free', 'urlslab' ), color: '#edeff3' },
	experimental: { name: __( 'Experimental', 'urlslab' ), color: '#ff8875' },
	alpha: { name: __( 'Alpha', 'urlslab' ), color: '#ffb928' },
	beta: { name: __( 'Beta', 'urlslab' ), color: '#75a9ff' },
	expert: { name: __( 'Experts', 'urlslab' ), color: '#ffc996' },
	seo: { name: __( 'SEO', 'urlslab' ), color: '#D4C5F9' },
	cron: { name: __( 'Cron', 'urlslab' ), color: '#75a9ff' },
	performance: { name: __( 'Performance', 'urlslab' ), color: '#65B5FF' },
	tools: { name: __( 'Tools', 'urlslab' ), color: '#FFD189' },
	ai: { name: __( 'AI', 'urlslab' ), color: '#ff7a7a' },
};

export default labelsList;
