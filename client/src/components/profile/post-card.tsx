import type { UserPostDataType } from '@/types';
import Card from '../card';
import { Button } from '../ui/button';
import React, { type Key } from 'react';
import Axios from '@/lib/axios';
import { toast } from 'sonner';

export default function PostCard({
	data,
	onDelete,
}: {
	data: UserPostDataType;
	onDelete?: (id: Key) => void;
}) {
	const [confirmButton, setConfirmButton] = React.useState(false);

	const date = new Date(data.created_at).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	const handleDeletePost = async () => {
		try {
			await Axios.delete(`/api/posts/${data.id}/`);
			toast.success('Post deleted successfully');
			onDelete?.(data.id);
		} catch (error) {
			toast.error('Can not delete this post');
		}
	};

	return (
		<Card>
			{data.image && <img src={data.image} />}
			<div className='mt-4'>
				<h1>Posted on: {date}</h1>
				<h1>Likes: {data.like_count.toString()}</h1>
				<h1>Dislikes: {data.dislike_count.toString()}</h1>
				<h1>Caption: {data.caption}</h1>
			</div>
			{confirmButton ? (
				<Button
					onClick={handleDeletePost}
					variant={'destructive'}
					className='w-full mt-4'
				>
					Confirm Delete
				</Button>
			) : (
				<Button
					onClick={() => setConfirmButton(true)}
					className='w-full mt-4'
				>
					Delete Post
				</Button>
			)}
		</Card>
	);
}
