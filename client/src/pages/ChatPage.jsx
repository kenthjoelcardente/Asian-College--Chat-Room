import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const sendIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<rect x="0" y="0" width="24" height="24" />
			<path d="M3,13.5 L19,12 L3,10.5 L3,3.7732928 C3,3.70255344 3.01501031,3.63261921 3.04403925,3.56811047 C3.15735832,3.3162903 3.45336217,3.20401298 3.70518234,3.31733205 L21.9867539,11.5440392 C22.098181,11.5941815 22.1873901,11.6833905 22.2375323,11.7948177 C22.3508514,12.0466378 22.2385741,12.3426417 21.9867539,12.4559608 L3.70518234,20.6826679 C3.64067359,20.7116969 3.57073936,20.7267072 3.5,20.7267072 C3.22385763,20.7267072 3,20.5028496 3,20.2267072 L3,13.5 Z" fill="white	" />
		</g>
	</svg>
);

const returnIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
			<polygon points="0 0 24 0 24 24 0 24" />
			<path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" fill="white" fill-rule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999) " />
			<path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" fill="white" fill-rule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999) " />
		</g>
	</svg>
);

export const ChatPage = () => {
	const navigate = useNavigate();
	const { name } = useParams();

	const [messages, setMessages] = useState([]);

	const ws = useRef();

	const [messageBody, setMessageBody] = useState('');

	const [isConnectionOpen, setConnectionOpen] = useState(false);

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8081');

		ws.current.onopen = () => {
			console.log('Connection opened!');
			setConnectionOpen(true);
		};
		ws.current.onmessage = (ev) => {
			const message = JSON.parse(ev.data);
			setMessages((_messages) => [..._messages, message]);
		};
		ws.current.onclose = (ev) => {
			if (ev.code === 4000) {
				navigate('/kicked', { state: { kickReason: ev.reason } });
			}
		};

		return () => {
			console.log('Cleaning up! 🧼');
			ws.current.close();
		};
	}, []);

	const send = () => {
		if (messageBody === '') return;
		ws.current.send(JSON.stringify({ sender: name, body: messageBody }));
		setMessageBody('');
	};

	const scrollTarget = useRef(null);
	useEffect(() => {
		if (scrollTarget.current) {
			scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages.length]);

	return (

		<main className='chat-wrapper'>
			<div className='simple-section'>
				<button className='chat-return' onClick={() => navigate('/')}> {returnIcon} Go back home </button>
			</div>
			<div className='chat-view-container'>
				{messages.map((message) => (
					<article
						key={message.sentAt}
						className={'message-container' + (message.sender === name ? ' own-message' : '')}>
						<header className='message-header'>
							<h4 className='message-sender'>{message.sender === name ? 'You' : message.sender}</h4>
							<span className='message-time'>
								{new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
							</span>
						</header>
						<p className='message-body'>{message.body}</p>
					</article>
				))}
				<div ref={scrollTarget} />
			</div>

			<footer className='message-input-container'>
				<p className='chatting-as'>Hey, {name} place your message bellow!</p>

				<div className='message-input-container-inner'>
					<input
						autoFocus
						aria-label='Type a message'
						placeholder='Type a message'
						type='text'
						autoComplete='off'

						value={messageBody}
						onChange={(e) => setMessageBody(e.target.value)}

						onKeyPress={(e) => {
							if (e.key === 'Enter') send();
						}}
					/>

					<button
						aria-label='Send'
						className='icon-button'
						onClick={send}
						disabled={!isConnectionOpen}>
						{sendIcon}
					</button>


				</div>
			</footer>
		</main>
	);
};