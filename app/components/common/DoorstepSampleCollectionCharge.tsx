import React, { useState } from "react";

interface Collection {
  id: number;
  name: string;
  price: number;
}

interface Props {
  onClose: () => void;
  onAdd: (collections: Collection[]) => void;
  collections: Collection[];
}

const DoorstepSampleCollectionCharge: React.FC<Props> = ({
  onClose,
  onAdd,
  collections,
}) => {
  
  const [newCollection, setNewCollection] = useState<Omit<Collection, 'id'>>({ name: '', price: 0 });
  const handleAdd = () => {
    if (newCollection.name && newCollection.price > 0) {
      
      const updatedCollections = [
        ...collections,
        { ...newCollection, id: collections.length + 1 },
      ];
      
      onAdd(updatedCollections);
      setNewCollection({ name: '', price: 0 });
    }
  };

  const handleDelete = (id: number) => {
    const updatedCollections = collections.filter((collection) => collection.id !== id);
    onAdd(updatedCollections);
  };

  const handleSave = () => {
    onAdd(collections);
    onClose();
  };

  return (
    <div className="bg-white text-black rounded w-full max-w-4xl mx-4">
      
      {/* Modal Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Add Home Collection</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 text-xl font-bold rounded-full hover:bg-gray-100"
        >
          ×
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left font-medium border-b">
                Sr. No.
              </th>
              <th className="py-2 px-4 text-left font-medium border-b">
                Collection Name
              </th>
              <th className="py-2 px-4 text-left font-medium border-b">
                Price
              </th>
              <th className="py-2 px-4 text-left font-medium border-b">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-b">
                <td className="py-2 px-4">{collection.id}</td>
                <td className="py-2 px-4">{collection.name}</td>
                <td className="py-2 px-4">{collection.price}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="px-3 py-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(collection.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-b">
              <td className="py-2 px-4">{collections.length + 1}</td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  placeholder="Enter here"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                  className="w-full px-3 py-1 border rounded focus:outline-none focus:border-blue-500"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  placeholder="Enter here"
                  value={newCollection.price}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-1 border rounded focus:outline-none focus:border-blue-500"
                />
              </td>
              <td className="py-2 px-4">
                <button
                  className="px-3 py-1 text-blue-500 hover:text-blue-700"
                  onClick={handleAdd}
                >
                  + Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end p-4 border-t">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DoorstepSampleCollectionCharge;
