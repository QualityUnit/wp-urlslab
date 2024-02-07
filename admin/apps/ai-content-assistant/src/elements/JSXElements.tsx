/*
 *	Elements allow us to use partially typed default jsx components from main URLsLab app.
 *	All jsx elements properties are required by default, set them to default undefined value that represents default behavior if property is not used in component.
 */

import React from 'react';
import JSXButton from '../../../../src/elements/Button';
import JSXSingleSelectMenu from '../../../../src/elements/SingleSelectMenu';
import JSXTextArea from '../../../../src/elements/Textarea';
import JSXInputField from '../../../../src/elements/InputField';
import JSXCheckbox from '../../../../src/elements/Checkbox';
import JSXTooltip from '../../../../src/elements/Tooltip';

import { InfoTooltipIcon } from './InfoTooltipIcon';

// Customized SingleSelectMenu element, with ability to use also tooltip react component in label.
// Default component inserts label text using "dangerouslySetInnerHTML" what disallow us to use another components in label.
type SingleSelectMenuType = Partial<{
	className: string
	name: string
	style: React.CSSProperties,
	items: {[key:string]: string}
	description: string
	value: string,
	defaultValue: string,
	defaultAccept: boolean
	autoClose: boolean
	required: boolean
	disabled: boolean
	isFilter: boolean
	onChange: ( value: string ) => void,
	dark: boolean,
	tooltipLabel: {
		tooltip: string,
		label: string
		noWrapText?: boolean
	},
	labels: React.ReactElement[] | HTMLElement[]

}> & React.PropsWithChildren

export const SingleSelectMenu: React.FC<SingleSelectMenuType > = React.memo( ( {
	tooltipLabel, children, className = undefined, name = undefined, style = undefined, items = undefined, description = undefined, value = undefined, defaultValue = undefined, defaultAccept = undefined, autoClose = undefined, disabled = undefined, isFilter = undefined, required = undefined, onChange = undefined, dark = undefined, labels = undefined,
}:SingleSelectMenuType ) => {
	return (
		<>
			{ tooltipLabel
				? <div className="urlslab-tooltipLabel flex flex-align-center">
					<span className={ `urlslab-inputField-label ${ required ? 'required' : '' }` }>{ tooltipLabel.label }</span>
					<InfoTooltipIcon text={ tooltipLabel.tooltip } noWrapText />
				</div>
				: null
			}
			<JSXSingleSelectMenu className={ className } name={ name } style={ style } items={ items } description={ description } value={ value } defaultValue={ defaultValue } defaultAccept={ defaultAccept } autoClose={ autoClose } disabled={ disabled } isFilter={ isFilter } required={ required } onChange={ onChange } dark={ dark } labels={ labels }>{ tooltipLabel ? null : children }</JSXSingleSelectMenu>
		</>
	);
} );
SingleSelectMenu.displayName = 'SingleSelectMenu';

type TooltipType = Partial<{
	active: boolean
	center: boolean
	className: string
	style: React.CSSProperties
	width: string
}> & React.PropsWithChildren
export const Tooltip:React.FC<TooltipType> = React.memo( ( {
	active, center, className, width, style, children,
}: TooltipType ) => {
	return <JSXTooltip active={ active } center={ center } className={ className } style={ { ...style, ...( width && { width } ) } }>{ children }</JSXTooltip>;
} );
Tooltip.displayName = 'Tooltip';

type CheckboxType = Partial<{
	defaultValue: boolean
	value: boolean
	textBefore: boolean
	smallText: boolean
	readOnly: boolean
	disabled: boolean
	radial: boolean
	hasComponent: boolean
	name: string
	className: string
	onChange: ( isChecked: boolean ) => void
}> & React.PropsWithChildren

export const Checkbox: React.FC<CheckboxType> = React.memo( ( {
	defaultValue = undefined, value = undefined, hasComponent = undefined, smallText = undefined, disabled = undefined, readOnly = undefined, radial = undefined, name = undefined, className = undefined, onChange = undefined, textBefore = undefined, children,
}: CheckboxType ) => {
	return <JSXCheckbox defaultValue={ defaultValue } value={ value } hasComponent={ hasComponent } smallText={ smallText } disabled={ disabled } readOnly={ readOnly } radial={ radial } name={ name } className={ className } onChange={ onChange } textBefore={ textBefore }>{ children }</JSXCheckbox>;
} );
Checkbox.displayName = 'Checkbox';

type ButtonType = Partial<{
	className: string
	style: React.CSSProperties
	type: 'button' | 'submit' | 'reset'
	active: boolean
	danger: boolean
	disabled: boolean
	href: string
	onClick: () => void
	target: string
}> & React.PropsWithChildren

export const Button: React.FC<ButtonType> = React.memo( ( {
	children, active = undefined, danger = undefined, type = undefined, style = undefined, className = undefined, disabled = undefined, onClick = undefined, href = undefined, target = undefined,
}:ButtonType ) => {
	return <JSXButton active={ active } danger={ danger } type={ type } style={ style } className={ className } disabled={ disabled } onClick={ onClick } href={ href } target={ target }>{ children }</JSXButton>;
} );
Button.displayName = 'Button';

type TextAreaType = Partial<{
	defaultValue: string
	autoFocus: boolean
	newLineSeparator: boolean
	placeholder: string
	liveUpdate: boolean
	className: string
	readonly: boolean
	disabled: boolean
	required: boolean
	title: string
	label: string
	description: string
	labelInline: boolean
	onChange: ( value: string ) => void
	style: React.CSSProperties
	rows: number
	allowResize: boolean
}> & React.PropsWithChildren

export const TextArea: React.FC<TextAreaType> = React.memo( ( {
	allowResize, children, defaultValue = undefined, autoFocus = undefined, placeholder = undefined, liveUpdate = undefined, className = undefined, readonly = undefined, disabled = undefined, newLineSeparator = undefined, title = undefined, label = undefined, description = undefined, labelInline = undefined, required = undefined, onChange = undefined, style = undefined, rows = undefined,
}: TextAreaType ) => {
	return <JSXTextArea defaultValue={ defaultValue } title={ title } autoFocus={ autoFocus } placeholder={ placeholder } liveUpdate={ liveUpdate } className={ className } readonly={ readonly } disabled={ disabled } newLineSeparator={ newLineSeparator } label={ label } description={ description } labelInline={ labelInline } required={ required } onChange={ onChange } style={ style } rows={ rows } allowResize={ allowResize }>{ children }</JSXTextArea>;
} );
TextArea.displayName = 'TextArea';

type InputFieldType = Partial<{
	type: 'text' | 'email' | 'number' | 'url'
	defaultValue: number | string
	value: number | string
	isLoading: boolean
	autoFocus: boolean
	placeholder: string
	min: number
	max: number
	message: string
	liveUpdate: boolean
	className: string
	readonly: boolean
	disabled: boolean
	required: boolean
	label: string
	title: string
	description: string
	labelInline: boolean
	style: React.CSSProperties
	onChange: ( value: string | number ) => void // follow type by source jsx element where onChange manipulate with direct value instead of event
	onKeyDown: ( event: KeyboardEvent ) => void
	onKeyUp: ( event: KeyboardEvent ) => void
	onBlur: ( event: FocusEvent ) => void
	onFocus: ( event: FocusEvent ) => void
}> & React.PropsWithChildren

export const InputField: React.FC<InputFieldType> = React.memo( (
	{ defaultValue = undefined, value = undefined, isLoading = undefined, autoFocus = undefined, placeholder = undefined, message = undefined, liveUpdate = undefined, className = undefined, type = undefined, min = undefined, max = undefined, required = undefined, readonly = undefined, disabled = undefined, title = undefined, label = undefined, description = undefined, labelInline = undefined, onChange = undefined, onKeyDown = undefined, onBlur = undefined, onFocus = undefined, onKeyUp = undefined, children = undefined, style = undefined }: InputFieldType,
) => {
	return <JSXInputField
		defaultValue={ defaultValue }
		value={ value }
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
		title={ title }
		description={ description }
		labelInline={ labelInline }
		onChange={ onChange }
		onKeyDown={ onKeyDown }
		onBlur={ onBlur }
		onFocus={ onFocus }
		onKeyUp={ onKeyUp }
		required={ required }
		min={ min }
		max={ max }
		style={ style }>{ children }</JSXInputField>;
} );
InputField.displayName = 'InputField';

