
import { ReducerAction } from '../app/types.ts';
import { WrappedBlockProps } from '../app/wpFilters.tsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

const { useCallback, memo, useEffect } = wp.element;

interface AISelectionWrapperProps {
	blockProps: WrappedBlockProps
	children: React.ReactNode;
	handleSelection: ( handle: boolean ) => void;
	dispatch: React.Dispatch<ReducerAction>
}

const getSelectedText = ( selection: Selection | null ) => {
	return selection?.toString().trim() || '';
};

const AISelectionWrapper: React.FC<AISelectionWrapperProps> = ( { blockProps, children, handleSelection, dispatch }: AISelectionWrapperProps ) => {
	const cancelSelection = useCallback( () => {
		handleSelection( false );
		dispatch( { type: 'selectionData', payload: { text: '', selectionObject: null } } );
	}, [ dispatch, handleSelection ] );

	const checkSelection = useCallback( () => {
		const selection = document.getSelection();
		const pElement = document.getElementById( `block-${ blockProps.clientId }` );

		if ( selection && pElement ) {
			const focusNode = selection.focusNode;
			const selectionInWantedNode = focusNode?.parentElement === pElement || pElement.contains( focusNode?.parentNode as ParentNode );
			// handle only selection in our wanted node
			// outside selection do not affect toolbar button as wordpress editor remembers selection on selected block
			if ( selectionInWantedNode ) {
				if ( selection.isCollapsed ) {
					cancelSelection();
				} else {
					const selectionStart = wp.data.select( 'core/block-editor' ).getSelectionStart();
					const selectionEnd = wp.data.select( 'core/block-editor' ).getSelectionEnd();
					handleSelection( true );
					dispatch(
						{
							type: 'selectionData',
							payload: {
								text: getSelectedText( selection ),
								selectionObject: selection,
								offset: {
									start: selectionStart.offset,
									end: selectionEnd.offset,
								},
							},
						},
					);
				}
			}
		}
	}, [ blockProps.clientId, cancelSelection, dispatch, handleSelection ] );

	useEffect( () => {
		if ( blockProps.isSelected ) {
			document.addEventListener( 'selectionchange', checkSelection );
			// check for possible selection immediately the block is selected, ie. when selection from multiple blocks comes back to block with selection start
			checkSelection();
		} else {
			// clear selection when block is not selected, ie. when selection goes through multiple blocks
			cancelSelection();
		}

		return () => {
			document.removeEventListener( 'selectionchange', checkSelection );
		};
	}, [ blockProps, cancelSelection, checkSelection ] );

	return <>{ children }</>;
};

export default memo( AISelectionWrapper );
