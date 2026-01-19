import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Card from '../card';
import React from 'react';
import Axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRoundIcon, X } from 'lucide-react';

export default function Signup({ setActiveCard }: { setActiveCard: Function }) {
	const [name, setName] = React.useState('');
	const [gender, setGender] = React.useState('');
	const [birth, setBirth] = React.useState('');
	const [birthError, setBirthError] = React.useState<string | null>(null);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [repassword, setRePassword] = React.useState('');
	const [passwordError, setPasswordError] = React.useState<string | null>(
		null
	);
	const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = React.useState<string | null>(
		null
	);

	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!validateBirth(birth)) {
			toast.error('Please fix errors before submitting');
			return;
		}

		try {
			const form = new FormData();
			form.append('name', name);
			form.append('birth_date', birth);
			form.append('email', email);
			form.append('password', password);
			form.append('gender', gender);
			if (avatarFile) form.append('avatar', avatarFile);

			await Axios.post('/auth/users/', form);

			const res = await Axios.post('/auth/jwt/create/', {
				email,
				password,
			});

			localStorage.setItem('access', res.data.access);
			localStorage.setItem('refresh', res.data.refresh);

			navigate('/feed');
		} catch (err) {
			console.log('Login failed', err);
			toast.error('Something went wrong');
		}
	};

	const validatePassword = (value: string) => {
		const allowed = /^[A-Za-z0-9!@#$%^&*]+$/;
		const errors: string[] = [];
		if (value.length === 0) {
			setPasswordError(null);
			return true;
		}
		if (!allowed.test(value)) {
			errors.push('Contains invalid characters');
		}
		if (value.length < 8) {
			errors.push('Minimum length 8');
		}
		if (!/[A-Z]/.test(value)) {
			errors.push('At least one uppercase letter');
		}
		if (!/[a-z]/.test(value)) {
			errors.push('At least one lowercase letter');
		}
		if (!/[0-9]/.test(value)) {
			errors.push('At least one number');
		}
		if (!/[!@#$%^&*]/.test(value)) {
			errors.push('At least one special character (!@#$%^&*)');
		}
		if (errors.length > 0) {
			setPasswordError(errors.join(', '));
			return false;
		}
		setPasswordError(null);
		return true;
	};

	const validateBirth = (value: string) => {
		if (!value) {
			setBirthError(null);
			return true;
		}
		const d = new Date(value);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (isNaN(d.getTime())) {
			setBirthError('Invalid date');
			return false;
		}
		if (d > today) {
			setBirthError('Date of birth cannot be in the future');
			return false;
		}
		setBirthError(null);
		return true;
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value;
		setPassword(v);
		validatePassword(v);
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		if (file) {
			setAvatarFile(file);
			const url = URL.createObjectURL(file);
			setAvatarPreview(url);
		} else {
			setAvatarFile(null);
			setAvatarPreview(null);
		}
	};

	React.useEffect(() => {
		return () => {
			if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		};
	}, [avatarPreview]);

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	const handleRemoveAvatar = () => {
		if (avatarPreview) {
			URL.revokeObjectURL(avatarPreview);
		}
		setAvatarFile(null);
		setAvatarPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<div className='flex h-screen items-center'>
			<Card className='mx-auto'>
				<h1
					className='text-2xl mb-8
         text-center font-bold'
				>
					Join Social Network
				</h1>
				<div>
					<Label htmlFor='avatar' className='mb-2 mt-4'>
						Profile Picture
					</Label>
					<div className='flex items-center mx-auto w-fit gap-4'>
						<div className='relative'>
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								className='w-24 h-24 rounded-full bg-muted-foreground/5 flex items-center justify-center text-sm text-muted-foreground overflow-hidden border'
							>
								{avatarPreview ? (
									<img
										src={avatarPreview}
										alt='avatar preview'
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='scale-150'>
										<UserRoundIcon fill='#ffffff' />
									</div>
								)}
							</button>
							{avatarPreview && (
								<Button
									type='button'
									onClick={handleRemoveAvatar}
									variant={'secondary'}
									size={'icon-sm'}
									aria-label='Remove avatar'
									className='absolute -top-2 -right-2 rounded-full'
								>
									<X />
								</Button>
							)}
						</div>
						<input
							rel={undefined}
							ref={fileInputRef}
							id='avatar'
							type='file'
							accept='image/*'
							onChange={handleAvatarChange}
							className='hidden'
						/>
					</div>

					<Label htmlFor='name' className='mb-2 mt-4'>
						Full Name
					</Label>
					<Input
						onChange={(e) => setName(e.target.value)}
						id='name'
						placeholder='i.e. Bruce Wayne'
					/>
					<Label htmlFor='dob' className='mb-2 mt-4'>
						Date of Birth
					</Label>
					<Input
						onChange={(e) => {
							setBirth(e.target.value);
							validateBirth(e.target.value);
						}}
						id='dob'
						type='date'
						max={new Date().toISOString().split('T')[0]}
					/>
					<Label htmlFor='gender' className='mb-2 mt-4'>
						Gender
					</Label>
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
					{birthError && (
						<p className='text-sm text-destructive mt-1'>
							{birthError}
						</p>
					)}
					<Label htmlFor='email' className='mb-2 mt-4'>
						Email Address
					</Label>
					<Input
						onChange={(e) => setEmail(e.target.value)}
						id='email'
						placeholder='i.e. waynebruce@mail.com'
						type='email'
					/>

					<div className='flex gap-4'>
						<div>
							<Label htmlFor='password' className='mb-2 mt-4'>
								Password
							</Label>
							<Input
								onChange={handlePasswordChange}
								id='password'
								placeholder='secure password'
								type='password'
							/>
						</div>
						<div>
							<Label htmlFor='re-password' className='mb-2 mt-4'>
								Re-Password
							</Label>
							<Input
								disabled={password.length > 0 ? false : true}
								onChange={(e) => setRePassword(e.target.value)}
								id='re-password'
								placeholder='secure password'
								type='password'
							/>
						</div>
					</div>
					<div className='pt-2'>
						<p className='text-sm text-muted-foreground'>
							Use A-Z, a-z, 0-9, !@#$%^&* in password
						</p>
						{passwordError && (
							<p className='text-sm text-destructive mt-1'>
								{passwordError}
							</p>
						)}
					</div>

					<div className='flex flex-col items-center gap-4 mt-8'>
						<Button
							disabled={
								!(
									password === repassword &&
									password.length > 0 &&
									passwordError === null &&
									birthError === null
								)
							}
							className='w-full'
							onClick={handleSubmit}
						>
							Signup
						</Button>

						<p className='flex items-center text-sm gap-2'>
							<span>Already have account?</span>
							<span
								onClick={() => setActiveCard('login')}
								className='underline cursor-pointer hover:text-primary transition-colors duration-300 ease-in-out'
							>
								Login
							</span>
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
