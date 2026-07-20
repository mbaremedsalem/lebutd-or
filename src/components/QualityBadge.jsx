// src/components/QualityBadge.jsx
import React from 'react';

const QualityBadge = ({ quality }) => {
  // Déterminer la couleur en fonction de la qualité
  const getQualityStyles = (q) => {
    const qualityMap = {
      'ممتاز': 'bg-green-100 text-green-700',
      'Excellent': 'bg-green-100 text-green-700',
      'excellent': 'bg-green-100 text-green-700',
      'جيد': 'bg-blue-100 text-blue-700',
      'Bon': 'bg-blue-100 text-blue-700',
      'bon': 'bg-blue-100 text-blue-700',
      'متوسط': 'bg-yellow-100 text-yellow-700',
      'Moyen': 'bg-yellow-100 text-yellow-700',
      'moyen': 'bg-yellow-100 text-yellow-700'
    };
    return qualityMap[q] || 'bg-gray-100 text-gray-700';
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getQualityStyles(quality)}`}>
      {quality}
    </span>
  );
};

export default QualityBadge;