import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

type Message = {
  id: string,
  text: string,
  user: {
    name: string,
    avatar_url: string
  }
};

const messageQueue: Message[] = [];
const socket = io('http://localhost:4000');
socket.on('new_message', newMessage => {
  messageQueue.push(newMessage);
});

export function MessageList(){
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messageQueue.length > 0){
        setMessages(old => [
          messageQueue[0],
          old[0],
          old[1]
        ].filter(Boolean));

        messageQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    api.get<Message[]>('/messages/last3').then(response => {
      setMessages(response.data);
    })
  }, []);
  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021"/>

      <ul className={styles.messageList}>
        {messages.map(message => { return(
          <li className={styles.message} key={message.id}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name}/>
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        );})}
      </ul>
    </div>
  );
}