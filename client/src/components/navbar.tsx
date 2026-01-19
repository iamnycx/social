import { Link } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react';

export default function NavBar({
	setCreatePostOpen,
}: {
	setCreatePostOpen: (value: boolean) => void;
}) {
	return (
		<nav className='bg-background/30 items-center backdrop-blur-xs border-2 rounded-full flex w-fit p-2 right-32 top-8 z-50 justify-center space-x-6 fixed'>
			<Button
				onClick={() => setCreatePostOpen(true)}
				size={'icon'}
				variant={'outline'}
				className='rounded-full'
			>
				<PlusIcon />
			</Button>
			<Link
				to='/feed'
				className='hover:scale-110 hover:text-primary transition duration-300 ease-in-out'
			>
				Explore
			</Link>
			<Link
				to='/profile'
				className='hover:scale-110 hover:text-primary transition duration-300 ease-in-out'
			>
				Profile
			</Link>
			<ModeToggle />
		</nav>
	);
}
