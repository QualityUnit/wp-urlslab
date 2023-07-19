import React, { useState } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import useOnboarding from '../../hooks/useOnboarding';
import useCreditsQuery from '../../queries/useCreditsQuery';

import TextArea from '../../elements/Textarea';
import Button from '../../elements/Button';
import InputField from '../../elements/InputField';
import SingleSelectMenu from '../../elements/SingleSelectMenu';
import Loader from '../../components/Loader';

import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';
import { ReactComponent as ErrorIcon } from '../../assets/images/icons/icon-error.svg';

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
				<h1 className="heading-title">{ __( 'Schedule your own domain' ) }</h1>
				<p className="heading-description">{ __( 'The scheduling of the domain is a critical part of the plugin. To fully harness all the features, we initially need to scan and index your website.' ) }</p>
			</div>

			{ isFetching
				? <Loader />
				: <>
					{ ! lowCredits && scheduleData
						? <div className="urlslab-onboarding-content-settings">
							<div className="urlslab-main-settings urlslab-half-columns">
								<div className="urlslab-half-columns-col">
									<InputField
										label={ __( 'Domain' ) }
										defaultValue={ scheduleData.urls }
										onChange={ ( val ) => setScheduleData( { ...scheduleData, urls: val } ) }
										required
										liveUpdate
									/>
								</div>
								<div className="urlslab-half-columns-col">
									<SingleSelectMenu
										key={ scheduleData.scan_frequency }
										defaultValue={ scheduleData.scan_frequency }
										items={ {
											ONE_TIME: __( 'One Time' ),
											YEARLY: __( 'Yearly' ),
											MONTHLY: __( 'Monthly' ),
											DAILY: __( 'Daily' ),
											WEEKLY: __( 'Weekly' ),
											HOURLY: __( 'Hourly' ),
										} }
										onChange={ ( val ) => setScheduleData( { ...scheduleData, scan_frequency: val } ) }
										defaultAccept
										autoClose
									>
										{ __( 'Scan frequency' ) }
									</SingleSelectMenu>
								</div>
							</div>

							<div className="urlslab-advanced-settings-toggle flex flex-justify-space-between">
								<Button
									className={ classNames( [
										'simple underline with-arrow',
										showAdvancedSettings ? 'flip-arrow' : null,
									] ) }
									onClick={ () => {
										setShowAdvancedSettings( ! showAdvancedSettings );
									} }>
									{ __( 'Advanced settings' ) }
								</Button>

								{ ! showAdvancedSettings &&
									<SubmitButton />
								}
							</div>

							{ showAdvancedSettings &&
								<>
									<div className="urlslab-advanced-settings">
										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<InputField
													label={ __( 'Scan speed (pages per minute)' ) }
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
														1: __( 'Screenshot every page of domain (Recommended)' ),
														0: __( 'Do not take screenshots' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, take_screenshot: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Screenshot' ) }
												</SingleSelectMenu>
											</div>
										</div>

										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.follow_links }
													defaultValue={ scheduleData.follow_links }
													items={ {
														FOLLOW_ALL_LINKS: __( 'Follow all links' ),
														FOLLOW_NO_LINK: __( 'Do not follow' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, follow_links: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Links to follow' ) }
												</SingleSelectMenu>
											</div>
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.analyze_text }
													defaultValue={ scheduleData.analyze_text }
													items={ {
														1: __( 'Analyze page text (Recommended)' ),
														0: __( 'Do not analyze text' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, analyze_text: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Analyse text' ) }
												</SingleSelectMenu>
											</div>
										</div>

										<div className="urlslab-half-columns">
											<div className="urlslab-half-columns-col">
												<SingleSelectMenu
													key={ scheduleData.process_all_sitemaps }
													defaultValue={ scheduleData.process_all_sitemaps }
													items={ {
														1: __( 'Process all sitemaps of domain (Recommended)' ),
														0: __( 'Schedule just single URL' ),
													} }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, process_all_sitemaps: val } ) }
													defaultAccept
													autoClose
												>
													{ __( 'Sitemaps' ) }
												</SingleSelectMenu>
											</div>
											<div className="urlslab-half-columns-col">
												<TextArea
													key={ scheduleData.custom_sitemaps }
													defaultValue={ scheduleData.custom_sitemaps }
													label={ __( 'Custom sitemaps' ) }
													rows={ 3 }
													onChange={ ( val ) => setScheduleData( { ...scheduleData, custom_sitemaps: val } ) }
													allowResize
												/>
											</div>
										</div>
									</div>
									<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
										<SubmitButton />
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

const SubmitButton = React.memo( ( { lowCredits } ) => {
	const { __ } = useI18n();
	const { userData, setNextStep } = useOnboarding();

	return <Button
		className="active"
		onClick={ () => setNextStep() }
		disabled={ ! lowCredits && userData.scheduleData.urls === '' }
	>
		<span>{ lowCredits ? __( 'Continue' ) : __( 'Apply and next' ) }</span>
		<ArrowIcon />
	</Button>;
} );

const NoCreditsNotification = React.memo( () => {
	const { __ } = useI18n();

	return (
		<>
			<div className="flex flex-justify-center mb-xxl">
				<div className="urlslab-onboarding-nocredits-message flex-inline flex-align-center">
					<ErrorIcon />
					<div className="label-text fs-m">
						{ __( 'No enough credits to schedule your domain.' ) }
					</div>
					<Button
						className="simple underline"
						href="https://www.urlslab.com/dashboard/"
						target="_blank"
					>
						{ __( 'Buy credits' ) }
					</Button>
				</div>
			</div>
			<div className="flex flex-justify-center">
				<SubmitButton lowCredits={ true } />
			</div>
		</>
	);
} );

export default React.memo( StepSchedule );
