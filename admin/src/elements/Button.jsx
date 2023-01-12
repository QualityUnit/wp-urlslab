import '../assets/style/elements/Button.scss';

export default function Button({ active, secondary, onClick, href, children }) {
	return (
		<button className={`urlslab-button ${active ? 'active' : ''}`}>
			{children}
		</button>
	)
}
