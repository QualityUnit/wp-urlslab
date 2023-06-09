/*
 *	Elements allow us to use partially typed default jsx components from main URLsLab app.
 *	All jsx elements properties are required by default, set them to default undefined value that represents default behavior if property is not used in component.
 */

import React from 'react';
import JSXButton from '../../../elements/Button';
import JSXSingleSelectMenu from '../../../elements/SingleSelectMenu';
import JSXTextArea from '../../../elements/Textarea';
import JSXInputField from '../../../elements/InputField';
import JSXCheckbox from '../../../elements/Checkbox';

import { InfoTooltipIcon } from './InfoTooltipIcon';

// Customized SingleSelectMenu element, with ability to use also tooltip react component in label.
// Default component inserts label text using "dangerouslySetInnerHTML" what disallow us to use another components in label.
type SingleSelectMenuType = Partial<{
	className: string
	name: string
	style: string,
	items: {[key:string]: string}
	description: string
	defaultValue: string,
	defaultAccept: boolean
	autoClose: boolean
	disabled: boolean
	isFilter: boolean
	onChange: ( value: string ) => void,
	tooltipLabel: {
		tooltip: string,
		label: string
	}
}> & React.PropsWithChildren

export const SingleSelectMenu: React.FC<SingleSelectMenuType > = React.memo( ( {
	tooltipLabel, children, className = undefined, name = undefined, style = undefined, items = undefined, description = undefined, defaultValue = undefined, defaultAccept = undefined, autoClose = undefined, disabled = undefined, isFilter = undefined, onChange = undefined,
}:SingleSelectMenuType ) => {
	return (
		<>
			{ tooltipLabel
				? <div className="urlslab-tooltipLabel flex flex-align-center">
					<span className="urlslab-inputField-label">{ tooltipLabel.label }</span>
					<InfoTooltipIcon text={ tooltipLabel.tooltip } />
				</div>
				: null
			}
			<JSXSingleSelectMenu className={ className } name={ name } style={ style } items={ items } description={ description } defaultValue={ defaultValue } defaultAccept={ defaultAccept } autoClose={ autoClose } disabled={ disabled } isFilter={ isFilter } onChange={ onChange }>{ tooltipLabel ? null : children }</JSXSingleSelectMenu>
		</>
	);
} );
SingleSelectMenu.displayName = 'SingleSelectMenu';

type CheckboxType = Partial<{
	defaultValue: boolean
	textBefore: boolean
	smallText: boolean
	readOnly: boolean
	radial: boolean
	name: string
	className: string
	onChange: ( isChecked: boolean ) => void
}> & React.PropsWithChildren

export const Checkbox: React.FC<CheckboxType> = React.memo( ( {
	defaultValue = undefined, smallText = undefined, readOnly = undefined, radial = undefined, name = undefined, className = undefined, onChange = undefined, textBefore = undefined, children,
}: CheckboxType ) => {
	return <JSXCheckbox defaultValue={ defaultValue } smallText={ smallText } readOnly={ readOnly } radial={ radial } name={ name } className={ className } onChange={ onChange } textBefore={ textBefore }>{ children }</JSXCheckbox>;
} );
Checkbox.displayName = 'Checkbox';

type ButtonType = Partial<{
	className: string
	type: 'button' | 'submit' | 'reset'
	active: boolean
	danger: boolean
	disabled: boolean
	href: string
	onClick: () => void
	target: string
}> & React.PropsWithChildren

export const Button: React.FC<ButtonType> = React.memo( ( {
	children, active = undefined, danger = undefined, type = undefined, className = undefined, disabled = undefined, onClick = undefined, href = undefined, target = undefined,
}:ButtonType ) => {
	return <JSXButton active={ active } danger={ danger } type={ type } className={ className } disabled={ disabled } onClick={ onClick } href={ href } target={ target }>{ children }</JSXButton>;
} );
Button.displayName = 'Button';

type TextAreaType = Partial<{
	defaultValue: string
	autoFocus: boolean
	placeholder: string
	liveUpdate: boolean
	className: string
	readonly: boolean
	disabled: boolean
	label: string
	description: string
	labelInline: boolean
	onChange: ( value: string ) => void
	style:string
	rows: number
}> & React.PropsWithChildren

export const TextArea: React.FC<TextAreaType> = React.memo( ( {
	children, defaultValue = undefined, autoFocus = undefined, placeholder = undefined, liveUpdate = undefined, className = undefined, readonly = undefined, disabled = undefined, label = undefined, description = undefined, labelInline = undefined, onChange = undefined, style = undefined, rows = undefined,
}: TextAreaType ) => {
	return <JSXTextArea defaultValue={ defaultValue } autoFocus={ autoFocus } placeholder={ placeholder } liveUpdate={ liveUpdate } className={ className } readonly={ readonly } disabled={ disabled } label={ label } description={ description } labelInline={ labelInline } onChange={ onChange } style={ style } rows={ rows }>{ children }</JSXTextArea>;
} );
TextArea.displayName = 'TextArea';

type InputFieldType = Partial<{
	type: 'text' | 'email' | 'number'
	defaultValue: number | string
	isLoading: boolean
	autoFocus: boolean
	placeholder: string
	message: string
	liveUpdate: boolean
	className: string
	readonly: boolean
	disabled: boolean
	label: string
	description: string
	labelInline: boolean
	onChange: ( event: React.ChangeEvent<HTMLInputElement> ) => void
	onKeyDown: ( event: KeyboardEvent ) => void
	onKeyUp: ( event: KeyboardEvent ) => void
	onBlur: ( event: FocusEvent ) => void
	onFocus: ( event: FocusEvent ) => void
	style: string
}> & React.PropsWithChildren

export const InputField: React.FC<InputFieldType> = React.memo( (
	{ defaultValue = undefined, isLoading = undefined, autoFocus = undefined, placeholder = undefined, message = undefined, liveUpdate = undefined, className = undefined, type = undefined, readonly = undefined, disabled = undefined, label = undefined, description = undefined, labelInline = undefined, onChange = undefined, onKeyDown = undefined, onBlur = undefined, onFocus = undefined, onKeyUp = undefined, children = undefined, style = undefined }: InputFieldType,
) => {
	return <JSXInputField
		defaultValue={ defaultValue }
		isLoading={ isLoading }
		autoFocus={ autoFocus }
		placeholder={ placeholder }
		message={ message }
		liveUpdate={ liveUpdate }
		className={ className }
		type={ type }
		readonly={ readonly }
		disabled={ disabled }
		label={ label }
		description={ description }
		labelInline={ labelInline }
		onChange={ onChange }
		onKeyDown={ onKeyDown }
		onBlur={ onBlur }
		onFocus={ onFocus }
		onKeyUp={ onKeyUp }
		style={ style }>{ children }</JSXInputField>;
} );
InputField.displayName = 'InputField';

