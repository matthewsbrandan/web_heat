import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User{
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}
interface AuthContextData{
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}
const AuthContext = createContext({} as AuthContextData);

interface AuthResponse {
  token: string,
  user: {
    id: string,
    avatar_url: string,
    name: string,
    login: string,
  }
}
interface AuthProviderProps{
  children: ReactNode;
}
export function AuthProvider({children} : AuthProviderProps){
  const [user, setUser] = useState<User | null>(null);
  const [signInUrl,_] = useState(() => {
    let url = [
      "https://github.com/login/oauth/authorize?scope=user",
      "client_id=434316f393ea9ac24109"
    ]

    return url.join('&');
  });
  
  async function signIn(githubCode: string){
    const { data } = await api.post<AuthResponse>('/authenticate',{ code: githubCode })
    const { token, user } = data;

    localStorage.setItem('@dowhile:token', token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
    setUser(user);
  }

  function signOut(){
    setUser(null);
    localStorage.removeItem('@dowhile:token');
    api.defaults.headers.common.authorization = '';
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');
    if(token){
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('/profile').then(response => {
        console.log(response.data);
        setUser(response.data);
      });
    }
  },[]);

  useEffect(() => {
    const url = window.location.href;
    if(url.includes('?code=')){
      const [urlWithoutCode, githubCode] = url.split('?code=');
      
      window.history.pushState({},'', urlWithoutCode);
      signIn(githubCode);
    }
  },[]);

  return (
    <AuthContext.Provider value={{
      user,
      signInUrl,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};