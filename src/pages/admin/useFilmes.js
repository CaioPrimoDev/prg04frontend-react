import { useState, useEffect } from 'react';

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

    const API_URL = 'http://localhost:8080/filmes'; 

    // --- EFEITOS ---
    useEffect(() => {
        carregarFilmes(paginaAtual);
    }, [paginaAtual]);

    // --- FUNÇÕES DE LÓGICA / API ---
    const carregarFilmes = async (pagina) => {
        setLoading(true);""
        setErro(null);
        try {
            const response = await fetch(`${API_URL}/findall?page=${pagina}&size=${ITENS_POR_PAGINA}`);
            if (!response.ok) throw new Error('Falha ao comunicar com o servidor.');
            
            const data = await response.json();
            
            if (data.content) {
                setFilmes(data.content);
                setTotalPaginas(data.totalPages);
            } else {
                setFilmes(data); 
            }
        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar o catálogo de filmes.");
        } finally {
            setLoading(false);
        }
    };

    const excluirFilme = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este filme permanentemente?")) return;

        try {
            const response = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });

            if (response.ok) {
                setFilmes(prevFilmes => prevFilmes.filter(f => f.id !== id));
                alert("Filme excluído com sucesso!");
            } else {
                alert("Erro ao excluir no servidor.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão ao tentar excluir.");
        }
    };

    const abrirDetalhes = (filme) => {
        setFilmeSelecionado(filme);
        // Lógica de manipulação do DOM do Bootstrap mantida aqui para limpar a View
        setTimeout(() => {
            const modalElement = document.getElementById('modalDetalhes');
            if (modalElement && window.bootstrap) {
                const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                modal.show();
            }
        }, 50);
    };

    // --- FUNÇÕES DE FORMATAÇÃO (Helpers) ---
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

    const formatarPreco = (valor) => {
        if (valor === null || valor === undefined) return 'R$ --,--';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    // Retorna tudo que a View precisa usar
    return {
        filmes,
        loading,
        erro,
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        filmeSelecionado,
        excluirFilme,
        abrirDetalhes,
        getClassificacaoCor,
        formatarClassificacao,
        formatarPreco
    };
};