import { useEffect, useState } from "react";

const BeautifulList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Replace with your API endpoint
    fetch("/api/get-ojects")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Data</h1>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-[1.02] transition"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeautifulList;
