import { useState, useEffect, useRef } from 'react';
import * as StompJs from '@stomp/stompjs';
import SockJS from 'sockjs-client';


interface Notification {
  content: string;
}

const API_URL = 'http://127.0.0.1:8080';

export const NotificationContainer = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const clientRef = useRef<StompJs.Client | null>(null);


  useEffect(() => {
    const fetchActiveNotifications = async () => {
      try {
        console.log("Buscando notificações ativas...");
        const response = await fetch(`${API_URL}/notifications`);
        
        if (!response.ok) {
          throw new Error(`Erro na rede: ${response.statusText}`);
        }
        
        const activeNotifications: Notification[] = await response.json();
        
        if (activeNotifications.length > 0) {
            console.log(`Encontradas ${activeNotifications.length} notificações ativas.`);
            setNotifications(activeNotifications);
        } else {
            console.log("Nenhuma notificação ativa encontrada no momento.");
        }

      } catch (error) {
        console.error("Falha ao buscar notificações ativas:", error);
      }
    };

    fetchActiveNotifications();
  }, []);


  useEffect(() => {
    console.log('%c PAINEL DE NOTIFICAÇÕES MONTADO ', 'background: #222; color: #bada55');
    const connect = () => {
      const client = new StompJs.Client({
        webSocketFactory: () => new SockJS('http://127.0.0.1:8080/agropec-notifications'),
        debug: (str) => {
          console.log('STOMP DEBUG: ' + str);
        },
        reconnectDelay: 5000,
      });

      client.onConnect = (frame) => {
        console.log('Conectado com sucesso: ' + frame);
        setIsConnected(true);

        client.subscribe('/topic/updates', (message) => {
          const notificationDTO: Notification = JSON.parse(message.body);
          
          setNotifications(prevNotifications => [...prevNotifications, notificationDTO]);
        });
      };

      client.onWebSocketError = (error) => {
        console.error('Erro com o WebSocket', error);
        setIsConnected(false);
      };

      client.onStompError = (frame) => {
        console.error('Erro do broker: ' + frame.headers['message']);
        console.error('Detalhes adicionais: ' + frame.body);
        setIsConnected(false);
      };

      clientRef.current = client;
      client.activate();
    };

    connect();

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        console.log('Desconectando...');
        clientRef.current.deactivate();
        setIsConnected(false);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border shadow-md p-4">
      <h3 className="text-lg font-bold mb-2">Painel de Notificações</h3>
      <p className="mb-4">
        Status da Conexão: 
        <span className={isConnected ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
          {isConnected ? ' Conectado' : ' Desconectado'}
        </span>
      </p>

      <div className="overflow-auto" style={{ maxHeight: '300px' }}>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Notificações recentes:</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 && (
              <tr>
                <td className="border px-4 py-2 text-gray-600">Aguardando notificações...</td>
              </tr>
            )}
            
            {notifications.map((notif, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: notif.content }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};