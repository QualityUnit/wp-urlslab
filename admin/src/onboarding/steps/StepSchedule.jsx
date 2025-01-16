import React, { useState } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import { textLinesToArray } from '../../lib/helpers';
import useOnboarding from '../../hooks/useOnboarding';
import useCreditsQuery from '../../queries/useCreditsQuery';

import TextArea from '../../elements/Textarea';
import InputField from '../../elements/InputField';
import SingleSelectMenu from '../../elements/SingleSelectMenu';
import SvgIcon from '../../elements/SvgIcon';

import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Stack from '@mui/joy/Stack';

const StepSchedule = () => {
	const { __ } = useI18n();
	const { activeStep, userData, setScheduleData } = useOnboarding();
	const { data: creditsData, isFetching } = useCreditsQuery();
	const [ showAdvancedSettings, setShowAdvancedSettings ] = useState( false );
	const { scheduleData } = userData;
	const lowCredits = creditsData && parseFloat( creditsData.credits ) <= 0;

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Schedule your own domain', 'urlslab' ) }</h1>
				<p className="heading-description">{ __( 'The domain\'s scheduling is a crucial part of the plugin. To fully utilize all the features, we first need to scan and index your website.', 'urlslab' ) }</p>
			</div>

			{ isFetching
				? <Box sx={ ( theme ) => ( {
					width: '100%',
					p: theme.spacing( 4, 2 ),
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				} ) }>
					<CircularProgress sx={ { mb: 1 } } />
					{ __( 'Loading…', 'urlslab' ) }
				</Box>
				: <>
					{ ! lowCredits && scheduleData
						? <div className="urlslab-onboarding-content-settings">
							<div className="urlslab-main-settings">
								<TextArea
									rows={ 5 }
									label={ __( 'Domain(s), seperated by new line' ) }
									defaultValue={ scheduleData.urls }
									onChange={ ( val ) => setScheduleData( { ...scheduleData, urls: textLinesToArray( val ) } ) }
									required
									liveUpdate
								/>
							</div>

							<div className="urlslab-advanced-settings-toggle flex flex-justify-space-between">
								<Button
									variant="plain"
									color="neutral"
									className={ classNames( [
										'underline with-arrow',
										showAdvancedSettings ? 'flip-arrow' : null,
									] ) }
									onClick={ () => {
										setShowAdvancedSettings( ! showAdvancedSettings );
									} }>
									{ __( 'Advanced settings', 'urlslab' ) }
								</Button>

								{ ! showAdvancedSettings &&
									<SubmitButtons />
								}
							</div>

							{ showAdvancedSettings &&
								<>
									<div className="urlslab-advanced-settings">
										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<InputField
													label={ __( 'Scan speed (pages per minute)', 'urlslab' ) }
													type="number"
													defaultValue={ scheduleData.scan_speed_per_minute }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, scan_speed_per_minute: val } ) }
												/>
											</div>
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.take_screenshot }
													defaultValue={ scheduleData.take_screenshot }
													items={ {
														1: __( 'Capture a screenshot of each page (recommended)', 'urlslab' ),
														0: __( 'Disable screenshot capture', 'urlslab' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, take_screenshot: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Screenshots', 'urlslab' ) }
												</SingleSelectMenu>
											</div>
										</div>

										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.follow_links }
													defaultValue={ scheduleData.follow_links }
													items={ {
														FOLLOW_ALL_LINKS: __( 'Process all links (recommended)', 'urlslab' ),
														FOLLOW_NO_LINK: __( 'Don\'t process found links', 'urlslab' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, follow_links: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Process found links', 'urlslab' ) }
												</SingleSelectMenu>
											</div>
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.analyze_text }
													defaultValue={ scheduleData.analyze_text }
													items={ {
														1: __( 'Analyze page texts (recommended)', 'urlslab' ),
														0: __( 'Don\'t analyze page texts', 'urlslab' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, analyze_text: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Analyze text', 'urlslab' ) }
												</SingleSelectMenu>
											</div>
										</div>

										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.process_all_sitemaps }
													defaultValue={ scheduleData.process_all_sitemaps }
													items={ {
														1: __( 'Process all domain sitemaps (recommended)', 'urlslab' ),
														0: __( 'Schedule a single URL only', 'urlslab' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, process_all_sitemaps: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Sitemaps', 'urlslab' ) }
												</SingleSelectMenu>
											</div>
											<div className="urlslab-half-columns-col"></div>
										</div>
									</div>
									<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
										<SubmitButtons />
									</div>
								</>
							}
						</div>
						: <NoCreditsNotification />
					}
				</>
			}
		</div>
	);
};

const SubmitButtons = React.memo( ( { lowCredits } ) => {
	const { __ } = useI18n();
	const { userData, setScheduleData, setNextStep } = useOnboarding();

	return (
		<Stack direction="row" gap={ 1 }>
			<Button
				variant="plain"
				color="neutral"
				onClick={ () => {
					setScheduleData( { ...userData.scheduleData, urls: [] } );
					setNextStep();
				} }
			>
				{ __( 'Skip', 'urlslab' ) }
			</Button>
			<Button
				onClick={ () => setNextStep() }
				endDecorator={ <SvgIcon name="arrow" /> }
				disabled={ lowCredits || ( ! lowCredits && userData.scheduleData.urls.length === 0 ) }
			>
				{ __( 'Apply and next', 'urlslab' ) }
			</Button>
		</Stack>
	);
} );

const NoCreditsNotification = React.memo( () => {
	const { __ } = useI18n();

	return (
		<>
			<div className="flex flex-justify-center mb-xxl">
				<div className="urlslab-onboarding-nocredits-message flex-inline flex-align-center">
					<SvgIcon name="error" />
					<div className="label-text fs-m ml-s">
						{ __( 'No enough credits to schedule your domain.', 'urlslab' ) }
					</div>
					<Link
						level="body-sm"
						color="neutral"
						underline="always"
						href="https://app.flowhunt.io/flow/schedules"
						target="_blank"
					>
						{ __( 'Get API Key', 'urlslab' ) }
					</Link>
				</div>
			</div>
			<div className="flex flex-justify-center">
				<SubmitButtons lowCredits={ true } />
			</div>
		</>
	);
} );

export default React.memo( StepSchedule );
