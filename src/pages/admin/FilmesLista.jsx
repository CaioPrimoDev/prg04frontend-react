import React, { useState } from 'react'; // Adicionei useState
import { Link } from 'react-router-dom';
import CardFilm from '../../components/cardFilm';
import { useFilmes } from './useFilmes';

const FilmesLista = () => {
    // Hooks existentes
    const {
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
    } = useFilmes();

    // --- NOVO: Estado para controlar a URL do trailer no iframe ---
    const [trailerUrl, setTrailerUrl] = useState(null);

    // --- NOVO: Função Mágica para converter link do YouTube em Embed ---
    const getEmbedUrl = (url) => {
        if (!url) return null;
        // Regex que pega o ID tanto de 'youtube.com/watch?v=' quanto de 'youtu.be/'
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    };

    // --- NOVO: Função para abrir o trailer ---
    const handleAssistirTrailer = (urlOriginal) => {
        const embed = getEmbedUrl(urlOriginal);
        if (embed) {
            setTrailerUrl(embed);
        } else {
            alert("URL do trailer inválida ou não encontrada.");
        }
    };

    // --- NOVO: Função para limpar o vídeo ao fechar (para o som não continuar tocando) ---
    const limparTrailer = () => {
        setTrailerUrl(null);
    };

    return (
        <div className="container-fluid text-white mb-5">
            
            {/* CABEÇALHO */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 pt-3">
                <div className="mb-3 mb-md-0">
                    <h2 className="mb-0 fw-bold font-recursive text-warning">
                        <i className="bi bi-grid-3x3-gap me-2"></i>Catálogo de Filmes
                    </h2>
                    <small className="text-muted font-recursive">Gerencie os cards exibidos na Home</small>
                </div>
                <Link to="/admin/filmes/novo" className="btn btn-danger fw-bold shadow-sm font-recursive">
                    <i className="bi bi-plus-circle me-2"></i>Novo Filme
                </Link>
            </div>

            {/* FEEDBACK DE ERRO E LOADING */}
            {erro && <div className="alert alert-danger shadow-sm">{erro}</div>}
            
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-warning" style={{width: '3rem', height: '3rem'}} role="status"></div>
                    <p className="mt-2 text-muted">Carregando cards...</p>
                </div>
            )}

            {/* LISTAGEM DOS CARDS */}
            {!loading && !erro && (
                <>
                    <div className="row g-4">
                        {filmes.length === 0 ? (
                            <div className="text-center py-5 text-muted col-12">
                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                Nenhum filme encontrado nesta página.
                            </div>
                        ) : (
                            filmes.map((filme) => (
                                <CardFilm 
                                    key={filme.id}
                                    image={filme.imagemUrl}
                                    title={filme.titulo}
                                    description={filme.descricao}
                                    className="bg-dark text-white border-secondary shadow-lg"
                                >
                                    {/* INFO EXTRA NO CARD */}
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-secondary bg-opacity-50 text-uppercase" style={{fontSize: '0.7rem'}}>
                                            {filme.genero || 'Geral'}
                                        </span>
                                        <span className={`badge ${getClassificacaoCor(filme.classificacao)}`} style={{width: '25px'}}>
                                            {formatarClassificacao(filme.classificacao)}
                                        </span>
                                    </div>

                                    {/* ÁREA DE PREÇO E STATUS */}
                                    <div className="mt-2 pt-2 border-top border-secondary">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="text-success fw-bold">{formatarPreco(filme.preco)}</span>
                                            <span className={`badge ${filme.ativo === true ? 'bg-success' : 'bg-danger'} bg-opacity-75`}>
                                                {filme.ativo === true ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>

                                        {/* BOTÕES DE AÇÃO */}
                                        <div className="btn-group w-100" role="group">
                                            <button className="btn btn-outline-light" onClick={() => abrirDetalhes(filme)} title="Ver Detalhes">
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <Link to={`/admin/filmes/editar/${filme.id}`} className="btn btn-outline-info" title="Editar">
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <button className="btn btn-outline-danger" onClick={() => excluirFilme(filme.id)} title="Excluir">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </CardFilm>
                            ))
                        )}
                    </div>

                    {/* PAGINAÇÃO */}
                    {totalPaginas > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <nav aria-label="Navegação de filmes">
                                <ul className="pagination">
                                    <li className={`page-item ${paginaAtual === 0 ? 'disabled' : ''}`}>
                                        <button className="page-link bg-dark border-secondary text-white" onClick={() => setPaginaAtual(curr => curr - 1)}>Anterior</button>
                                    </li>
                                    <li className="page-item disabled">
                                        <span className="page-link bg-dark border-secondary text-muted">{paginaAtual + 1} de {totalPaginas}</span>
                                    </li>
                                    <li className={`page-item ${paginaAtual === totalPaginas - 1 ? 'disabled' : ''}`}>
                                        <button className="page-link bg-dark border-secondary text-white" onClick={() => setPaginaAtual(curr => curr + 1)}>Próximo</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            )}

            {/* MODAL DE DETALHES (FILME SELECIONADO) */}
            <div className="modal fade" id="modalDetalhes" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white border-secondary shadow-lg">
                        {filmeSelecionado && (
                            <>
                                <div className="modal-header border-secondary">
                                    <h5 className="modal-title fw-bold text-warning">{filmeSelecionado.titulo}</h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-5 mb-3 mb-md-0">
                                            <img 
                                                src={filmeSelecionado.imagemUrl || "https://via.placeholder.com/300x450"} 
                                                alt="Capa" 
                                                className="img-fluid rounded shadow border border-secondary w-100"
                                                style={{maxHeight: '400px', objectFit: 'cover'}}
                                            />
                                        </div>
                                        <div className="col-md-7">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <span className={`badge ${getClassificacaoCor(filmeSelecionado.classificacao)} p-2`}>
                                                    {formatarClassificacao(filmeSelecionado.classificacao)}
                                                </span>
                                                <span className="badge bg-secondary text-uppercase">{filmeSelecionado.genero || 'N/A'}</span>
                                                {filmeSelecionado.meiaEntrada && <span className="badge bg-info text-dark">Meia-Entrada</span>}
                                            </div>

                                            <h6 className="text-secondary fw-bold small">SINOPSE</h6>
                                            <p className="text-light small">{filmeSelecionado.descricao}</p>
                                            
                                            <div className="row border-top border-secondary pt-3 mt-3">
                                                <div className="col-4 text-center border-end border-secondary">
                                                    <span className="d-block text-secondary small">Duração</span>
                                                    <span className="fw-bold">{filmeSelecionado.duracao} min</span>
                                                </div>
                                                <div className="col-4 text-center border-end border-secondary">
                                                    <span className="d-block text-secondary small">Gênero</span>
                                                    <span className="fw-bold small">{filmeSelecionado.genero || '-'}</span>
                                                </div>
                                                <div className="col-4 text-center">
                                                    <span className="d-block text-secondary small">Preço</span>
                                                    <span className="fw-bold text-success fs-5">{formatarPreco(filmeSelecionado.preco)}</span>
                                                </div>
                                            </div>
                                            
                                            {/* BOTÃO ATUALIZADO: ABRE O NOVO MODAL DE VÍDEO */}
                                            {filmeSelecionado.trailerYoutube && (
                                                <button 
                                                    className="btn btn-outline-danger w-100 mt-4"
                                                    data-bs-toggle="modal" 
                                                    data-bs-target="#modalTrailer"
                                                    onClick={() => handleAssistirTrailer(filmeSelecionado.trailerYoutube)}
                                                >
                                                    <i className="bi bi-youtube me-2"></i>Assistir Trailer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- NOVO: MODAL EXCLUSIVO PARA O TRAILER --- */}
            <div 
                className="modal fade" 
                id="modalTrailer" 
                tabIndex="-1" 
                aria-hidden="true" 
                // Este evento é importante: se o usuário clicar fora, queremos limpar o vídeo
                onClick={(e) => { if(e.target.id === 'modalTrailer') limparTrailer() }}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content bg-black border-secondary">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title text-white">Trailer</h5>
                            {/* Ao fechar, limpamos a URL para o som parar */}
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={limparTrailer}></button>
                        </div>
                        <div className="modal-body p-0">
                            <div className="ratio ratio-16x9">
                                {trailerUrl && (
                                    <iframe 
                                        src={trailerUrl} 
                                        title="Trailer do Filme" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FilmesLista;