import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import AdminSidebar from '../../components/admin/adminSidebar.jsx';
import '../styles/admin.css'; 

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Header />

      {/* Container Principal definido no CSS */}
      <div className="admin-container">
        
        {/* Passamos o estado para a Sidebar aplicar a classe .open se necessário */}
        <AdminSidebar 
            isOpen={isSidebarOpen} 
            closeSidebar={() => setIsSidebarOpen(false)} 
        />

        {/* Conteúdo (Outlet) com a classe admin-content */}
        <main className="admin-content">
            {/* Overlay para fechar menu no mobile (Opcional, mas recomendado) */}
            {isSidebarOpen && (
                <div 
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
                    style={{ zIndex: 999 }} // Fica logo abaixo da sidebar (1000)
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <Outlet />
        </main>

        {/* Botão Flutuante (Apenas Mobile - CSS controla display:none no Desktop) */}
        <button 
            className="btn btn-warning mobile-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
                position: 'fixed', bottom: '20px', right: '20px', zIndex: 1100,
                borderRadius: '50%', width: '50px', height: '50px', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center'
            }}
        >
            <i className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'}`} style={{fontSize: '1.5rem'}}></i>
        </button>
      </div>
    </>
  );
};

export default AdminLayout;