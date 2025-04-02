import React from 'react';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, title, value, color, category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/details/${category}`, { state: { color } });
  };

  // Determine the Bootstrap classes based on the color prop
  let cardClass = 'card border-2 mb-4 shadow-sm'; // Default card classes
  let textColor = 'text-dark'; // Default text color
  let iconColor = 'text-dark'; // Default icon color

  switch (color) {
    case 'border-green-500':
      cardClass += ' border-success';
      textColor = 'text-success';
      iconColor = 'text-success';
      break;
    case 'border-red-500':
      cardClass += ' border-danger';
      textColor = 'text-danger';
      iconColor = 'text-danger';
      break;
    case 'border-blue-500':
      cardClass += ' border-primary';
      textColor = 'text-primary';
      iconColor = 'text-primary';
      break;
    case 'border-purple-500':
      cardClass += ' border-purple'; // You might need to define this custom class in your CSS
      textColor = 'text-purple'; // You might need to define this custom class in your CSS
      iconColor = 'text-purple'; // You might need to define this custom class in your CSS
      break;
    default:
      cardClass += ' border-secondary';
      textColor = 'text-secondary';
      iconColor = 'text-secondary';
  }

  return (
    <div className={`${cardClass} cursor-pointer`} onClick={handleClick}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="card-text text-muted">{title}</p>
          <p className={`card-title h4 mt-2 ${textColor}`}>{value}</p>
        </div>
        <Icon className={`${iconColor}`} size={32} />
      </div>
    </div>
  );
}

export default StatCard;
