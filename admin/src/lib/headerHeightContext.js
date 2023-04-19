import { createContext } from 'react';
const HeaderHeightContext = createContext( {
	headerTopHeight: 58,
	setHeaderTopHeight: () => { },
	headerBottomHeight: 51.5,
	setHeaderBottomHeight: () => { },
} );

export default HeaderHeightContext;
