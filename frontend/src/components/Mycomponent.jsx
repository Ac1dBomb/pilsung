// In your Vite frontend component
import { useEffect, useState } from 'react';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/items') // The route that your backend is serving data from
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError("Failed to load data. Please try again later.");
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
        {items.map(item => (
           <div key={item.id}> {/* Ensure each item has a unique key */}
               {/* Access and display your data here */}
               <p>ID: {item.id}</p> {/* Example: Accessing an 'id' property */}
               <p>Name: {item.name}</p> {/* Example: Accessing a 'name' property */}
               {/* Add more elements to display other properties */}

           </div>

        ))}
    </div>
  );
}

export default MyComponent;