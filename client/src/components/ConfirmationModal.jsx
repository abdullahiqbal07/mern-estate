import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded shadow-lg">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-3">
            <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    );
  };
  

export default ConfirmationModal;
