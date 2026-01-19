import Card from '../card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import type React from 'react';
import { toast } from 'sonner';
import { useState } from 'react';
import Axios from '@/lib/axios';
import { Label } from '../ui/label';
import { XIcon } from 'lucide-react';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CreatePost({
	setCreatePostOpen,
}: {
	setCreatePostOpen: (value: boolean) => void;
}) {
	const [preview, setPreview] = useState<string | null>(null);
	const [caption, setCaption] = useState<string>('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const upload = (file: File) => {
		const reader = new FileReader();
		setImageFile(file);
		reader.onload = () => setPreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const validateDimention = (file: File) => {
		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(url);

			if (img.width < 400 || img.height < 400) {
				toast.error('Image must be atleast 400x400 px');
				return;
			}

			upload(file);
		};

		img.onerror = () => {
			toast.error('Invalid image file');
		};

		img.src = url;
	};

	const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (!ALLOWED_TYPES.includes(file.type)) {
			toast.error('Only JPG, PNG or WEBP allowed');
			e.target.value = '';
			return;
		}

		if (file.size > MAX_SIZE) {
			toast.error('Image too large (max 2MB)');
			e.target.value = '';
			return;
		}

		validateDimention(file);
	};

	const handlePost = async () => {
		if (!imageFile) {
			toast.error('Please upload an image');
			return;
		}

		if (!caption.trim()) {
			toast.error('Caption cannot be empty');
			return;
		}

		try {
			setLoading(true);
			await Axios.post(
				'api/posts/',
				{
					image: imageFile,
					caption,
				},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			toast.success('Post uploaded successfully');

			setCreatePostOpen(false);

			setLoading(false);

			setPreview(null);
			setImageFile(null);
			setCaption('');
		} catch (err: any) {
			toast.error(err.response?.data?.detail || 'Upload failed');
			setLoading(false);
		}
	};

	return (
		<div className='fixed bg-background/10 backdrop-blur-sm backdrop-brightness-25 inset-0 flex justify-center h-screen items-center'>
			<Card className='space-y-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-2xl '>Create New Post</h1>
					<Button
						onClick={() => setCreatePostOpen(false)}
						size={'icon'}
						variant={'ghost'}
					>
						<XIcon />
					</Button>
				</div>
				<div className='flex justify-center'>
					{preview ? (
						<img src={preview} width={320} />
					) : (
						<>
							<Input
								id='picture'
								accept='image/png,image/jpeg,image/webp'
								type='file'
								onChange={(e) => handleImage(e)}
								className='hidden'
							/>
							<Label
								htmlFor='picture'
								className='h-72 bg-muted w-full rounded-md flex justify-center items-center'
							>
								Upload an Image or drag & drop
							</Label>
						</>
					)}
				</div>
				<Textarea
					maxLength={150}
					placeholder='Caption...'
					onChange={(e) => setCaption(e.target.value)}
					className='resize-none'
				/>

				<Button
					onClick={handlePost}
					className='w-full'
					disabled={loading}
				>
					{loading ? 'Posting...' : 'Post Now'}{' '}
				</Button>
			</Card>
		</div>
	);
}
