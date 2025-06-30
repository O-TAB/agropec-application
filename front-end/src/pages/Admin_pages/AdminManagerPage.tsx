import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Store, Calendar, Settings, LogOut, Upload } from 'lucide-react';

const AdminManagerPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminPages = [
    {
      title: 'Gerenciar Pontos',
      description: 'Adicionar, editar e remover pontos no mapa',
      icon: MapPin,
      path: '/registerpoint',
      color: 'bg-blue-500 hover:bg-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Gerenciar Stands',
      description: 'Criar e gerenciar stands de expositores',
      icon: Store,
      path: '/registerstand',
      color: 'bg-green-500 hover:bg-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Gerenciar Eventos',
      description: 'Agendar e gerenciar eventos e palestras',
      icon: Calendar,
      path: '/registerevents',
      color: 'bg-purple-500 hover:bg-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="text-green-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-gray-600">Gerencie pontos, stands e eventos do evento</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/uploadmap')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Upload size={20} />
                Atualizar Mapa
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bem-vindo ao Painel de Controle
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Selecione uma das opções abaixo para gerenciar diferentes aspectos do evento. 
              Cada seção permite criar, editar e remover itens específicos.
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminPages.map((page, index) => {
              {console.log(page.path)}
              const IconComponent = page.icon;
              return (                
                <div
                  key={index}
                  className={`${page.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  onClick={() => navigate(page.path)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${page.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={24} />
                    </div>
                    <div className={`${page.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {page.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {page.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Clique para acessar</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">Pontos</p>
                <p className="text-sm text-gray-600">Gerenciar localizações</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Store className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">Stands</p>
                <p className="text-sm text-gray-600">Expositores e empresas</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">Eventos</p>
                <p className="text-sm text-gray-600">Palestras e shows</p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Precisa de ajuda?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium mb-1">📍 Pontos:</p>
                <p>Adicione localizações importantes como banheiros, emergências e espaços de lazer.</p>
              </div>
              <div>
                <p className="font-medium mb-1">🏢 Stands:</p>
                <p>Crie espaços para expositores com imagens e descrições detalhadas.</p>
              </div>
              <div>
                <p className="font-medium mb-1">📅 Eventos:</p>
                <p>Agende palestras e shows em locais específicos com data e hora.</p>
              </div>
              <div>
                <p className="font-medium mb-1">🗺️ Mapa:</p>
                <p>Todos os itens aparecerão no mapa interativo para os visitantes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagerPage;

