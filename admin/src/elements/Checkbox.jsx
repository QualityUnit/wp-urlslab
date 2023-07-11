import { useState } from 'react';
import '../assets/styles/elements/_Checkbox.scss';

export default function Checkbox({
  defaultValue,
  smallText,
  readOnly,
  radial,
  name,
  className,
  onChange,
  textBefore,
  children, disabled,
}) {
  const [isChecked, setChecked] = useState(defaultValue ? true : false);

  const handleOnChange = () => {
    if (onChange && !readOnly) {
      onChange(!isChecked);
    }
    if (!readOnly) {
      setChecked((state) => !state);
    }
  };
  return (
    <label
      className={`urlslab-checkbox ${className || ''} ${textBefore ? 'textBefore' : ''} ${radial ? 'radial' : ''}`}
    >
      <input
        className={`urlslab-checkbox-input ${defaultValue ? 'checked' : ''}`}
        type={name ? 'radio' : 'checkbox'}
        name={name || ''}
        defaultChecked={isChecked}
        
				disabled={ disabled ? 'disabled' : '' }
        onChange={(event) => handleOnChange(event)}
      />
      <div className="urlslab-checkbox-box"></div>
      <span
        className={`urlslab-checkbox-text ${smallText ? 'fs-xm' : ''}`}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </label>
  );
}
