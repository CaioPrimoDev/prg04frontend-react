import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isOpen, closeSidebar }) => {
    
    // Lógica para adicionar a classe 'open' quando o estado for true (no mobile)
    // No desktop, o CSS @media ignora o translateX(-100%), então ela aparece mesmo sem 'open'
    const sidebarClasses = `admin-sidebar d-flex flex-column ${isOpen ? 'open' : ''}`;

    return (
        <aside className={sidebarClasses}>
            <div className="mb-4 px-2">
                <h5 className="text-white fw-bold mb-0">Painel Admin</h5>
                <small className="text-muted">Gerenciamento</small>
            </div>

            <nav className="flex-grow-1">
                <NavLink 
                    to="/admin/filmes" 
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={closeSidebar} // Fecha o menu ao clicar (bom para mobile)
                >
                    <i className="bi bi-film"></i>
                    Filmes
                </NavLink>

                <NavLink 
                    to="/admin/usuarios" 
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={closeSidebar}
                >
                    <i className="bi bi-people"></i>
                    Usuários
                </NavLink>

                <NavLink
                    to="/admin/sessoes"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={closeSidebar}
                >
                    <i className="bi bi-clock-history"></i>
                    Sessões
                </NavLink>
                
            </nav>

            <div className="mt-auto pt-3 border-top border-secondary">
                <NavLink to="/" className="sidebar-link text-danger">
                    <i className="bi bi-box-arrow-left"></i>
                    Sair / Voltar ao Site
                </NavLink>
            </div>
        </aside>
    );
};

export default AdminSidebar;