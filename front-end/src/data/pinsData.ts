// src/data/pinsData.ts

import imgDrone from '../assets/imagem_drone.jpg';
import imgPecuaria from '../assets/imagem_card_sustentavel.jpeg';
import imgAgroindustria from '../assets/imagem_card_familia.jpg';
import imgIrrigacao from '../assets/imagem_irrigacao.avif';
import imgMaquinas from '../assets/imagem_card_maquina.jpeg';

export const imageMap = {
  'imagem_drone.jpg': imgDrone,
  'imagem_card_sustentavel.jpeg': imgPecuaria,
  'imagem_card_familia.jpg': imgAgroindustria,
  'imagem_irrigacao.avif': imgIrrigacao,
  'imagem_card_maquina.jpeg': imgMaquinas,
};

export const allPins = [
  // Utilidades
  { id: 1, category: 'banheiros', type: 'main', x: 2055, y: 1092, title: "Banheiro 1", operatingHours: 'Aberto 24h' },
  { id: 2, category: 'banheiros', type: 'main', x: 2022, y: 1941, title: "Banheiro 2", operatingHours: 'Aberto 24h' },
  { id: 3, category: 'banheiros', type: 'main', x: 1026, y: 826, title: "Banheiro 3", operatingHours: 'Aberto 24h' },
  { id: 4, category: 'ambulancia', type: 'main', x: 1004, y: 684, title: "Ambulância", operatingHours: 'Atendimento 24h' },
  { id: 26, category: 'pracaalimentacao', type: 'main', x: 984, y: 1283, title: 'Praça de Alimentação', operatingHours: '10:00 - 00:00' },

  // Stands
  { id: 10, category: 'stand', type: 'event', x: 500, y: 607, title: 'Tecnologia no Campo', image: 'imagem_drone.jpg', description: 'Soluções com drones, sensores e automação para produção agrícola.', operatingHours: '09:00 - 22:00' },
  { id: 11, category: 'stand', type: 'event', x: 1499, y: 685, title: 'Pecuária Sustentável', image: 'imagem_card_sustentavel.jpeg', description: 'Inovações na pecuária, bem-estar animal e alimentação de qualidade.', operatingHours: '09:00 - 22:00' },
  { id: 12, category: 'stand', type: 'event', x: 1492, y: 905, title: 'Agroindústria Familiar', image: 'imagem_card_familia.jpg', description: 'Produtos e serviços direto da agroindústria local e familiar.', operatingHours: '09:00 - 22:00' },
  { id: 13, category: 'stand', type: 'event', x: 1830, y: 1285, title: 'Soluções em Irrigação', image: 'imagem_irrigacao.avif', description: 'Tecnologia eficiente para a irrigação de pequenas e grandes propriedades.', operatingHours: '09:00 - 22:00' },
  { id: 14, category: 'stand', type: 'event', x: 1473, y: 1570, title: 'Máquinas e Equipamentos', image: 'imagem_card_maquina.jpeg', description: 'Tratores, colheitadeiras e lançamentos do setor de máquinas agrícolas.', operatingHours: '09:00 - 22:00' },

  // Eventos
  { id: 20, category: 'event', type: 'event', x: 2079, y: 868, title: 'Área de Shows', image: '', description: 'Palco principal para os grandes shows e atrações noturnas. Consulte a programação do dia!', operatingHours: '18:00 - 02:00' },
  { id: 22, category: 'event', type: 'event', x: 2729, y: 1760, title: 'Agropec Banking', image: '', description: 'Ponto de atendimento com soluções financeiras e de crédito para o produtor rural.', operatingHours: '10:00 - 18:00' },
  { id: 23, category: 'event', type: 'event', x: 986, y: 1521, title: 'Fazendinha', image: '', description: 'Um espaço para toda a família interagir e conhecer de perto os animais da fazenda.', operatingHours: '10:00 - 20:00' },
  { id: 24, category: 'event', type: 'event', x: 1038, y: 308, title: 'Concha Acústica', image: '', description: 'Espaço reservado para palestras, workshops e apresentações musicais durante o dia.', operatingHours: '11:00 - 19:00' },
  { id: 25, category: 'event', type: 'event', x: 984, y: 1769, title: 'Baia de Animais', image: '', description: 'Exposição de animais de grande porte. Veja de perto os campeões de diversas raças.', operatingHours: '09:00 - 19:00' }
];
