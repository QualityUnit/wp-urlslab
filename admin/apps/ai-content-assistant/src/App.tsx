import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import { AppContext } from './app/context';
import { defaults, reducer } from './app/stateReducer';
import { useEditorListener } from './app/hooks';

import PopupToggleButton from './components/PopupToggleButton';
import Popup from './components/Popup';

import './assets/styles/style.scss';
import { addWPBlockFilters } from './app/wpFilters.tsx';
import { PrefillData } from './app/types.ts';

const App: React.FC = () => {
	const [ openedPopup, setOpenedPopup ] = useState( false );
	const [ state, dispatch ] = useReducer( reducer, defaults );

	const dispatchPrefillData = ( prefillData: PrefillData ) => {
		dispatch( { type: 'inputText', payload: prefillData.inputText } );
	};

	const togglePopup = useCallback( () => {
		setOpenedPopup( ! openedPopup );
	}, [ openedPopup ] );

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const Button = useMemo( () => <PopupToggleButton action={ togglePopup } />, [] );
	useEditorListener( Button );

	useEffect( () => {
		addWPBlockFilters( setOpenedPopup, dispatchPrefillData );
	}, [] );

	return (
		<AppContext.Provider value={ { state, dispatch, togglePopup } }>
			{ openedPopup && <Popup /> }
		</AppContext.Provider>
	);
};

export default React.memo( App );
