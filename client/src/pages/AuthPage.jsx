import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');

	const navigateToChatPage = () => {
		if (name !== '') navigate(`/chat/${name}`);
	};

	return (
		<main className='simple-wrapper'>
			<p className='simple-heading'>Hey there ACer!</p>

			<p id='name-label' className='simple-subhead'>
				Asian College - Dumaguete Campus
			</p>

			<div className='simple-section'>
				<input
					aria-labelledby='name-label'
					type='text'
					autoComplete='name'
					placeholder='Enter your name here'
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyPress={(e) => {
						if (e.key === 'Enter') navigateToChatPage();
					}}
				/>
			</div>

			<div className='simple-section'>
				<button onClick={navigateToChatPage}>Open AC - Chat Room</button>
			</div>
		</main>
	);
};