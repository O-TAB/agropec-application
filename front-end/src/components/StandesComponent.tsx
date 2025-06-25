
import { Link } from "react-router-dom";
import { StandEventResponse } from "../data/RequestStructures";

export const StandesComponent = (pin: StandEventResponse) => {
  return (
    <div
      className="bg-white rounded-xl border shadow-md 
                 hover:shadow-xl hover:scale-105 hover:-translate-y-1 
                 transition-transform duration-300"
    >
      <img
        src={pin.img}
        alt={pin.name}
        className="w-full h-48 object-cover rounded-t-xl"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold text-green-800">{pin.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{pin.descriptionCard}</p>

        <Link
          to={`/stands/${pin.id}`}
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
