import React, { useState } from 'react';
import axios from 'axios';

const WhaleTrackerSettings = () => {
  const [interval, setInterval] = useState(60); // Default to 60 minutes

  const handleIntervalChange = (e) => {
	setInterval(e.target.value);
  };

  const handleSave = async () => {
	await axios.post('/api/whale-tracker-interval', { interval });
  };

  return (
	<div>
	  <h2>Whale Tracker Settings</h2>
	  <label>
		Interval (minutes):
		<input type="number" value={interval} onChange={handleIntervalChange} />
	  </label>
	  <button onClick={handleSave}>Save</button>
	</div>
  );
};

export default WhaleTrackerSettings;