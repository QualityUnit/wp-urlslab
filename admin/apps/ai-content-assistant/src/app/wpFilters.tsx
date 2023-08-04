import { createHigherOrderComponent } from '@wordpress/compose';
import AISelectionWrapper from '../components/AISelectionWrapper';
import { AppState, ReducerAction } from './types.ts';
import type { Dispatch } from 'react';

import { ReactComponent as StarsIcon } from '../assets/images/icons/icon-stars.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { useState, useCallback } = wp.element;

export interface WrappedBlockProps {
	name: string
	clientId: string
}

interface FilterProps {
	state: AppState
	togglePopup: () => void
	dispatch: Dispatch<ReducerAction>
}
export const addWPBlockFilters = ( { togglePopup, dispatch } : FilterProps ) => {
	wp?.hooks.addFilter(
		'editor.BlockEdit',
		'urlslab/with-toolbar-ai',
		createHigherOrderComponent( ( BlockEdit ) => {
			const WrappedBlock: React.FC<WrappedBlockProps> = ( props: WrappedBlockProps ) => {
				const [ isSelection, setIsSelection ] = useState( false );

				const handleSelection = useCallback( ( handle: boolean ) => {
					setIsSelection( handle );
				}, [] );

				if ( props.name !== 'core/paragraph' ) {
					return <BlockEdit { ...props } />;
				}

				return ( <>
					<AISelectionWrapper blockProps={ props } handleSelection={ handleSelection } dispatch={ dispatch }>
						<BlockEdit { ...props } />
					</AISelectionWrapper>
					{ isSelection &&
					<BlockControls>
						<ToolbarGroup className="urlslab-block-ai-toolbar">
							<ToolbarButton
								icon={ <StarsIcon width={ 20 } height={ 20 } /> }
								label="Download"
								onClick={ togglePopup }
							/>
						</ToolbarGroup>
					</BlockControls>
					}
				</> );
			};

			return WrappedBlock;
		}, 'withToolbarAI' ),
	);
};
