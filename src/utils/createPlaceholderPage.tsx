
import React from 'react';
import Layout from '@/components/layout/Layout';

export const createPlaceholderPage = (title: string, description?: string) => {
  return () => (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-gray-600">{description}</p>}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center text-gray-500">
            Esta página está em desenvolvimento.
          </p>
        </div>
      </div>
    </Layout>
  );
};
