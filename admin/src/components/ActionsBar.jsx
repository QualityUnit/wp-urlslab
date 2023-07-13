import Button from "../elements/Button";
import SearchField from "../elements/SearchField";
import { ReactComponent as PlusIcon } from '../assets/images/icons/icon-plus.svg';
import { useI18n } from "@wordpress/react-i18n";


export default function ActionsBar(props) {
  const { selectedCapCount, totalCap, handleFiltering } = props;
  const { __ } = useI18n();

  return (
    <div className="urlslab-actionsbar">
      <SearchField
        liveUpdate
        autoFocus
        onChange={(input) => handleFiltering({ input, type: 'search' })}
        placeholder={__('Search')}
      />
      <Button className={'simple'}>
        <PlusIcon /> Add capability
      </Button>

      <p style={{ marginLeft: 'auto' }}>
        Selected: {selectedCapCount} from {totalCap}
      </p>
    </div>
  );
}