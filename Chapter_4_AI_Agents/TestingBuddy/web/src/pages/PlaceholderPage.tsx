import React from 'react';

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
      <h1 className="heading-1">{title}</h1>
      <p className="text-muted" style={{ maxWidth: '400px' }}>
        This page is a placeholder and will be implemented in a future iteration.
      </p>
    </div>
  );
};

export default PlaceholderPage;
