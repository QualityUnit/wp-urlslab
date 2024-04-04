import { useEffect } from 'react';
import { create } from 'zustand';
import { entries, update } from 'idb-keyval';

const useUserLocalData = create( ( set, get ) => ( {
	userData: {},

	setUserLocalData: ( key, value ) => set( ( state ) => {
		if ( typeof value === 'string' ) {
			update( key, value );
			return { userData: { ...state.userData, [ key ]: value } };
		}

		// object value, extend already saved values
		update( key, ( dbData ) => {
			return { ...dbData, ...value };
		} );
		return { userData: { ...state.userData, [ key ]: { ...state.userData[ key ], ...value } } };
	} ),

	setAllUserLocalData: ( allData ) => set( () => {
		const userData = {};
		allData.forEach( ( [ key, val ] ) => {
			userData[ key ] = val;
		} );
		return { userData };
	} ),

	// access non-reactive user data value from state
	getUserLocalData: ( key, valueKey ) => {
		if ( key === undefined ) {
			return get().userData;
		}

		if ( valueKey !== undefined ) {
			return get().userData[ key ]?.[ valueKey ];
		}

		return get().userData[ key ];
	},
} ) );

export const useInitUserLocalDataStorage = () => {
	const setAllUserLocalData = useUserLocalData( ( state ) => state.setAllUserLocalData );
	useEffect( () => {
		entries().then( ( dbData ) => {
			if ( dbData ) {
				setAllUserLocalData( dbData );
			}
		} );
	}, [ setAllUserLocalData ] );
};

export default useUserLocalData;
