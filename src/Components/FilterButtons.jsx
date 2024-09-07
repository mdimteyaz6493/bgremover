import React, { useState } from 'react';


const FilterButtons = () => {
  const [filter, setFilter] = useState('Brightness');

  return (
    <div className="filter-buttons">
      <button className={filter === 'Brightness' ? 'active' : ''} onClick={() => setFilter('Brightness')}>
        <img src="bright.svg" alt="Brightness" />
      </button>
      <button onClick={() => setFilter('Contrast')}>
        <img src="contrast.svg" alt="Contrast" />
      </button>
      {/* Repeat for other filter buttons */}
    </div>
  );
};

export default FilterButtons;
