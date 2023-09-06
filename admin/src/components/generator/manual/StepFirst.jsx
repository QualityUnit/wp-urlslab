import { memo, useState, useContext, useRef } from 'react';

import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator from '../../../hooks/useAIGenerator';
import { getQueryCluster } from '../../../lib/aiGeneratorPanel';

import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';

import DataBox from '../../../elements/DataBox';

import { ManualGeneratorContext, NavigationButtons } from './ContentGeneratorManual';

const StepFirst = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { isFloating } = useContext( ManualGeneratorContext );
	const [ loadingKeywords, setLoadingKeywords ] = useState( false );
	const typingTimeoutRef = useRef( null );

	// handling keyword input, trying to get suggestions
	const handleChangeKeywordInput = ( val ) => {
		if ( val === '' ) {
			setAIGeneratorConfig( { keywordsList: [] } );
			return;
		}

		if ( typingTimeoutRef.current ) {
			clearTimeout( typingTimeoutRef.current );
		}

		typingTimeoutRef.current = setTimeout( async () => {
			setLoadingKeywords( true );
			const queryCluster = await getQueryCluster( val );
			setLoadingKeywords( false );
			setAIGeneratorConfig( { keywordsList: [ { q: val, checked: true }, ...queryCluster ] } );
		}, 600 );
	};

	// handling checking checkbox for keywords
	const handleKeywordsCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			return keyword;
		} );
		setAIGeneratorConfig( { keywordsList: newList } );
	};

	const validateStep = () => {
		const checkedItems = aiGeneratorConfig.keywordsList.filter( ( item ) => item.checked === true );
		return ! loadingKeywords && checkedItems.length > 0 && aiGeneratorConfig.title !== '';
	};

	return (
		<Stack spacing={ 3 }>
			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<FormControl>
						<FormLabel>{ __( 'Input value' ) }</FormLabel>
						<Input
							onChange={ ( event ) => setAIGeneratorConfig( { inputValue: event.target.value } ) }
							required
						/>
						<FormHelperText>{ __( 'Input Value to use in prompt' ) }</FormHelperText>
					</FormControl>
				)
			}

			{
				( aiGeneratorConfig.mode === 'CREATE_POST' || aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' ) && (
					<>
						<FormControl required >
							<FormLabel>{ __( 'Page title' ) }</FormLabel>
							<Input
								defaultValue={ aiGeneratorConfig.title }
								onChange={ ( event ) => setAIGeneratorConfig( { title: event.target.value } ) }
							/>
							<FormHelperText>{ __( 'Title of new page' ) }</FormHelperText>
						</FormControl>

						<FormControl required>
							<FormLabel>{ __( 'Keyword' ) }</FormLabel>
							<Input
								defaultValue={ aiGeneratorConfig.keywordsList.length > 0 ? aiGeneratorConfig.keywordsList[ 0 ].q : '' }
								onChange={ ( event ) => handleChangeKeywordInput( event.target.value ) }
							/>
							<FormHelperText>{ __( 'Keyword to pick' ) }</FormHelperText>
						</FormControl>
					</>
				)
			}

			<DataBox
				title={ __( 'Loaded keywords:' ) }
				loadingText={ __( 'Loading keywords…' ) }
				loading={ loadingKeywords }
			>
				{ aiGeneratorConfig.keywordsList.length > 0 &&
					<List>
						{ aiGeneratorConfig.keywordsList.map( ( keyword, index ) => {
							return (
								<ListItem key={ keyword.q }>
									<Checkbox
										size="sm"
										label={ keyword.q }
										checked={ keyword.checked }
										onChange={ ( event ) => handleKeywordsCheckboxCheck( event.target.checked, index ) }
										overlay
									/>
								</ListItem>
							);
						} )
						}
					</List>
				}
			</DataBox>

			<NavigationButtons disableNext={ ! validateStep() } />

		</Stack>

	);
};

export default memo( StepFirst );
