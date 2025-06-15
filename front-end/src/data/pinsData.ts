// src/data/pinsData.ts

import imgDrone from '../assets/imagem_drone.jpg';
import imgPecuaria from '../assets/imagem_card_sustentavel.jpeg';
import imgAgroindustria from '../assets/imagem_card_familia.jpg';
import imgIrrigacao from '../assets/imagem_irrigacao.avif';
import imgMaquinas from '../assets/imagem_card_maquina.jpeg';

export const allPins = [
  // banheiros e ambulância
  { id: 1, category: 'banheiros', type: 'main', x: 1030, y: 800, title: "Banheiro 1" },
  { id: 2, category: 'banheiros', type: 'main', x: 2042, y: 1088, title: "Banheiro 2" },
  { id: 3, category: 'banheiros', type: 'main', x: 2012, y: 1930, title: "Banheiro 3" },
  { id: 4, category: 'ambulancia', type: 'main', x: 1004, y: 684, title: "Ambulância" },
  { id: 5, category: 'pracaalimentacao', type: 'main', x: 978, y: 1288, title: "Praça de Alimentação" },

  // stands
  { id: 10, category: 'stand', type: 'event', x: 1368, y: 607, title: 'Tecnologia no Campo', image: imgDrone, description: 'Soluções com drones, sensores e automação para produção agrícola.' },
  { id: 11, category: 'stand', type: 'event', x: 1499, y: 685, title: 'Pecuária Sustentável', image: imgPecuaria, description: 'Inovações na pecuária, bem-estar animal e alimentação de qualidade.' },
  { id: 12, category: 'stand', type: 'event', x: 1492, y: 905, title: 'Agroindústria Familiar', image: imgAgroindustria, description: 'Produtos e serviços direto da agroindústria local e familiar.' },
  { id: 13, category: 'stand', type: 'event', x: 1830, y: 1285, title: 'Soluções em Irrigação', image: imgIrrigacao, description: 'Tecnologia eficiente para a irrigação de pequenas e grandes propriedades.' },
  { id: 14, category: 'stand', type: 'event', x: 1473, y: 1570, title: 'Máquinas e Equipamentos', image: imgMaquinas, description: 'Tratores, colheitadeiras e lançamentos do setor de máquinas agrícolas.' },

  // eventos
  { id: 20, category: 'event', type: 'event', x: 2079, y: 868, title: 'Área de Shows', image: '', description: 'Palco principal para os grandes shows e atrações noturnas. Consulte a programação do dia!' },
  { id: 22, category: 'event', type: 'event', x: 2729, y: 1760, title: 'Agropec Banking', image: '', description: 'Ponto de atendimento com soluções financeiras e de crédito para o produtor rural.' },
  { id: 23, category: 'event', type: 'event', x: 986, y: 1521, title: 'Fazendinha', image: '', description: 'Um espaço para toda a família interagir e conhecer de perto os animais da fazenda.' },
  { id: 24, category: 'event', type: 'event', x: 1038, y: 308, title: 'Concha Acústica', image: '', description: 'Espaço reservado para palestras, workshops e apresentações musicais durante o dia.' },
  { id: 25, category: 'event', type: 'event', x: 984, y: 1769, title: 'Baia de Animais', image: '', description: 'Exposição de animais de grande porte. Veja de perto os campeões de diversas raças.' }
];