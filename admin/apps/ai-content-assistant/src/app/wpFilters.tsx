import { createHigherOrderComponent } from '@wordpress/compose';
import AITooltipWrapper from '../components/AITooltipWrapper.tsx';
import { PrefillData } from './types.ts';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

export const addWPBlockFilters = ( setOpenedTooltipPopup: any, dispatchPrefillData: ( data: PrefillData ) => void ) => {
	// adding Block Edit Hook
	wp?.hooks.addFilter(
		'editor.BlockEdit',
		'urlslab/with-tooltip',
		createHigherOrderComponent( ( BlockEdit ) => {
			return ( props ) => {
				if ( props.name === 'core/paragraph' ) {
					return ( <>
						<AITooltipWrapper openPopup={ setOpenedTooltipPopup } setPrefillData={ dispatchPrefillData }>
							<BlockEdit { ...props } />
						</AITooltipWrapper>
					</> );
				}
				return <BlockEdit { ...props } />;
			};
		}, 'withTooltip' ),
	);
};
