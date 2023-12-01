import React, { useMemo, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

import useOnboarding from '../../hooks/useOnboarding';
import InputField from '../../elements/InputField';

import SvgIcon from '../../elements/SvgIcon';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import { __ } from '@wordpress/i18n';
import Typography from '@mui/joy/Typography';
import ListItem from '@mui/joy/ListItem';
import { ListItemButton } from '@mui/joy';
import List from '@mui/joy/List';
import useTablePanels from '../../hooks/useTablePanels';
import { SingleSelectMenu, SortBy, Table, TooltipSortingFiltering, useInfiniteFetch } from '../../lib/tableImports';
import { domainTypes } from '../../lib/serpUrlColumns';
import useChangeRow from '../../hooks/useChangeRow';

const defaultSorting = [ { key: 'domain_id', dir: 'DESC', op: '<' } ];

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug: 'serp-domains', defaultSorting } );
	const { activeStep, setNextStep, userData, setApiKey } = useOnboarding();
	const { updateRow } = useChangeRow( { defaultSorting } );
	const [ competitorDomains, setCompetitorDomains ] = useState( userData.competitors );

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
					internalData.currentStage === 2 && (
					<Button
						onClick={ () => {
						} }
						endDecorator={ <SvgIcon name="arrow" /> }
						disabled={ competitorDomains.length === 0 }
					>
						{ __( 'Apply and next' ) }
					</Button>
				</div>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
