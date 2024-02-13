import { useEffect } from 'react';
import { create } from 'zustand';
import { entries } from 'idb-keyval';

const useUserLocalData = create( ( set, get ) => ( {
	data: {},
	setLocalData: ( key, value ) => set( ( state ) => ( { data: { ...state.data, [ key ]: value } } ) ),
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
