import Card from '../card';
import { Button } from '../ui/button';
import Confirmation from './confirmation';
import { handleLogout } from '@/lib/auth';
import { Input } from '../ui/input';
import React from 'react';
import type { UserDetailType } from '@/types';
import { PencilLineIcon } from 'lucide-react';
import Axios from '@/lib/axios';
import { toast } from 'sonner';

export default function Details({
	data,
	onUpdate,
}: {
	data: UserDetailType | undefined;
	onUpdate?: (u: UserDetailType) => void;
}) {
	const [confirmationOpen, setConfirmationOpen] = React.useState(false);
	const [nameEditMode, setNameEditMode] = React.useState(false);
	const [birthEditMode, setBirthEditMode] = React.useState(false);
	const [name, setName] = React.useState<string>();
	const [genderEditMode, setGenderEditMode] = React.useState(false);
	const [gender, setGender] = React.useState<string>();
	const [birthDate, setBirthDate] = React.useState<string>();
	const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = React.useState<
		string | undefined
	>(data?.avatar);
	const [editMode, setEditMode] = React.useState(false);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	const formatDisplayDate = (d?: string) => {
		if (!d) return '';
		if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
			const [y, m, day] = d.split('-');
			return `${m} / ${day} / ${y}`;
		}
		try {
			const parsed = new Date(d);
			const s = parsed.toLocaleDateString('en-US', {
				month: '2-digit',
				day: '2-digit',
				year: 'numeric',
			});
			return s.replace(/\//g, ' / ');
		} catch {
			return d;
		}
	};

	React.useEffect(() => {
		setName(data?.name);
		setBirthDate(data?.birth_date);
		setGender(data?.gender);
		if (!avatarFile) setAvatarPreview(data?.avatar);
	}, [data, avatarFile]);

	React.useEffect(() => {
		return () => {
			if (avatarPreview && avatarFile) URL.revokeObjectURL(avatarPreview);
		};
	}, [avatarFile, avatarPreview]);

	const handleUpdate = async () => {
		try {
			if (avatarFile) {
				const form = new FormData();
				form.append('avatar', avatarFile);
				if (name !== undefined) form.append('name', name);
				if (birthDate !== undefined)
					form.append('birth_date', birthDate);
				if (gender !== undefined) form.append('gender', gender);

				await Axios.patch('/auth/users/me/', form, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			} else {
				await Axios.patch('/auth/users/me/', {
					name,
					birth_date: birthDate,
					gender,
				});
				setEditMode(false);
				setNameEditMode(false);
				setBirthEditMode(false);
				setGenderEditMode(false);
			}

			try {
				const res = await Axios.get('/auth/users/me/');
				const updated = res.data as UserDetailType;
				setName(updated.name);
				setBirthDate(updated.birth_date);
				setAvatarPreview(updated.avatar);
				onUpdate?.(updated);
			} catch (e) {
				console.warn('Failed to refetch user data', e);
			}

			setEditMode(false);
			setNameEditMode(false);
			setBirthEditMode(false);
			setAvatarFile(null);
			toast.success('Details updated successfully.');
		} catch (err) {
			toast.error('Can not update the details');
		}
	};

	return (
		<>
			<Card className='flex flex-col h-fit gap-2 fixed top-1/2 -translate-y-1/2'>
				<div className='flex flex-col items-center gap-2'>
					<div className='relative h-fit w-fit'>
						<img
							src={avatarPreview}
							alt={data?.name ? data.name.charAt(0) : 'Avatar'}
							className='bg-muted h-16 w-16 flex justify-center items-center rounded-full object-cover'
						/>

						<input
							ref={fileInputRef}
							type='file'
							accept='image/*'
							className='hidden'
							onChange={(e) => {
								const f = e.target.files?.[0] ?? null;
								if (f) {
									const url = URL.createObjectURL(f);
									setAvatarPreview(url);
									setAvatarFile(f);
									setEditMode(true);
								}
							}}
						/>

						<Button
							variant={'link'}
							className='absolute scale-75 -right-6 text-primary/50 -top-2 hover:text-primary cursor-pointer'
							onClick={() => fileInputRef.current?.click()}
						>
							<PencilLineIcon />
						</Button>
					</div>
					<p>{data?.email}</p>
				</div>

				<div className='space-y-2 flex flex-col items-center my-4'>
					{nameEditMode ? (
						<div className='flex items-center relative'>
							<Input
								autoFocus
								className='text-center font-bold text-2xl h-auto w-fit dark:bg-transparent border-none p-0 m-0 focus-visible:ring-0'
								onChange={(e) => setName(e.target.value)}
								value={name || ''}
							/>
						</div>
					) : (
						<div className='flex items-center relative'>
							<h1 className='text-center'>{name}</h1>
							<Button
								variant={'link'}
								className='absolute -right-8 text-primary/50 hover:text-primary cursor-pointer'
								onClick={() => {
									setNameEditMode(true);
									setEditMode(true);
								}}
							>
								<PencilLineIcon />
							</Button>
						</div>
					)}

					{genderEditMode ? (
						<div className='flex items-center relative'>
							<select
								id='gender'
								value={gender}
								onChange={(e) => setGender(e.target.value)}
							>
								<option value=''>Select gender</option>
								<option value='Male'>Male</option>
								<option value='Female'>Female</option>
								<option value='Other'>Other</option>
							</select>
						</div>
					) : (
						<div className='flex items-center relative'>
							{gender ? (
								<span className='text-center'>{gender}</span>
							) : (
								<span className='text-center text-muted-foreground'>
									Not specified
								</span>
							)}
							<Button
								variant={'link'}
								className='absolute -right-8 text-primary/50 hover:text-primary cursor-pointer'
								onClick={() => {
									setGenderEditMode(true);
									setEditMode(true);
								}}
							>
								<PencilLineIcon />
							</Button>
						</div>
					)}

					{birthEditMode ? (
						<div className='flex items-center relative'>
							<Input
								autoFocus
								type='date'
								className='text-center font-bold text-2xl h-auto w-fit dark:bg-transparent border-none p-0 m-0 focus-visible:ring-0'
								onChange={(e) => setBirthDate(e.target.value)}
								value={birthDate || ''}
								max={new Date().toISOString().split('T')[0]}
							/>
						</div>
					) : (
						<div className='flex items-center relative'>
							<h1 className='text-center'>
								{formatDisplayDate(
									birthDate ?? data?.birth_date
								)}
							</h1>
							<Button
								variant={'link'}
								className='absolute -right-8 text-primary/50 hover:text-primary cursor-pointer'
								onClick={() => {
									setBirthEditMode(true);
									setEditMode(true);
								}}
							>
								<PencilLineIcon />
							</Button>
						</div>
					)}
				</div>

				<Button
					onClick={handleUpdate}
					disabled={!editMode}
					variant='outline'
					className='mt-4'
				>
					Save Changes
				</Button>

				<div className='grid gap-4 mt-8'>
					<Button onClick={handleLogout} variant='secondary'>
						Logout
					</Button>
					<Button
						variant='destructive'
						onClick={() => setConfirmationOpen(true)}
					>
						Delete Account
					</Button>
				</div>
			</Card>
			{confirmationOpen && (
				<Confirmation setConfirmationOpen={setConfirmationOpen} />
			)}
		</>
	);
}
