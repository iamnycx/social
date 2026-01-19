import type { UserPostsType } from '@/types';
import PostCard from './post-card';
import type { Key } from 'react';

export default function Posts({
	posts,
	onDelete,
}: {
	posts: UserPostsType | undefined;
	onDelete?: (id: Key) => void;
}) {
	return (
		<div className='w-2xl'>
			<div className='grid  gap-12 mx-auto w-fit'>
				{posts?.map((data) => (
					<PostCard data={data} key={data?.id} onDelete={onDelete} />
				))}
			</div>
		</div>
	);
}
