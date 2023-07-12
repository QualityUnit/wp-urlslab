import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { useI18n } from '@wordpress/react-i18n';

import { setNotification } from '../../hooks/useNotifications';
import { postFetch } from '../../api/fetching';
import useOnboarding from '../../hooks/useOnboarding';

import TextArea from '../../elements/Textarea';
import Button from '../../elements/Button';
import InputField from '../../elements/InputField';
import SingleSelectMenu from '../../elements/SingleSelectMenu';

import { ReactComponent as ArrowIcon } from '../../assets/images/icons/icon-arrow.svg';

const StepSchedule = () => {
	const { __ } = useI18n();
	const { activeStep, setNextStep } = useOnboarding();
	const [ updating, setUpdating ] = useState( false );
	const [ showAdvancedSettings, setShowAdvancedSettings ] = useState( false );

	const [ data, setData ] = useState( {
		urls: document.location.origin,
		analyze_text: '1',
		follow_links: 'FOLLOW_ALL_LINKS',
		process_all_sitemaps: '1',
		scan_frequency: 'ONE_TIME',
		scan_speed_per_minute: 20,
		take_screenshot: '1',
		custom_sitemaps: '',
	} );

	const submitData = useCallback( async () => {
		setUpdating( true );
		setNotification( 'onboarding-schedule-step', { message: __( 'Saving schedule data…' ), status: 'info' } );

		const response = await postFetch( `schedule/create`, data );
		if ( response.ok ) {
			setNotification( 'onboarding-schedule-step', { message: __( 'Schedule data successfully saved!' ), status: 'success' } );
			setNextStep();
		} else {
			setNotification( 'onboarding-schedule-step', { message: __( 'Schedule data saving failed.' ), status: 'error' } );
		}

		setUpdating( false );
	}, [ data, __, setNextStep ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'Schedule your own domain' ) }</h1>
				<p className="heading-description">{ __( 'The scheduling of the domain is a critical part of the plugin. To fully harness all the features, we initially need to scan and index your website.' ) }</p>
			</div>

			<div className="urlslab-onboarding-content-settings">

				<div className="urlslab-main-settings urlslab-half-columns">
					<div className="urlslab-half-columns-col">
						<InputField
							label={ __( 'Domain' ) }
							defaultValue={ document.location.origin }
							onChange={ ( val ) => setData( { ...data, urls: val } ) }
							required
							liveUpdate
						/>
					</div>
					<div className="urlslab-half-columns-col">
						<SingleSelectMenu
							key={ data.scan_frequency }
							defaultValue={ data.scan_frequency }
							items={ {
								ONE_TIME: __( 'One Time' ),
								YEARLY: __( 'Yearly' ),
								MONTHLY: __( 'Monthly' ),
								DAILY: __( 'Daily' ),
								WEEKLY: __( 'Weekly' ),
								HOURLY: __( 'Hourly' ),
							} }
							onChange={ ( val ) => setData( { ...data, scan_frequency: val } ) }
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
						<SubmitButton data={ data } updating={ updating } submitData={ submitData } />
					}
				</div>

				{ showAdvancedSettings &&
				<div className="urlslab-advanced-settings">
					<div className="urlslab-half-columns">
						<div className="urlslab-half-columns-col">
							<InputField
								label={ __( 'Scan speed (pages per minute)' ) }
								type="number"
								defaultValue={ data.scan_speed_per_minute }
								onChange={ ( val ) => setData( { ...data, scan_speed_per_minute: val } ) }
							/>
						</div>
						<div className="urlslab-half-columns-col">
							<SingleSelectMenu
								key={ data.take_screenshot }
								defaultValue={ data.take_screenshot }
								items={ {
									1: __( 'Screenshot every page of domain (Recommended)' ),
									0: __( 'Do not take screenshots' ),
								} }
								onChange={ ( val ) => setData( { ...data, take_screenshot: val } ) }
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
								key={ data.follow_links }
								defaultValue={ data.follow_links }
								items={ {
									FOLLOW_ALL_LINKS: __( 'Follow all links' ),
									FOLLOW_NO_LINK: __( 'Do not follow' ),
								} }
								onChange={ ( val ) => setData( { ...data, follow_links: val } ) }
								defaultAccept
								autoClose
							>
								{ __( 'Links to follow' ) }
							</SingleSelectMenu>
						</div>
						<div className="urlslab-half-columns-col">
							<SingleSelectMenu
								key={ data.analyze_text }
								defaultValue={ data.analyze_text }
								items={ {
									1: __( 'Analyze page text (Recommended)' ),
									0: __( 'Do not analyze text' ),
								} }
								onChange={ ( val ) => setData( { ...data, analyze_text: val } ) }
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
								key={ data.process_all_sitemaps }
								defaultValue={ data.process_all_sitemaps }
								items={ {
									1: __( 'Process all sitemaps of domain (Recommended)' ),
									0: __( 'Schedule just single URL' ),
								} }
								onChange={ ( val ) => setData( { ...data, process_all_sitemaps: val } ) }
								defaultAccept
								autoClose
							>
								{ __( 'URLs' ) }
							</SingleSelectMenu>
						</div>
						<div className="urlslab-half-columns-col">
							<TextArea
								key={ data.custom_sitemaps }
								defaultValue={ data.custom_sitemaps }
								label={ __( 'Sitemaps' ) }
								rows={ 3 }
								onChange={ ( val ) => setData( { ...data, custom_sitemaps: val } ) }
								liveUpdate
								allowResize
							/>
						</div>
					</div>
				</div>
				}

				{ showAdvancedSettings &&
				<div className="urlslab-onboarding-content-settings-footer flex flex-justify-end">
					<SubmitButton data={ data } updating={ updating } submitData={ submitData } />
				</div>
				}

			</div>
		</div>
	);
};

const SubmitButton = React.memo( ( { data, updating, submitData } ) => {
	const { __ } = useI18n();
	return <Button
		className="active"
		onClick={ () => submitData() }
		disabled={ data.urls === '' || updating }
	>
		<span>{ __( 'Apply and next' ) }</span>
		<ArrowIcon />
	</Button>;
} );

export default React.memo( StepSchedule );
