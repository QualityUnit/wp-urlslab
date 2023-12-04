import React, { useMemo } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import { SingleSelectMenu, SortBy, Table, TooltipSortingFiltering, useInfiniteFetch } from '../../lib/tableImports';
import { domainTypes } from '../../lib/serpUrlColumns';
import useChangeRow from '../../hooks/useChangeRow';

const defaultSorting = [ { key: 'domain_id', dir: 'DESC', op: '<' } ];

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const {
		columnHelper,
		data,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug: 'serp-domains', defaultSorting } );
	const { activeStep, userData } = useOnboarding();
	const { updateRow } = useChangeRow( { defaultSorting } );

	const columns = useMemo( () => [
		columnHelper.accessor( 'domain_name', {
			tooltip: ( cell ) => cell.getValue(),
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

			<div className="urlslab-onboarding-content-settings">
				<Table className="fadeInto" columns={ columns }
					   data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) } defaultSorting={ defaultSorting }
					   referrer={ ref } loadingRows={ isFetchingNextPage }>
					<TooltipSortingFiltering />
				</Table>
				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
					{
						<Button
							onClick={ () => {
							} }
							endDecorator={ <SvgIcon name="arrow" /> }
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
