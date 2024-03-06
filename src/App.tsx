import React from 'react';
import './App.css';
import GameBoard from './components/GameDashboard';
import Background from './data/multiple-colored-letters-wooden-table.jpg';

function App() {
  return (
    <div
              className="background"
              style={{ backgroundImage: `url(${Background})` }}
            >
      <GameBoard />
    </div>
  );
}

export default App;
