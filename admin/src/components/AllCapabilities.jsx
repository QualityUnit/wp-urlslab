import Checkbox from "../elements/Checkbox"

export default function AllCapabilities(props) {
  const { data } = props
  return (
    <div className="urlslab-all-capabilities">
      <p style={{ marginBottom: '15px', minWidth: '100%' }}>All capabilities</p>
      {data.map((item) => (
        <div className="urlslab-capability-item" style={{ width: '30%' }}>
          <Checkbox>{item.capabilityName}</Checkbox>
        </div>
      ))}
    </div>
  )
}