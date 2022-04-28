import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const { useSelect } = wp.data;
const { __ } = wp.i18n;

const InnerBlocksLimited = ( props ) => {
	const ALLOWED_BLOCKS = [ 'qu/enhanced-faq-item' ];
	const { clientId } = props;
	// const [ faqUsed, setFaqUsed ] = useState( false );
	const innerBlockCount = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlock( clientId ).innerBlocks
	);

	const template = [
		[
			'qu/enhanced-faq-item',
			{
				placeholder: __( 'Add FAQ Item', 'qu-enhanced-faq' ),
			},
		],
	];

	const faqItemAppender = () => {
		if ( innerBlockCount.length < 10 ) {
			return (
				<div className="qu-enhancedFAQ__addItemButton">
					<InnerBlocks.ButtonBlockAppender />
				</div>
			);
		}
		return (
			<div className="input__limit--like wp-block">
				{ __(
					'You can add maximum of 10 FAQ items',
					'qu-enhanced-faq'
				) }
			</div>
		);
	};

	const blockProps = useBlockProps();   //eslint-disable-line
	return (
		<InnerBlocks
			{ ...blockProps }
			{ ...props }
			allowedBlocks={ ALLOWED_BLOCKS }
			template={ template }
			renderAppender={ () => faqItemAppender() }
		/>
	);
};

export default InnerBlocksLimited;
