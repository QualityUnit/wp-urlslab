import { createContext } from 'react';
import { defaults } from './stateReducer';
import { ReducerAction } from './types';

export const AppContext = createContext<{ state: typeof defaults, dispatch: React.Dispatch<ReducerAction>, togglePopup:() => void }>( {
	state: defaults,
	dispatch: () => undefined,
	togglePopup: () => undefined,
} );
