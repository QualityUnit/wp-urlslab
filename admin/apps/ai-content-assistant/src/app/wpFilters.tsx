import { createHigherOrderComponent } from '@wordpress/compose';
import { AITooltipWrapper } from '../components/AITooltipWrapper.tsx';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

export const addWPBlockFilters = ( setOpenedTooltipPopup: ( open: boolean ) => void ) => {
	// adding Block Edit Hook
	wp?.hooks.addFilter(
		'editor.BlockEdit',
		'urlslab/with-tooltip',
		createHigherOrderComponent( ( BlockEdit ) => {
			return ( props ) => {
				if ( props.name === 'core/paragraph' ) {
					return (
						<>
							<AITooltipWrapper openPopup={ setOpenedTooltipPopup }>
								<BlockEdit { ...props } />
							</AITooltipWrapper>
						</>
					);
				}
				return <BlockEdit { ...props } />;
			};
		}, 'withTooltip' ),
	);
};
