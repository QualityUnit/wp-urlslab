import { memo, useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import { SortBy, Stack, Table, TooltipSortingFiltering, useInfiniteFetch } from '../../lib/tableImports';
import { domainTypes } from '../../lib/serpUrlColumns';
import useChangeRow from '../../hooks/useChangeRow';
import useTableStore from '../../hooks/useTableStore';

import DataBox from '../../elements/DataBox';
import Typography from '@mui/joy/Typography';

const defaultSorting = [ { key: 'domain_id', dir: 'DESC', op: '<' } ];
const slug = 'serp-domains';
const paginationId = 'domain_id';
const header = {
	domain_name: __( 'Domain', 'wp-urlslab' ),
	domain_type: __( 'Type', 'wp-urlslab' ),
	top_100_cnt: __( 'Queries', 'wp-urlslab' ),
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit() {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
			id: 'domain_name',
			sorting: defaultSorting,
		} );
	}, [ setTable ] );

	return init && <StepChooseCompetitors />;
}

const StepChooseCompetitors = memo( () => {
	const {
		columnHelper,
		data,
		isSuccess,
		isFetchingNextPage,
		isLoading,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );
	const { activeStep, setNextStep } = useOnboarding();
	const { updateRow } = useChangeRow();

	useEffect( () => {
		setTable( slug, {
			data,
		} );
	}, [ data, setTable ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'domain_name', {
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank"
				rel="noreferrer"><strong>{ cell.getValue() }</strong></a>,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 200,
		} ),

		columnHelper.accessor( 'domain_type', {
			filterValMenu: domainTypes,
			cell: ( cell ) => (
				<Stack direction="row" flexWrap="wrap" spacing={ 0.5 } >
					{
						Object.entries( domainTypes ).map( ( [ domainKey, domainName ] ) => {
							const selected = cell.getValue() === domainKey;
							return (
								domainKey !== 'X'
									? <Button
										key={ domainKey }
										size="xs"
										variant="outlined"
										color="neutral"
										sx={ { ...( ! selected && { opacity: 0.5 } ) } }
										onClick={ () => {
											if ( ! selected ) {
												updateRow( { newVal: domainKey, cell } );
											}
										} }
									>
										{ domainName }
									</Button>
									: null
							);
						} )
					}
				</Stack>
			),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
	], [ columnHelper, updateRow ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Who are your competitors?', 'wp-urlslab' ) }</h1>
				<p className="heading-description">
					{ __( 'Identify the domains that are your competitors and the ones that should be ignored. This will help URLsLab plugin to create custom tailor-made SEO Insights for your website', 'wp-urlslab' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				{ ( isLoading || ( isSuccess && tableData.length === 0 ) ) &&
					<DataBox
						loadingText={ __( 'Loading domains…', 'wp-urlslab' ) }
						loading={ isLoading }
						sx={ { margin: '1.25em 1.875em' } }
					>
						<Typography color="neutral" level="body-sm" sx={ { p: 1, textAlign: 'center' } }>{ __( 'We did not find any competitors domains…', 'wp-urlslab' ) }</Typography>
					</DataBox>
				}

				{ ( isSuccess && tableData.length > 0 ) &&
					<Table
						className="fadeInto"
						columns={ columns }
						data={ tableData }
						referrer={ ref }
						loadingRows={ isFetchingNextPage }
						maxRowsReachedText={ __( 'All results are displayed…', 'wp-urlslab' ) }
						containerSxStyles={ { '--Table-height': '80vh', maxHeight: '80vh', width: '100%' } }
					>
						<TooltipSortingFiltering />
					</Table>
				}
				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
					{
						<Button
							onClick={ () => setNextStep() }
							endDecorator={ <SvgIcon name="arrow" /> }
							disabled={ isLoading }
						>
							{ __( 'Apply and next', 'wp-urlslab' ) }
						</Button>
					}
				</div>
			</div>
		</div>
	);
} );
