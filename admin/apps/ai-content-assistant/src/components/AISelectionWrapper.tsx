
import { AppState, ReducerAction } from '../app/types.ts';
import { WrappedBlockProps } from '../app/wpFilters.tsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const wp: any; // used any type until wordpress provide better typing

const { useRef, useCallback, memo, useEffect } = wp.element;

interface AISelectionWrapperProps {
	blockProps: WrappedBlockProps
	children: React.ReactNode;
	appState: AppState
	handleSelection: ( handle: boolean ) => void;
	dispatch: React.Dispatch<ReducerAction>
}

const getSelection = ( node: HTMLDivElement ) => {
	if ( node?.ownerDocument.defaultView ) {
		return node.ownerDocument.defaultView.getSelection();
	}
	return null;
};

const getSelectedText = ( selection: Selection | null ) => {
	return selection?.toString().trim() || '';
};

const AISelectionWrapper: React.FC<AISelectionWrapperProps> = ( { blockProps, children, handleSelection, dispatch }: AISelectionWrapperProps ) => {
	const blockContainerElement = useRef( null );

	// make sure to clear selection before
	// it fixes situation when is clicked on the selection to clear it, selection stay still available on mouse up event
	const handleMouseDown = useCallback( () => {
		const selection = getSelection( blockContainerElement.current );
		selection?.empty();
		handleSelection( false );
		dispatch( { type: 'inputText', payload: '' } );
	}, [ dispatch, handleSelection ] );

	const handleMouseUp = useCallback( () => {
		const selection = getSelection( blockContainerElement.current );
		const selectedText = getSelectedText( selection );
		if ( selectedText ) {
			handleSelection( true );
			dispatch( { type: 'inputText', payload: selectedText } );
		}
	}, [ dispatch, handleSelection ] );

	// add events only on real block content, otherwise they are fired also in block toolbar and sidebar inspector tools
	useEffect( () => {
		const contentNode = blockContainerElement.current?.querySelector( `#block-${ blockProps.clientId }` );

		contentNode?.addEventListener( 'mousedown', handleMouseDown );
		contentNode?.addEventListener( 'mouseup', handleMouseUp );

		return () => {
			contentNode?.removeEventListener( 'mousedown', handleMouseDown );
			contentNode?.removeEventListener( 'mouseup', handleMouseUp );
		};
	}, [ blockProps.clientId, handleMouseDown, handleMouseUp ] );

	return (
		<div className="urlslab-block-ai-wrapper" ref={ blockContainerElement }>
			{ children }
		</div>
	);
};

export default memo( AISelectionWrapper );
