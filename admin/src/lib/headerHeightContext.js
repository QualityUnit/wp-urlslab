import { createContext } from 'react';
const HeaderHeightContext = createContext( {
	headerTopHeight: 60,
	setHeaderTopHeight: () => { },
	headerBottomHeight: 60,
	setHeaderBottomHeight: () => { },
} );

export default HeaderHeightContext;
