import React, { useEffect, useState } from 'react';



import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch('https://dogapi.dog/api/v2/breeds');
      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dog Breeds</h1>
      <ul>
        {data.map((breed: any) => (
          <li key={breed.id}>
            <Link to={`/breeds/${breed.id}`} className="text-blue-600 hover:underline">
              {breed.attributes.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

