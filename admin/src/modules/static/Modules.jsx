import { memo, useCallback, useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import useModulesQuery from '../../queries/useModulesQuery';
import labelsList from '../../lib/labelsList';

import DashboardModule from '../../components/DashboardModule';
import SearchField from '../../elements/SearchField';
import MultiSelectMenu from '../../elements/MultiSelectMenu';

function Modules() {
	const { __ } = useI18n();
	const [ filterBy, setFilterBy ] = useState( {} );
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

	const statusList = {
		active: __( 'Active modules' ),
		inactive: __( 'Inactive modules' ),
	};

	const categoriesList = useMemo( () => {
		let cats = {};
		let labelsArray = [];

		if ( modules ) {
			Object.values( modules ).map( ( { labels } ) => {
				labelsArray = [ ...labelsArray, ...labels ];
				return false;
			} );
		}

		if ( labelsList ) {
			Object.entries( { ...labelsList } ).map( ( [ key, val ] ) => {
				const { name } = val;
				if ( key !== 'paid' && key !== 'free' && labelsArray?.length && [ ... new Set( labelsArray ) ].indexOf( key ) !== -1 ) {
					cats = { ...cats, [ key ]: name };
				}
				return false;
			} );
		}

		return cats;
	}, [ modules ] );

	const pricingList = {
		free: labelsList.free.name,
		paid: labelsList.paid.name,
	};

	const handleFiltering = ( { input, type } ) => {
		let inputValue = input;
		if ( typeof input === 'string' ) {
			inputValue = input.toLowerCase();
		}

		setFilterBy( ( filter ) => {
			return { ...filter, [ type ]: inputValue };
		} );
	};

	const filter = useCallback( ( module ) => {
		const { active, labels } = module;
		const title = module?.title.toLowerCase();
		const description = module?.description.toLowerCase();
		const { search, categories, status, pricing } = filterBy;

		const moduleStatus = active ? 'active' : 'inactive';

		if (
			( ! search || ( search && ( title?.includes( search ) || description?.includes( search ) ) ) ) &&
			( ! categories?.length || labels?.some( ( label ) => categories?.includes( label ) ) ) &&
			( ! status?.length || status?.some( ( val ) => val === moduleStatus ) ) &&
			( ! pricing?.length || labels?.some( ( label ) => pricing?.includes( label ) ) )
		) {
			return true;
		}

		return false;
	}, [ filterBy ] );

	const noModules = useMemo( () => {
		let array = [];
		if ( modules ) {
			Object.values( modules ).map( ( module ) => {
				if ( module.id !== 'general' && filter( module ) ) {
					array = [ ...array, module.id ];
				}
				return false;
			} );
		}

		return array.length;
	}, [ filter, modules ] );

	return ( ( isSuccessModules && modules && Object.values( modules ).length ) &&
		<>
			<div className="urlslab-subheader flex flex-align-center">
				<SearchField liveUpdate autoFocus onChange={ ( input ) => handleFiltering( { input, type: 'search' } ) } placeholder={ __( 'Search' ) } />
				<span className="ml-l mr-s fs-xm">{ __( 'Filters' ) }:</span>
				<MultiSelectMenu id="categories" onChange={ ( input ) => handleFiltering( { input, type: 'categories' } ) }
					className="mr-s" isFilter
					items={ categoriesList }
					defaultValue={ Object.keys( categoriesList ) }>
					{ __( 'Categories' ) }
				</MultiSelectMenu>
				<MultiSelectMenu id="status" onChange={ ( input ) => handleFiltering( { input, type: 'status' } ) }
					className="mr-s" isFilter
					items={ statusList }
					defaultValue={ Object.keys( statusList ) }>
					{ __( 'Status' ) }
				</MultiSelectMenu>
				<MultiSelectMenu id="pricing" onChange={ ( input ) => handleFiltering( { input, type: 'pricing' } ) }
					className="mr-s" isFilter
					items={ pricingList }
					defaultValue={ Object.keys( pricingList ) }>
					{ __( 'Pricing' ) }
				</MultiSelectMenu>
			</div>

			<div className="urlslab-modules flex-tablet-landscape flex-wrap">
				{
					! noModules
						? <h3 className="mt-xxl ma-left ma-right">No modules matching criteria</h3>
						: Object.values( modules ).map( ( module ) => {
							return (
								module.id !== 'general' && filter( module )
									? <DashboardModule key={ module.id } module={ module } labelsList={ labelsList } />
									: null
							);
						} )
				}
			</div>
		</>
	);
}

export default memo( Modules );
