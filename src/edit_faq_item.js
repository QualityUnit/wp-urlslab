import { useBlockProps } from '@wordpress/block-editor';
import FAQItem from './components/FAQItem';

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;

registerBlockType( 'qu/enhanced-faq-item', {
	apiVersion: 2,
	title: __( 'Enhanced FAQ Item', 'qu-enhanced-faq' ),
	icon: 'sticky',
	category: 'widgets',
	parent: [ 'qu/enhanced-faq' ],
	attributes: {
		targetId: {
			type: 'string',
			default: '',
		},
		question: {
			type: 'string',
			default: 'Enter FAQ question here…',
		},
		content: {
			type: 'string',
			default: '',
		},
	},

	edit: ( props ) => {
		const blockProps = useBlockProps(); //eslint-disable-line
		const { clientId, setAttributes } = props;

		setAttributes( {
			targetId: clientId,
		} );

		return (
			<div { ...blockProps }>
				<FAQItem { ...props } />
			</div>
		);
	},

	save: () => {
		return null;
	},
} );
