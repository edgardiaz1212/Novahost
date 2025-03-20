import React from 'react'

function StatCard({ icon: Icon, title, value, color }) {
    let cardClass = "card mb-4  ";
    let iconClass = "icon";
  
    switch (color) {
      case "border-green-500":
        cardClass += " border-success";
        iconClass += " text-success";
        break;
      case "border-yellow-500":
        cardClass += " border-warning";
        iconClass += " text-warning";
        break;
      case "border-blue-500":
        cardClass += " border-primary";
        iconClass += " text-primary";
        break;
      case "border-purple-500":
        cardClass += " border-purple";
        iconClass += " text-purple";
        break;
      default:
        cardClass += " border-secondary";
        iconClass += " text-secondary";
    }
  
    return (
      <div className={cardClass}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="card-text text-muted">{title}</p>
            <p className="card-title h4 mt-2">{value}</p>
          </div>
          <Icon className={iconClass} size={32} />
        </div>
      </div>
    );
  }

export default StatCard