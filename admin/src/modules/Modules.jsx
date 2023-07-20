import { memo, useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n/';
import DashboardModule from '../components/DashboardModule';
import SearchField from '../elements/SearchField';
import MultiSelectMenu from '../elements/MultiSelectMenu';
import useModulesQuery from '../queries/useModulesQuery';

function Modules() {
	const { __ } = useI18n();
	const [ filterBy, setFilterBy ] = useState( {} );
	const { data: modules, isSuccess: isSuccessModules } = useModulesQuery();

	const labelsList = useMemo( () => {
		return {
			paid: { name: __( 'Paid service' ), color: '#00c996' },
			// expert: { name: __( 'Experts', color: '#ffc996' },
			free: { name: __( 'Free' ) },
			// experimental: { name: __( 'Experimental'), color: '#ff8875' },
			beta: { name: __( 'Beta' ), color: '#75a9ff' },
			// alpha: { name: __( 'Alpha') },
			// expert: { name: __( 'Expert') },
			seo: { name: __( 'SEO' ), color: '#D4C5F9' },
			// cron: { name: __( 'Cron') },
			performance: { name: __( 'Performance' ), color: '#65B5FF' },
			tools: { name: __( 'Tools' ), color: '#FFD189' },
			ai: { name: __( 'AI' ), color: '#ff7a7a' },
		};
	}, [ __ ] );

	const statusList = {
		active: __( 'Active modules' ),
		inactive: __( 'Inactive modules' ),
	};

	let categoriesList = {};

	Object.entries( { ...labelsList } ).map( ( [ key, val ] ) => {
		const { name } = val;
		if ( key !== 'paid' && key !== 'free' ) {
			categoriesList = { ...categoriesList, [ key ]: name };
		}
		return false;
	} );

	const pricingList = {
		free: labelsList.free.name,
		paid: labelsList.paid.name,
	};

	if ( modules && modules.length === 0 ) {
		return;
	}

	const handleFiltering = ( { input, type } ) => {
		let inputValue = input;
		if ( typeof input === 'string' ) {
			inputValue = input.toLowerCase();
		}

		setFilterBy( ( filter ) => {
			return { ...filter, [ type ]: inputValue };
		} );
	};

	const filter = ( module ) => {
		const { active, labels } = module;
		const title = module.title.toLowerCase();
		const description = module.description.toLowerCase();
		const { search, categories, status, pricing } = filterBy;

		const moduleStatus = active ? 'active' : 'inactive';

		if (
			( ! search || ( search && ( title.includes( search ) || description.includes( search ) ) ) ) &&
			( ! categories?.length || labels?.some( ( label ) => categories?.includes( label ) ) ) &&
			( ! status?.length || status?.some( ( val ) => val === moduleStatus ) ) &&
			( ! pricing?.length || labels?.some( ( label ) => pricing?.includes( label ) ) )
		) {
			return true;
		}

		return false;
	};

	return ( isSuccessModules &&
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
				{ Object.values( modules ).map( ( module ) => {
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
