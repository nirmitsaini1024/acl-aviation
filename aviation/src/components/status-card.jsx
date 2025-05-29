import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const StatusCard = ({ 
  title = "Status", 
  count = 0, 
  icon, 
  bgColor = "bg-gray-100", 
  textColor = "text-gray-600", 
  onClick 
}) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow" 
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;