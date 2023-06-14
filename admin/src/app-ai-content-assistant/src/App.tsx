import React, { useCallback, useReducer, useState, useMemo } from 'react';

import { AppContext } from './app/context';
import { defaults, reducer } from './app/stateReducer';
import { useEditorListener } from './app/hooks';

import PopupToggleButton from './components/PopupToggleButton';
import Popup from './components/Popup';

import './assets/styles/style.scss';

const App: React.FC = () => {
	const [ openedPopup, setOpenedPopup ] = useState( false );
	const [ state, dispatch ] = useReducer( reducer, defaults );

	const togglePopup = useCallback( () => {
		setOpenedPopup( ! openedPopup );
	}, [ openedPopup ] );

	useEditorListener(
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useMemo( () => <PopupToggleButton action={ togglePopup } />, [] ),
	);

	return (
		<AppContext.Provider value={ { state, dispatch, togglePopup } }>
			{ openedPopup && <Popup /> }
		</AppContext.Provider>
	);
};

export default React.memo( App );
