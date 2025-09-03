import React from 'react';

interface ReportHeaderProps {
  title: string;
  date?: string;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  title, 
  date = new Date().toLocaleDateString('pt-BR') 
}) => {
  return (
    <div className="w-full bg-white py-8 px-6 mb-8 border-b-2 border-primary print:mb-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src="/lovable-uploads/8ba74621-2ca4-4d07-80c1-77150e22d984.png" 
            alt="ABELV Engenharia" 
            className="h-16 w-auto object-contain"
          />
        </div>
        
        {/* Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
            {title}
          </h1>
        </div>
        
        {/* Date */}
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-medium text-muted-foreground">
            Data: {date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;