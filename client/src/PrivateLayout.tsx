import { Outlet } from 'react-router-dom';
import NavBar from './components/navbar';

export default function PrivateLayout({
	setCreatePostOpen,
}: {
	setCreatePostOpen: (value: boolean) => void;
}) {
	return (
		<>
			<NavBar setCreatePostOpen={setCreatePostOpen} />
			<Outlet />
		</>
	);
}
