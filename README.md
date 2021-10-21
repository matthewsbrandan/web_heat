# NLW 7 HEAT
  ![home](./src/assets/screenshots/home.png)
  ![home-logged](./src/assets/screenshots/home-logged.png)
  - Vite podemos dizer que é um concorrente do webpack, e ele nos trás algumas vantagens de performance se comparado ao webpack.
  - Para criar um projeto react com ele basta executar o código a seguir:
  ```tsx
    yarn create vite <application_name> --template react-ts
  ```
  - Passamos o react-ts para dizer que estaremos utilizando react com typescript.

## Novos Conhecimentos

### Função para pegar o token do github devolvido por parametros
  ```
    const url = window.location.href;
      if(url.includes('?code=')){
        const [urlWithoutCode, githubCode] = url.split('?code=');
        
        window.history.pushState({},'', urlWithoutCode);
        signIn(githubCode);
      }
    },[]);
  ```
  - Nessa Função utilizamos o **window.location.href** para pegar a url atual da página.
  - Utilizamos a função **includes()** para ver se existe um determinado conteúdo dentro da string em questão.
  - E o mais interessante é essa função **window.history.pushState({},'', urlWithoutCode);** que consegue alterar o endereço da url sem fazer o refresh da página, assim, conseguimos pegar o token recebido do Github e limpamos ele da url para que não fique um endereço sujo para a visualização do usuário.

### Função de autenticação pegando o token do localStorage
  ```
    useEffect(() => {
      const token = localStorage.getItem('@dowhile:token');
      if(token){
        api.defaults.headers.common.authorization = `Bearer ${token}`;

        api.get<User>('/profile').then(response => {
          setUser(response.data);
        });
      }
    },[]);
  ```
  - Uma das coisas legais que podemos ver aqui é, passar o tipo do retorno da requisição em **api.get<User>()**, assim o typescript saberá qual é o formato que virá a resposta.
  - A segunda, e mais interessante ainda é a função **api.defaults.headers.common.authorization = `Bearer ${token}`;**. Basicamente ela irá fazer com que, desse ponto em diante, toda requizição feita com axios estejam carregando o token na autorização.
  
### Socket.io
  - Instalação
  ``` yarn add socket.io-client ```
  - Após instalar criaremos a conexão, e ativaremos os nossos listeners(ouvidores).
  - Lembrando que é muito importante que esse código seja feito fora da função que renderiza o componente, para que ela não seja executada variás vezes e assim, não fique ligando vários listeners de forma desnecessária.
  ```
    ...

    import { io } from 'socket.io-client';

    ...
    const messageQueue: Message[] = [];
    const socket = io('http://localhost:4000');
    socket.on('new_message', newMessage => {
      messageQueue.push(newMessage);
    });
    ...
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
  ```
  - Outra coisa interessante nessa parte do código é o conceito de fila de mensagens. Cada mensagem nova que vai sendo adicionada vai entrando na última posição da fila. E dentro do componente, vamos pegando uma mensagem de cada vez a cada 3s e excluindo ela da fila.

#protagonistas

[NOTION](https://alive-slouch-54f.notion.site/REACTJS-STAGE-2-83a906d847da4460b0622eafc6fe6d00)