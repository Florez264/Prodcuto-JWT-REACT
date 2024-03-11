import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthCheck = () => {
 const [healthData, setHealthData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/actuator/health');
        setHealthData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
 }, []);

 if (loading) return <div>Cargando...</div>;
 if (error) return <div>Error: {error}</div>;

 return (
    <div>
      <h2>Estado de Salud</h2>
      <pre>{JSON.stringify(healthData, null, 2)}</pre>
    </div>
 );
};

export default HealthCheck;
