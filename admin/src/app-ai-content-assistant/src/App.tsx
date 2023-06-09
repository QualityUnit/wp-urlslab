import { useCallback, useReducer, useState } from 'react';
import { ReactComponent as StarsIcon } from './assets/images/icons/icon-stars.svg';
import { __ } from '@wordpress/i18n';
import { Button } from './elements/JSXElements';
import Popup from './components/Popup';

import { AppContext } from './app/context';
import { defaults, reducer } from './app/stateReducer';

import './assets/styles/style.scss';

const App:React.FC = () => {
	const [ openedPopup, setOpenedPopup ] = useState( false );
	const [ state, dispatch ] = useReducer( reducer, defaults );

	const togglePopup = useCallback( () => {
		setOpenedPopup( ! openedPopup );
	}, [ openedPopup ] );

	return (
		<div className="ml-sm mr-sm" >
			<Button className="" onClick={ togglePopup } active ><StarsIcon />{ __( 'AI Content Assistant' ) }</Button>
			<AppContext.Provider value={ { state, dispatch, togglePopup } }>
				{ openedPopup && <Popup /> }
			</AppContext.Provider>
		</div>
	);
};

export default App;
