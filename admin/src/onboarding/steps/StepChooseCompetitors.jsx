import React, { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import { SingleSelectMenu, SortBy, Table, TooltipSortingFiltering, useInfiniteFetch } from '../../lib/tableImports';
import { domainTypes } from '../../lib/serpUrlColumns';
import useChangeRow from '../../hooks/useChangeRow';
import useTableStore from '../../hooks/useTableStore';

import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';

const defaultSorting = [ { key: 'domain_id', dir: 'DESC', op: '<' } ];
const slug = 'serp-domains';
const paginationId = 'domain_id';
const header = {
	domain_name: __( 'Domain' ),
	domain_type: __( 'Type' ),
	top_100_cnt: __( 'Queries' ),
};
const StepPlanChoice = () => {
	const {
		columnHelper,
		data,
		isSuccess,
		isFetchingNextPage,
		isLoading,
		ref,
	} = useInfiniteFetch( { slug, defaultSorting } );
	const { activeStep, userData } = useOnboarding();
	const { updateRow } = useChangeRow( { defaultSorting } );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
						paginationId,
						slug,
						header,
						id: 'domain_name',
					},
				},
			}
		) );
	}, [ data ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'domain_name', {
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank"
				rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			className: 'nolimit',
			cell: ( cell ) => <SingleSelectMenu autoClose items={ domainTypes } name={ cell.column.id }
				defaultValue={ cell.getValue() }
				onChange={ ( newVal ) => updateRow( { newVal, cell } ) } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
	], [ columnHelper, updateRow ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Who are your competitors?' ) }</h1>
				<p className="heading-description">
					{ __( 'Identify the domains that are your competitors and the ones that should be ignored. This will help URLsLab plugin to create custom tailor-made SEO Insights for your website' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings no-content-padding">

				{ ! isLoading
					? <Table
						className="fadeInto"
						columns={ columns }
						data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) } defaultSorting={ defaultSorting }
						referrer={ ref }
						loadingRows={ isFetchingNextPage }
						maxRowsReachedText={ __( 'All results are displayed…' ) }
						containerSxStyles={ { '--Table-height': '80vh', maxHeight: '80vh', width: '100%' } }
					>
						<TooltipSortingFiltering />
					</Table>
					: <Box sx={ ( theme ) => ( {
						width: '100%',
						p: theme.spacing( 4, 2 ),
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					} ) }>
						<CircularProgress size="sm" sx={ { mb: 1 } } />
						{ __( 'Loading domains…' ) }
					</Box>
				}
				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
					{
						<Button
							onClick={ () => {} }
							endDecorator={ <SvgIcon name="arrow" /> }
							disabled={ isLoading }
						>
							{ __( 'Apply and next' ) }
						</Button>
					}
				</div>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
