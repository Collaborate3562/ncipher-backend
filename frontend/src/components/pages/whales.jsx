import React, { useEffect, useState } from 'react';
import Navbar from "../common/Navbar";
import IntervalForm from "../views/intervalForm";
import WhalesTable from "../views/whalesTable";
import axios from 'axios';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

function Whales(props) {
  const [currentTimer, setCurrentTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [whaleData, setWhaleData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWhaleAccounts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${BACKEND_API_URL}/api/whale-transactions`);
      setWhaleData(response.data);
    } catch (error) {
      console.error('Error fetching whale transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhaleAccounts(); // Initial fetch
    return () => {
      if (currentTimer) {
        clearInterval(currentTimer);
      }
    };
  }, []);

  const createTimer = (intervalMins) => {
    if (currentTimer) {
      clearInterval(currentTimer);
    }
    setRemainingTime(intervalMins * 60);
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 0) {
          refreshTable()
          return intervalMins * 60;
        }
        return prevTime - 1;
      });
    }, 1000);
    setCurrentTimer(timer);
  };

  const refreshTable = async () => {
    setWhaleData([]);
    await fetchWhaleAccounts();
  }

  const handleChange = (interval) => {
    createTimer(interval);
  };

  return (
    <div id="whales" className="h-screen">
      <Navbar />
      <IntervalForm startInterval={handleChange} remainingTime={remainingTime} />
      <WhalesTable whaleData={whaleData} loading={loading} />
    </div>
  );
}

export default Whales;