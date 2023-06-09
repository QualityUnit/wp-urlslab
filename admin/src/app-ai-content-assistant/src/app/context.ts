import { createContext } from 'react';
import { ReducerAction, defaults } from './stateReducer';

export const AppContext = createContext<{ state: typeof defaults, dispatch: React.Dispatch<ReducerAction>, togglePopup:() => void }>( {
	state: defaults,
	dispatch: () => undefined,
	togglePopup: () => undefined,
} );
