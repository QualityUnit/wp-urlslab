import Button from './Button';
import InputField from './InputField';
import { useState } from 'react';
import '../assets/styles/components/_EditableList.scss';

export default function EditableList( { label, placeholder, itemList, addItemCallback, removeItemCallback } ) {
	const [ newItem, setNewItem ] = useState( '' );

	const handleAddNewItem = () => {
		if ( newItem !== '' ) {
			addItemCallback( newItem );
			setNewItem( '' );
		}
	};

	return (
		<div className="urlslab-EditableList">
			<div className="urlslab-EditableList-items">

				{ itemList.length > 0 && itemList.map( ( item ) =>
					<div className="urlslab-EditableList-item">
						<div className="urlslab-EditableList-item-input">
							<InputField
								label={ label }
								defaultValue={ item }
								readonly
							/>
						</div>

						<div className="urlslab-EditableList-item-btn">
							<Button onClick={ () => removeItemCallback( item ) } danger>Remove</Button>
						</div>
					</div>
				)
				}

				<div className="urlslab-EditableList-item">
					<InputField
						label={ label }
						liveUpdate
						defaultValue=""
						onChange={ ( val ) => setNewItem( val ) }
						className="urlslab-EditableList-item-input"
						placeholder={ placeholder }
					/>
					<div className="urlslab-EditableList-item-btn">
						<Button onClick={ handleAddNewItem } active>Add New</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
