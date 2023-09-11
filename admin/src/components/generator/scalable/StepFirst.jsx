import { memo, useState, useContext, useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import fileDownload from 'js-file-download';
import { jsonToCSV, useCSVReader } from 'react-papaparse';

import { arrayToTextLines, textLinesToArray } from '../../../lib/helpers';
import useAIGenerator from '../../../hooks/useAIGenerator';

import { sampleKeywordData } from '../../../data/sample-keywords-data.json';
import { ScalableGeneratorContext } from './ContentGeneratorScalable';

import { ReactComponent as ImportIcon } from '../../../assets/images/icons/icon-import.svg';
import { ReactComponent as SuccessIcon } from '../../../assets/images/icons/icon-checkmark.svg';
import DataBox from '../../../elements/DataBox';
import StepNavigation, { StepNavigationHeader } from '../../StepNavigation';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import Alert from '@mui/joy/Alert';
import Typography from '@mui/joy/Typography';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/joy/Button';

const StepFirst = () => {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader();
	const { isFloating, currentStep, setCurrentStep, steps } = useContext( ScalableGeneratorContext );
	const { aiGeneratorScalableHelpers, setAIGeneratorScalableHelpers } = useAIGenerator();
	const [ textareaKeywords, setTextareaKeywords ] = useState( arrayToTextLines( aiGeneratorScalableHelpers.keywords ) );

	const handleDownloadSampleData = () => {
		const csv = jsonToCSV( sampleKeywordData, {
			delimiter: ',',
			header: true }
		);

		fileDownload( csv, 'sample-keywords.csv' );
	};

	// on textarea change save validated array
	useEffect( () => {
		setAIGeneratorScalableHelpers( { keywords: textLinesToArray( textareaKeywords ) } );
	}, [ textareaKeywords, setAIGeneratorScalableHelpers ] );

	const isValidStep = () => aiGeneratorScalableHelpers.keywords.length !== 0;

	return (
		<Stack spacing={ 3 }>

			<StepNavigationHeader
				stepData={ { currentStep, setCurrentStep } }
				disableNext={ ! isValidStep() }
				steps={ steps }
			/>

			<FormControl>
				<FormLabel>{ __( 'Keywords' ) }</FormLabel>
				<Textarea
					value={ textareaKeywords }
					minRows={ 5 }
					maxRows={ 5 }
					onChange={ ( event ) => setTextareaKeywords( event.target.value ) }
					required
				/>
				<FormHelperText>{ __( 'List of keywords used to create a posts. Type one keyword per line or import list of keywords from CSV file using options below.' ) }</FormHelperText>
			</FormControl>
			<DataBox sx={ { p: 2 } }>
				<Stack spacing={ 2 } alignItems="center">
					<Typography level="body-sm" component="p" textAlign="center" >
						{ __( 'Import the CSV file with keywords you want to create posts from.' ) }
						<br />
						{ __( 'CSV file should contain a header named \'keyword\'.' ) }
					</Typography>

					<CSVReader
						onUploadAccepted={ ( results ) => {
							setTextareaKeywords( arrayToTextLines( results.data.map( ( k ) => k.keyword ).filter( ( k ) => k !== '' ) ) );
						} }
						config={ {
							header: true,
						} }
					>
						{ ( {
							getRootProps,
							acceptedFile,
						} ) => (
							<>
								<Stack direction="row" justifyContent="center" spacing={ 1 }>
									<Button
										startDecorator={ <ImportIcon /> }
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
								{ acceptedFile &&
									<Alert
										variant="soft"
										color="success"
										startDecorator={ <SuccessIcon /> }
									>
										{ __( 'Successfully imported file:' ) }&nbsp;{ acceptedFile.name }
									</Alert>
								}

							</>

						) }
					</CSVReader>
				</Stack>
			</DataBox>

			<StepNavigation stepData={ { currentStep, setCurrentStep } } disableNext={ ! isValidStep() } />

		</Stack>

	);
};

export default memo( StepFirst );
