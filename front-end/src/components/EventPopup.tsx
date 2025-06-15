
import React from 'react';

const EventPopup = ({ eventData, onClose }) => {
  if (!eventData) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {eventData.image && (
          <img src={eventData.image} alt={eventData.title} className="w-full h-48 md:h-56 object-cover" />
        )}
        
        <div className="p-4 md:p-6 overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{eventData.title}</h2>
          <p className="text-base text-gray-600 whitespace-pre-wrap">{eventData.description}</p>
        </div>

        <div className="p-4 bg-gray-50 border-t text-right">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;