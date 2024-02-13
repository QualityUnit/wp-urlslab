import { useEffect } from 'react';
import { create } from 'zustand';
import { entries, update } from 'idb-keyval';

const useUserLocalData = create( ( set, get ) => ( {
	data: {},

	setLocalData: ( key, value ) => set( ( state ) => {
		update( key, ( dbData ) => {
			return { ...dbData, ...value };
		} );
		return { data: { ...state.data, [ key ]: { ...state.data[ key ], ...value } } };
	} ),

	setAllLocalData: ( allData ) => set( () => {
		const data = {};
		allData.forEach( ( [ key, val ] ) => {
			data[ key ] = val;
		} );
		return { data };
	} ),
	getLocalData: ( key ) => key !== undefined ? get().data[ key ] : get().data,
} ) );

export const useCreateUserLocalDataStorage = () => {
	const setAllLocalData = useUserLocalData( ( state ) => state.setAllLocalData );
	useEffect( () => {
		entries().then( ( dbData ) => {
			if ( dbData ) {
				setAllLocalData( dbData );
			}
		} );
	}, [ setAllLocalData ] );
};

export default useUserLocalData;
