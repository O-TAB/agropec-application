import React from "react";
import { Link } from "react-router-dom";

interface Props {
  id: number;
  nome: string;
  desc: string;
  img: string;
}

export const StandesComponent = ({ id, nome, desc, img }: Props) => {
  return (
    <div
      className="bg-white rounded-xl border shadow-md 
                 hover:shadow-xl hover:scale-105 hover:-translate-y-1 
                 transition-transform duration-300"
    >
      <img
        src={img}
        alt={nome}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold text-green-800">{nome}</h2>
        <p className="text-sm text-gray-600 mb-4">{desc}</p>

        <Link
          to={`/stands/${id}`}
          className="w-full block text-center py-2 
                     bg-green-600 text-white rounded 
                     hover:bg-green-700 transition"
        >
          Acessar Stand
        </Link>
      </div>
    </div>
  );
};
