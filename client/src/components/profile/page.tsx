import React, { type Key } from 'react';
import Posts from './posts';
import Axios from '@/lib/axios';
import type { UserDetailType } from '@/types';
import Details from './details';

export default function Profile() {
	const [data, setData] = React.useState<UserDetailType>();

	React.useEffect(() => {
		Axios.get('auth/users/me').then((res) => {
			setData(res.data);
		});
	}, []);

	const handleRemovePost = (id: Key) => {
		setData((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				posts: prev.posts?.filter((p) => p.id !== id),
			} as UserDetailType;
		});
	};

	return (
		<>
			<h1 className='text-2xl fixed top-10 left-32'>Profile</h1>
			<Details data={data} onUpdate={setData} />
			<div className='flex justify-end my-32'>
				<Posts posts={data?.posts} onDelete={handleRemovePost} />
			</div>
		</>
	);
}
