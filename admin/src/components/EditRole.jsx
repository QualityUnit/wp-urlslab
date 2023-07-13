import Button from "../elements/Button";
import InputField from "../elements/InputField";
import { ReactComponent as EditIcon } from '../assets/images/icons/icon-edit.svg';
import '../assets/styles/layouts/_Roles.scss'

export default function EditRole(props) {
  return (
    <div className="urlslab-edit-container">
      <h3>Edit role:</h3>
      <InputField style={{ maxWidth: '360px' }} />
      <Button>
        <EditIcon /> Edit name
      </Button>
      <Button className={'simple'}>Copy role</Button>
    </div>
  );
}