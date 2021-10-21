import { useState, FormEvent, useRef } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { useAuth } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import { api } from '../../services/api';

export function SendMessageForm(){
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState('');
  const messageTextarea = useRef<HTMLTextAreaElement>(null);
  async function handleSendMessage(event: FormEvent){
    event.preventDefault();

    if(!message.trim()) return;

    await api.post('/messages',{ message });

    setMessage('');
    messageTextarea.current?.focus();
  }
  if(!user) return <></>;
  return (
    <div className={styles.sendMessageFormWrapper}>
      <button type="button" className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size="32"/>
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user.avatar_url} alt={user.name} />
        </div>
        <strong className={styles.userName}>{user.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user.login}
        </span>
      </header>

      <form className={styles.sendMessageForm} onSubmit={handleSendMessage}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual a sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message}
          ref={messageTextarea}
        />
        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  );
}