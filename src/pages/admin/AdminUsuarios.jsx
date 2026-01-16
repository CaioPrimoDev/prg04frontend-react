import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAdminUsuarios } from './useAdminUsuarios';

const AdminUsuarios = () => {
    const {
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        gestores,
        loading,
        novoGestor,
        setNovoGestor,
        handleCriarGestor,
        toggleStatus,
        submitting, // Novo
        feedback    // Novo
    } = useAdminUsuarios();

    return (
        <div className="admin-container">
            <AdminSidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

            <div className="admin-content bg-dark text-white" style={{ minHeight: '100vh' }}>
                <button className="btn btn-outline-light d-lg-none m-3" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i> Menu
                </button>

                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                        <h2 className="fw-bold text-danger">
                            <i className="bi bi-people-fill me-2"></i> Gestores
                        </h2>
                        <button 
                            className="btn btn-warning fw-bold" 
                            data-bs-toggle="modal" 
                            data-bs-target="#modalNovoGestor"
                        >
                            <i className="bi bi-plus-lg me-2"></i> Novo Gestor
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-danger" role="status"></div>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {gestores.length === 0 && (
                                <p className="text-muted text-center">Nenhum gestor cadastrado.</p>
                            )}

                            {gestores.map(user => (
                                <div key={user.id} className="col-12">
                                    <div className="card bg-black border border-secondary shadow-sm">
                                        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                                            
                                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{width:'50px', height:'50px', fontSize:'1.5rem'}}>
                                                    <i className="bi bi-person"></i>
                                                </div>
                                                <div>
                                                    <h5 className="mb-0 fw-bold text-white">{user.email}</h5>
                                                    <small className="text-secondary">CPF: {user.cpf}</small>
                                                </div>
                                            </div>

                                            <div className="text-center" style={{minWidth: '120px'}}>
                                                <span className={`badge rounded-pill ${user.status ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                                                    <i className={`bi ${user.status ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
                                                    {user.status ? 'ATIVO' : 'INATIVO'}
                                                </span>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button 
                                                    onClick={() => toggleStatus(user.id)}
                                                    className={`btn btn-sm ${user.status ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                    title={user.status ? "Desativar conta" : "Ativar conta"}
                                                >
                                                    <i className={`bi ${user.status ? 'bi-slash-circle' : 'bi-check-lg'} me-1`}></i>
                                                    {user.status ? 'Desativar' : 'Reativar'}
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL NOVO GESTOR --- */}
            <div className="modal fade" id="modalNovoGestor" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark text-white border-secondary">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title">Cadastrar Novo Gestor</h5>
                            {/* Adicionei 'disabled' ao fechar se estiver enviando */}
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" id="btn-close-modal" aria-label="Close" disabled={submitting}></button>
                        </div>
                        <form onSubmit={handleCriarGestor}>
                            <div className="modal-body">
                                
                                {/* FEEDBACK VISUAL (MENSAGEM) */}
                                {feedback.msg && (
                                    <div className={`alert ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center`} role="alert">
                                        <i className={`bi ${feedback.type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-2`}></i>
                                        <div>{feedback.msg}</div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label text-secondary">E-mail</label>
                                    <input 
                                        type="email" 
                                        className="form-control bg-black text-white border-secondary"
                                        required
                                        value={novoGestor.email}
                                        onChange={e => setNovoGestor({...novoGestor, email: e.target.value})}
                                        disabled={submitting} // Trava input
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-secondary">CPF</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-black text-white border-secondary"
                                        required
                                        placeholder="000.000.000-00"
                                        value={novoGestor.cpf}
                                        onChange={e => setNovoGestor({...novoGestor, cpf: e.target.value})}
                                        disabled={submitting} // Trava input
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-secondary">Senha Inicial</label>
                                    <input 
                                        type="password" 
                                        className="form-control bg-black text-white border-secondary"
                                        required
                                        value={novoGestor.senha}
                                        onChange={e => setNovoGestor({...novoGestor, senha: e.target.value})}
                                        disabled={submitting} // Trava input
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={submitting}>Cancelar</button>
                                
                                {/* BOTÃO COM SPINNER */}
                                <button type="submit" className="btn btn-danger" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Salvando...
                                        </>
                                    ) : (
                                        'Cadastrar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsuarios;