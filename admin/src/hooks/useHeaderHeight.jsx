import { create } from 'zustand';

const useHeaderHeight = create( ( set ) => ( {
	headerTopHeight: 58,
	setHeaderTopHeight: ( headerTopHeight ) => set( () => ( {
		headerTopHeight,
	} ) ),
	headerBottomHeight: 51.5,
	setHeaderBottomHeight: ( headerBottomHeight ) => set( () => ( {
		headerBottomHeight,
	} ) ),
} ) );

export default useHeaderHeight;
