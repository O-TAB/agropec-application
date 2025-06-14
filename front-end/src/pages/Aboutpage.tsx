import React from 'react';
import {MapPin, Users, Wheat } from 'lucide-react';



export default function AboutPage() {
    return(<>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Wheat className="h-8 w-8 text-green-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                  A AGROPEC 2025
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                É a maior feira agropecuária do Norte do Brasil, e é um evento que movimenta a economia local, fortalece relações comerciais e atrai milhares de visitantes qualificados.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-green-50 p-6 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">Milhares de Visitantes</h3>
                  <p className="text-gray-600">Profissionais e empresários do setor agropecuário</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <MapPin className="h-8 w-8 text-yellow-600 mb-3" />
                  <h3 className="font-semibold text-yellow-800 mb-2">Localização Estratégica</h3>
                  <p className="text-gray-600">No coração do agronegócio brasileiro</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-yellow-400 rounded-lg transform rotate-6"></div>
              <img
                src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Agropecuária"
                className="relative rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section></>);}