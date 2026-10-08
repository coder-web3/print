import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`toast show ${isSuccess ? 'toast-success' : isError ? 'toast-error' : ''}`}>
      <i
        className={`fa-solid ${
          isSuccess
            ? 'fa-circle-check'
            : isError
            ? 'fa-circle-exclamation'
            : 'fa-circle-info'
        }`}
        style={{
          fontSize: '22px',
          color: isSuccess ? '#27ae60' : isError ? '#e74c3c' : '#982d95'
        }}
      ></i>
      <div>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#17203b', marginBottom: '2px' }}>
          {toast.title || 'Notice'}
        </h4>
        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{toast.message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </div>
  );
}
