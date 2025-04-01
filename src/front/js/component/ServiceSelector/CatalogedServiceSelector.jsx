import React, { useState, useEffect, useContext } from 'react';
import { Server } from 'lucide-react';
import { Context } from '../../store/appContext'; // Import the Context

function CatalogedServiceSelector({ onTierSelect }) {
  const { store, actions } = useContext(Context);
  const [predefinedPlans, setPredefinedPlans] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [tierColors, setTierColors] = useState({}); // New state for dynamic tier colors

  // Fetch predefined plans (services)
  useEffect(() => {
    const fetchPredefinedPlans = async () => {
      try {
        await actions.fetchServices();
        setPredefinedPlans(store.services);
      } catch (error) {
        console.error('Error fetching predefined plans:', error);
      }
    };
    fetchPredefinedPlans();
  }, []);

  // Generate dynamic tier colors when plans change
  useEffect(() => {
    const generateTierColors = () => {
      const newTierColors = {};
      store.services.forEach((plan, index) => {
        newTierColors[plan.nombre.toUpperCase()] = index % 6; // Cycle through 6 colors
      });
      setTierColors(newTierColors);
    };

    generateTierColors();
  }, [store.services]); // Re-run when store.services changes

  const handleTierSelect = (plan) => {
    setSelectedTier(plan);
    onTierSelect(plan); // Notify the parent component of the selected plan
  };

  // Color gradient for tiers (using plan name as "tier")
  const getTierColor = (tier) => {
    const colors = {
      background: ['#e6f0ff', '#cce0ff', '#99c2ff', '#66a3ff', '#3385ff', '#0066ff'],
      border: ['#b3d1ff', '#80b3ff', '#4d94ff', '#1a75ff', '#0059df', '#0047b3'],
      text: ['#0047b3', '#003d99', '#003380', '#002966', '#00204d', '#ffffff'],
    };

    const tierIndex = tierColors[tier.toUpperCase()] || 0; // Get index from mapping or default to 0
    return {
      bg: colors.background[tierIndex],
      border: colors.border[tierIndex],
      text: colors.text[tierIndex],
    };
  };

  return (
    <>
      {/* Select Hosting Tier */}
      <div className="mb-6">
        <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
          <Server className="w-6 h-6 text-indigo-600" />
          Selecciona Plan Hosting
        </h2>
        <div className="row row-cols-2 g-4">
          {predefinedPlans.map((plan) => {
            const tierColor = getTierColor(plan.nombre); // Use plan name as "tier"
            const isActive = selectedTier && selectedTier.id === plan.id;

            return (
              <div className="col" key={plan.id}>
                <button
                  onClick={() => handleTierSelect(plan)}
                  className="btn w-100 p-3 rounded-3 border-2 transition-all"
                  style={{
                    backgroundColor: isActive ? tierColor.bg : 'transparent',
                    borderColor: tierColor.border,
                    color: isActive ? tierColor.text : tierColor.border,
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                >
                  {plan.nombre}
                  <br />
                  RAM: {plan.ram} GB
                  <br />
                  Disco: {plan.disco} GB
                  <br />
                  Procesador: {plan.procesador}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CatalogedServiceSelector;
