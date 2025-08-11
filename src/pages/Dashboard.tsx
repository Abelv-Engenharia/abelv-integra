
import React from 'react';
import Layout from '@/components/layout/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total de Desvios</h3>
            <p className="text-3xl font-bold text-blue-600">127</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Treinamentos</h3>
            <p className="text-3xl font-bold text-green-600">89</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Funcionários</h3>
            <p className="text-3xl font-bold text-purple-600">456</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Ocorrências</h3>
            <p className="text-3xl font-bold text-red-600">23</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
