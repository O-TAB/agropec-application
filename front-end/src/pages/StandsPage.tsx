import React from "react";
import imgFamilia from "../assets/imagem_card_familia.jpg";
import imgMaquina from "../assets/imagem_card_maquina.jpeg";
import imgSustentavel from "../assets/imagem_card_sustentavel.jpeg";
import imgDrone from "../assets/imagem_drone.jpg";
import imgIrrigacao from "../assets/imagem_irrigacao.avif";

const expositores = [
  {
    id: 1,
    nome: "Tecnologia no Campo",
    desc: "Soluções com drones, sensores e automação pra produção agrícola.",
    img: imgDrone,
  },
  {
    id: 2,
    nome: "Pecuária Sustentável",
    desc: "Inovações na pecuária, bem-estar animal e alimentação de qualidade.",
    img: imgSustentavel,
  },
  {
    id: 3,
    nome: "Agroindústria Familiar",
    desc: "Produtos e serviços direto da agroindústria local e familiar.",
    img: imgFamilia,
  },
  {
    id: 4,
    nome: "Soluções em Irrigação",
    desc: "Tecnologia eficiente pra irrigação de pequenas e grandes propriedades.",
    img: imgIrrigacao,
  },
  {
    id: 5,
    nome: "Máquinas e Equipamentos",
    desc: "Tratores, colheitadeiras e lançamentos do setor de máquinas agrícolas.",
    img: imgMaquina,
  },
];

export default function StandsPage() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-800">
        Confira os Expositores
      </h1>
      <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        Conheça quem tá trazendo inovação, tecnologia e oportunidade pro agro.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {expositores.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border shadow-md hover:shadow-lg transition hover:scale-105 hover:shadow-xl transition-transform duration-300
"
          >
            <img
              src={item.img}
              alt={item.nome}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-green-800">
                {item.nome}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
              <button
                onClick={() => alert(`Abrindo o stand de ${item.nome}`)}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Acessar Stand
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
