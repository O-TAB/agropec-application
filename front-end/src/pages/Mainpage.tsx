import React from 'react';
import {MapPin, Calendar, Users, Phone, Mail, Wheat } from 'lucide-react';
import oximg from '../assets/ox_img.jpeg'; // Ensure the path is correct

function Mainpage() {
    return(<div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="relative min-h-[500px] bg-cover bg-center flex items-center"
          style={{
            backgroundImage: `url(${oximg})`,
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-yellow-400 inline-block px-8 py-4 rounded-lg shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-2">
                AGROPEC25
              </h1>
              <p className="text-xl md:text-2xl text-green-700 font-semibold">
                09 A 17 Agosto, 2025
              </p>
            </div>
            <div className="flex justify-center items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">9 dias de evento</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Norte do Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              O Que Esperar da AGROPEC 2025
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Um evento completo com as melhores oportunidades de negócios e networking do setor agropecuário
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Networking</h3>
              <p className="text-gray-600">
                Conecte-se com os principais players do agronegócio e expanda sua rede de contatos
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Wheat className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Inovação</h3>
              <p className="text-gray-600">
                Descubra as últimas tecnologias e tendências do setor agropecuário
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Oportunidades</h3>
              <p className="text-gray-600">
                Encontre novas oportunidades de negócios e parcerias estratégicas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Entre em Contato
            </h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Tire suas dúvidas ou saiba mais sobre como participar da AGROPEC 2025
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-white">
                <Phone className="h-6 w-6 text-green-200" />
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-green-100">(11) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <Mail className="h-6 w-6 text-green-200" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-green-100">contato@agropec.com.br</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Envie sua Mensagem</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Sua mensagem"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded-full p-2">
                  <Wheat className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AGROPEC</h3>
                  <p className="text-green-200 text-sm">Feira Agropecuária</p>
                </div>
              </div>
              <p className="text-green-200">
                A maior feira agropecuária do Norte do Brasil
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-green-200">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#stands" className="hover:text-white transition-colors">Stands</a></li>
                <li><a href="#programacoes" className="hover:text-white transition-colors">Programações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-green-200">
                <li>(11) 1234-5678</li>
                <li>contato@agropec.com.br</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Evento</h4>
              <ul className="space-y-2 text-green-200">
                <li>09 a 17 de Agosto</li>
                <li>2025</li>
                <li>Norte do Brasil</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2025 AGROPEC. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );

}
export default Mainpage;