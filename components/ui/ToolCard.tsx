
import React from 'react';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  buttonText: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, icon, path, buttonText }) => {
  return (
    <div className="bg-dark-bg rounded-xl shadow-lg border border-dark-border p-6 flex flex-col items-center text-center hover:shadow-2xl hover:border-whatsapp-green transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-6xl text-dark-text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-md font-semibold text-dark-text-primary mb-5 flex-grow flex items-center justify-center min-h-[4rem]">{title}</h3>
      <Link to={path} className="w-full mt-auto">
        <button className="w-full bg-whatsapp-green text-white font-bold py-2 px-4 rounded-lg hover:bg-whatsapp-teal-green transition-colors flex items-center justify-center">
          {buttonText}
          <i className="fa-solid fa-arrow-up-right-from-square text-xs ms-2"></i>
        </button>
      </Link>
    </div>
  );
};

export default React.memo(ToolCard);
