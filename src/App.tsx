import { MessageList } from './components/MessageList';
import { LoginBox } from './components/LoginBox';
import styles from './App.module.scss';
import { useAuth } from './contexts/AuthContext';
import { SendMessageForm } from './components/SendMessageForm';

export function App() {
  const { user } = useAuth();
  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      { !!user ? <SendMessageForm/>:<LoginBox />}
    </main>
  )
}