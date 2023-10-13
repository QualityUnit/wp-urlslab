import { memo, useRef, useState, useCallback, useContext, useEffect } from 'react';
import { __ } from '@wordpress/i18n';

import fileDownload from 'js-file-download';
import { jsonToCSV, useCSVReader } from 'react-papaparse';

import { arrayToTextLines, textLinesToArray } from '../../../lib/helpers';
import useAIGenerator from '../../../hooks/useAIGenerator';

import { sampleKeywordData } from '../../../data/sample-keywords-data.json';
import { ScalableGeneratorContext } from './ContentGeneratorScalable';

import StepNavigation, { StepNavigationHeader } from '../../StepNavigation';

import SvgIcon from '../../../elements/SvgIcon';
import DataBox from '../../../elements/DataBox';
import CountrySelect from '../../../elements/CountrySelect';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import Typography from '@mui/joy/Typography';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import Box from '@mui/joy/Box';

const StepFirst = () => {
	const { currentStep, setCurrentStep, steps } = useContext( ScalableGeneratorContext );
	const { aiGeneratorScalableHelpers, setAIGeneratorScalableHelpers } = useAIGenerator();
	const { keywords, keywordsInputType } = aiGeneratorScalableHelpers;

	const isValidStep = () => keywords[ keywordsInputType ].length !== 0;

	return (
		<Stack spacing={ 3 }>

			<StepNavigationHeader
				stepData={ { currentStep, setCurrentStep } }
				disableNext={ ! isValidStep() }
				steps={ steps }
			/>

			<Tabs
				defaultValue={ keywordsInputType }
				onChange={ ( event, value ) => setAIGeneratorScalableHelpers( { keywordsInputType: value } ) }
				tabFlex="auto"
			>
				<TabList size="sm">
					<Tab value="manual" variant="simple">{ __( 'Manual input' ) }</Tab>
					<Tab value="csv" variant="simple">{ __( 'CSV import' ) }</Tab>
				</TabList>
				<TabPanel value="manual">
					<KeywordsManualInput />
				</TabPanel>
				<TabPanel value="csv">
					<KeywordsCsvInput />

				</TabPanel>
			</Tabs>

			<StepNavigation stepData={ { currentStep, setCurrentStep } } disableNext={ ! isValidStep() } />

		</Stack>

	);
};

const KeywordsManualInput = memo( () => {
	const { aiGeneratorScalableHelpers, setAIGeneratorScalableHelpers } = useAIGenerator();
	const { keywords, country } = aiGeneratorScalableHelpers;

	const [ textareaKeywords, setTextareaKeywords ] = useState( arrayToTextLines( keywords.manual.map( ( k ) => {
		return k.keyword;
	} ) ) );

	// on textarea change save validated array
	useEffect( () => {
		setAIGeneratorScalableHelpers(
			{
				keywords: {
					...aiGeneratorScalableHelpers.keywords,
					manual: textLinesToArray( textareaKeywords ).map( ( keyword ) => {
						return { keyword, country };
					} ),
				},
			}
		);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ textareaKeywords, country ] );

	return (
		<Stack spacing={ 3 }>
			<FormControl>
				<Textarea
					value={ textareaKeywords }
					placeholder={ __( 'Keywords' ) }
					minRows={ 5 }
					maxRows={ 5 }
					onChange={ ( event ) => setTextareaKeywords( event.target.value ) }
					required
				/>
				<FormHelperText>{ __( 'List of keywords used to create a posts. Type one keyword per line or import list of keywords from CSV file using options below.' ) }</FormHelperText>
			</FormControl>

			<FormControl>
				<FormLabel>{ __( 'Country' ) }</FormLabel>
				<CountrySelect value={ country } onChange={ ( value ) => setAIGeneratorScalableHelpers( { country: value } ) } />
			</FormControl>
		</Stack>
	);
} );

const KeywordsCsvInput = memo( () => {
	const { CSVReader } = useCSVReader();
	const { aiGeneratorScalableHelpers, setAIGeneratorScalableHelpers } = useAIGenerator();
	const [ validationError, setValidationError ] = useState( null );
	const [ importedFileName, setImportedFileName ] = useState( '' );
	const { keywords } = aiGeneratorScalableHelpers;

	const handleDownloadSampleData = useCallback( () => {
		const csv = jsonToCSV( sampleKeywordData, {
			delimiter: ',',
			header: true }
		);

		fileDownload( csv, 'sample-keywords.csv' );
	}, [] );

	const validateUploadedData = useCallback( ( uploadedData ) => {
		// check for required keyword columns header, otherwise keywords object may contain incorrect type instead of required [ { keyword: string, country: string }, ... ]
		// consider country header as not required, will be added default value
		if ( ! Object.keys( uploadedData[ 0 ] ).includes( 'keyword' ) ) {
			setValidationError( 'missingKeyword' );
			return;
		}

		const validatedData = uploadedData.reduce( ( result, item ) => {
			// skip rows with no keyword
			if ( ! item.keyword ) {
				return result;
			}

			// if country not defined, add default
			if ( ! item.country ) {
				item.country = 'us';
			}

			result.push( item );
			return result;
		}, [] );

		setAIGeneratorScalableHelpers( { keywords: { ...keywords, csv: validatedData } } );
		setValidationError( '' );
	}, [ keywords, setAIGeneratorScalableHelpers ] );

	return (
		<>
			<DataBox sx={ { p: 2 } }>
				<Stack spacing={ 2 } alignItems="center">
					<Typography level="body-sm" component="p" textAlign="center" sx={ ( theme ) => ( { 'span.code-font': { fontFamily: theme.fontFamily.code } } ) } >
						{ __( 'Import the CSV file with keywords you want to create posts from.' ) }
						<br />
						{ __( 'CSV file should contain header cells:' ) }
						<span className="code-font">keyword</span>,
						<span className="code-font">country</span>
					</Typography>

					<CSVReader
						onUploadAccepted={ ( results ) => {
							if ( results?.data?.length ) {
								setAIGeneratorScalableHelpers( { keywords: { ...keywords, csv: [] } } );
								validateUploadedData( results.data );
							}
						} }
						config={ { header: true } }
					>
						{ ( { getRootProps, acceptedFile } ) => {
							if ( acceptedFile ) {
								setImportedFileName( acceptedFile.name );
							}
							return (
								<>
									<Stack direction="row" justifyContent="center" spacing={ 1 }>
										<Button
											startDecorator={ <SvgIcon name="import" /> }
											{ ...getRootProps() }
										>
											{ __( 'Import CSV' ) }
										</Button>
										<Button
											variant="soft"
											color="neutral"
											onClick={ handleDownloadSampleData }
										>
											{ __( 'Download sample file' ) }
										</Button>
									</Stack>

								</>

							);
						} }
					</CSVReader>

					{ ( importedFileName && ! validationError ) &&
						<Alert
							variant="soft"
							color="success"
						>
							{ __( 'Successfully imported file:' ) }&nbsp;{ importedFileName }
						</Alert>
					}

					{ validationError &&
					<Alert
						variant="soft"
						color="danger"
						sx={ ( theme ) => ( { 'span.code-font': { fontFamily: theme.fontFamily.code } } ) }
					>
						{ validationError === 'missingKeyword' &&
						<>
							{ __( 'Missing required column header:' ) }
							<span className="code-font">keyword</span>
						</>
						}
					</Alert>
					}
				</Stack>
			</DataBox>

			{ keywords.csv.length > 0 &&
				<ImportedDataTable keywords={ keywords.csv } />
			}
		</>
	);
} );

const ImportedDataTable = memo( ( { keywords } ) => {
	const showMax = useRef( 5 );

	return (
		<DataBox sx={ { p: 2, mt: 3 } }>
			<Typography component="p" textAlign="center" fontSize="sm" fontWeight="lg" >{ __( 'Imported keywords:' ) + ` ${ keywords.length }` }</Typography>
			<Box
				fontSize="sm"
				sx={ { mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' } }
			>
				<Box
					component="table"
					sx={ ( theme ) => ( {
						position: 'relative',
						...( keywords.length > showMax.current &&
						{
							':after': {
								content: '""',
								position: 'absolute',
								bottom: 0,
								left: 0,
								width: '100%',
								height: '100%',
								background: 'linear-gradient(0deg, var(--urlslab-palette-background-surface) 0%, transparent 100%)',
							},
						}
						),
						th: {

							fontSize: theme.vars.fontSize.xs,
							textTransform: 'uppercase',
							textAlign: 'left',
						},
						td: {
							pr: 2,
							'&:first-child': {
								textAlign: 'right',
								pr: 1,
							},
						},
					} ) }
				>
					<thead>
						<tr>
							<th></th>
							<th>{ __( 'Keyword' ) }</th>
							<th>{ __( 'Country' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ keywords.slice( 0, showMax.current ).map( ( k, index ) => {
							return (
								<tr key={ `${ index }-${ k.keyword } - ${ k.country }` }>
									<td>{ `${ index + 1 }.` }</td>
									<td>{ k.keyword }</td>
									<td>{ k.country }</td>
								</tr>
							);
						} ) }
					</tbody>
				</Box>
				{ keywords.length > showMax.current &&
					<Typography
						fontSize="xs"
						fontWeight="lg"
						textAlign="center"
						textTransform="uppercase"
						sx={ { opacity: 0.5, pt: 1 } }
					>
						{
							// translators: %i is generated number value, do not change it
							__( 'And %i more…' ).replace( '%i', keywords.length - showMax.current )
						}
					</Typography>
				}
			</Box>
		</DataBox>
	);
} );

export default memo( StepFirst );
