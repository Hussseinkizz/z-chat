import { io } from 'socket.io-client';
import { css, html, List, useEffect, useState } from 'z-js-framework';
import { getTimeStamp } from '../utils';

const buttonStyles = css`
    width: 100%;
    padding: 1rem 1rem;
    background: #faf;
    border-radius: 0.5rem;
    color: #000;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background: #fcf;
    }
`;

const inputStyles = css`
    width: 300px;
    padding: 1rem 1rem;
    border-radius: 0.5rem;
    background: #f4f4f4;
`;

export default function Home() {
    const socket = io('http://localhost:8000');
    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');
    const [currentUser, setCurrentUser] = useState('user 1');
    const [messages, setMessages] = useState([
        {
            id: 1,
            user: 'user 1',
            type: 'outgoing',
            message: 'Hello',
            time: getTimeStamp(),
        },
        {
            id: 2,
            user: 'user 2',
            type: 'incoming',
            message: 'How are you?',
            time: getTimeStamp(),
        },
    ]);

    const sendMessage = () => {
        if (currentUser.current() === 'user 1') {
            socket.emit('send message', JSON.stringify(message1.current()));
        } else {
            socket.emit('send message', JSON.stringify(message2.current()));
        }
    };

    useEffect(() => {
        // connect to server socket
        socket.on('connect', () => {
            console.log('connected to server:', socket.id);
        });
        // listen for incoming messages
        socket.on('recieve message', msgData => {
            let new_msg = JSON.parse(msgData);
            new_msg && setMessages(current_messages => [...current_messages, new_msg]);
        });
    }, []);

    useEffect(() => {
        updateMessagesUI();
    }, [messages]);

    function updateMessagesUI() {
        let target = UI.querySelector('#messages');
        let targetInput = null;
        if (currentUser.current() === 'user 1') {
            targetInput = UI.querySelector('#messageInput1');
        } else {
            targetInput = UI.querySelector('#messageInput2');
        }
        target.innerHTML = '';
        targetInput.value = '';
        messages.current().map(msg => {
            target.appendChild(messageCard(msg));
        });
    }

    const handleMessage = (value, user) => {
        let newMessage = {
            id: messages.current().length + 1,
            user: user,
            type: user === currentUser.current() ? 'outgoing' : 'incoming',
            message: value,
            time: getTimeStamp(),
        };

        if (user === 'user 1') {
            setMessage1(newMessage);
            setCurrentUser('user 1');
        } else {
            setMessage2(newMessage);
            setCurrentUser('user 2');
        }
    };

    let UI = html`
        <section class="container">
            <h1 class="title">📦 Z-Chat</h1>
            <div id="messages" ref="msgs">
                ${List({
                    ref: 'msgs',
                    items: messages,
                    render: ({ item }) => messageCard(item),
                })}
            </div>
            <div class="flex-col">
                <section class="flex">
                    <div class="flex-col">
                        <h2>User 1:</h2>
                        <input
                            class="${inputStyles}"
                            id="messageInput1"
                            type="text"
                            value="${message1}"
                            onChange="${e => handleMessage(e.target.value, 'user 1')}"
                        />
                    </div>
                    <div class="flex-col">
                        <h2>User 2:</h2>
                        <input
                            class="${inputStyles}"
                            id="messageInput2"
                            type="text"
                            value="${message2}"
                            onChange="${e => handleMessage(e.target.value, 'user 2')}"
                        />
                    </div>
                </section>
                <button class="${buttonStyles}" onClick="${sendMessage}">send</button>
            </div>
        </section>
    `;

    const messageCard = props => html`
        <div class="msg-card ${props.type === 'outgoing' ? 'outgoing' : 'incoming'}">
            <h2 class="user-name">${props.user}</h2>
            <p>
                ${props.user !== currentUser.current()
                    ? `📥 ${props.message}`
                    : `📤 ${props.message}`}
            </p>
            <span>${props.time}</span>
        </div>
    `;

    return UI;
}
