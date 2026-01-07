import { useState, useEffect } from 'react';
// IMPORTANTE: Certifique-se que este caminho aponta para onde você configura o axios.create()
// E NÃO para o AuthContext.
import api from '../../api/axiosConfig'; 

export const useFilmes = () => {
    // --- ESTADOS ---
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    
    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const ITENS_POR_PAGINA = 9; 

    // Modal
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);

    // --- EFEITOS ---
    useEffect(() => {
        carregarFilmes(paginaAtual);
    }, [paginaAtual]);

    // --- FUNÇÕES ---

    const carregarFilmes = async (pagina) => {
        setLoading(true);
        setErro(null);
        try {
            // CORREÇÃO 1: Caminho relativo.
            // O Axios transforma em: http://localhost:8080/filmes/findall?...
            const response = await api.get(`/filmes/findall?page=${pagina}&size=${ITENS_POR_PAGINA}`);
            
            // Axios usa response.data para o corpo da resposta
            const data = response.data;
            
            if (data.content) {
                setFilmes(data.content);
                setTotalPaginas(data.totalPages);
            } else {
                setFilmes(data); 
            }
        } catch (error) {
            console.error("Erro ao carregar:", error);
            setErro("Não foi possível carregar o catálogo.");
        } finally {
            setLoading(false);
        }
    };

    const excluirFilme = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir permanentemente?")) return;

        try {
            // CORREÇÃO 2: Caminho relativo correto
            // O Axios transforma em: http://localhost:8080/filmes/delete/{id}/hard
            await api.delete(`/filmes/delete/${id}/hard`);

            // Se não deu erro no await, é sucesso (200 ou 204)
            setFilmes(prevFilmes => prevFilmes.filter(f => f.id !== id));
            alert("Filme excluído com sucesso!");

        } catch (error) {
            console.error("Erro ao excluir:", error);
            if (error.response && error.response.status === 403) {
                alert("ERRO 403: Acesso negado. Verifique se você é ADMIN e se o Token está válido.");
            } else {
                alert("Erro ao excluir no servidor.");
            }
        }
    };

    const abrirDetalhes = (filme) => {
        setFilmeSelecionado(filme);
        setTimeout(() => {
            const modalElement = document.getElementById('modalDetalhes');
            if (modalElement && window.bootstrap) {
                const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }, 50);
    };

    // --- HELPERS (Mantidos) ---
    const getClassificacaoCor = (tipo) => {
        if (!tipo) return 'bg-secondary';
        switch (tipo) {
            case 'LIVRE': return 'bg-success';
            case 'DEZ': return 'bg-primary';
            case 'DOZE': return 'bg-warning text-dark';
            case 'QUATORZE': return 'bg-warning text-dark'; 
            case 'DEZESSEIS': return 'bg-danger';
            case 'DEZOITO': return 'bg-black border border-danger';
            default: return 'bg-secondary';
        }
    };

    const formatarClassificacao = (tipo) => {
        if (!tipo) return '?';
        switch (tipo) {
            case 'LIVRE': return 'L';
            case 'DEZ': return '10';
            case 'DOZE': return '12';
            case 'QUATORZE': return '14';
            case 'DEZESSEIS': return '16';
            case 'DEZOITO': return '18';
            default: return '?';
        }
    };

    const toggleStatusFilme = async (id, statusAtual) => {
        try {
            if (statusAtual === true) {
                // Se está ativo, vamos desativar
                await api.delete(`/filmes/disable/${id}`);
            } else {
                // Se está inativo, vamos ativar
                await api.delete(`/filmes/activate/${id}`);
            }

            // Atualiza a lista localmente para refletir a mudança sem recarregar tudo
            setFilmes(prev => prev.map(f => 
                f.id === id ? { ...f, ativo: !statusAtual } : f
            ));
            
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status do filme.");
        }
    };

    const formatarPreco = (valor) => {
        if (valor === null || valor === undefined) return 'R$ --,--';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return {
        filmes,
        loading,
        erro,
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        filmeSelecionado,
        excluirFilme,
        toggleStatusFilme,
        abrirDetalhes,
        getClassificacaoCor,
        formatarClassificacao,
        formatarPreco
    };
};