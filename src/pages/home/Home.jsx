import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardFilm from "../../components/cardFilm";
import { Link } from "react-router-dom";

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para os Modais
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/filmes/ativos')
      .then(response => {
          if (!response.ok) throw new Error('Erro ao buscar filmes ativos');
          return response.json();
      })
      .then(data => {
        setFilmes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar catálogo:", error);
        setLoading(false);
      });
  }, []);

  // --- TRADUTOR DE CLASSIFICAÇÃO (JAVA ENUM -> TEXTO VISUAL) ---
  const formatarClassificacao = (valor) => {
      if (!valor) return '-';
      
      const mapa = {
          'LIVRE': 'L',
          'DEZ': '10',
          'DOZE': '12',
          'QUATORZE': '14',
          'DEZESSEIS': '16',
          'DEZOITO': '18'
      };
      // Se estiver no mapa retorna o número, se não, retorna o que veio (caso já venha número)
      return mapa[valor] || valor; 
  };

  // --- CORES DA CLASSIFICAÇÃO ---
  const getClassificacaoCor = (valor) => {
    if (!valor) return 'bg-secondary';
    
    // Normalizamos para string para garantir a comparação
    const v = valor.toString(); 

    // Verifica tanto o texto (DEZOITO) quanto o número ('18')
    if (v === 'LIVRE' || v === 'L') return 'bg-success';
    if (v === 'DEZ' || v === '10') return 'bg-primary';
    if (v === 'DOZE' || v === '12') return 'bg-warning text-dark';
    if (v === 'QUATORZE' || v === '14') return 'bg-warning'; // Laranja visualmente se tiver CSS, senão Amarelo
    if (v === 'DEZESSEIS' || v === '16') return 'bg-danger';
    if (v === 'DEZOITO' || v === '18') return 'bg-black border border-light'; // Preto com borda branca

    return 'bg-secondary';
  };

  // --- HELPER TRAILER ---
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  const handleAssistirTrailer = (urlOriginal) => {
    const embed = getEmbedUrl(urlOriginal);
    if (embed) setTrailerUrl(embed);
    else alert("Trailer indisponível.");
  };

  const limparTrailer = () => setTrailerUrl(null);

  const abrirDetalhes = (filme) => {
    setFilmeSelecionado(filme);
    setTimeout(() => {
        const modalElement = document.getElementById('modalDetalhesCliente');
        if (modalElement) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
        }
    }, 100);
  };

  return (
    <>
      <Header />
      
      <main className="container mt-5 mb-5" style={{ minHeight: '60vh' }}>
        <h2 className="text-white mb-4 border-start border-4 border-danger ps-3 font-recursive">
            Em Cartaz
        </h2>

        {loading ? (
           <div className="d-flex justify-content-center align-items-center py-5">
               <div className="spinner-border text-danger me-2" role="status"></div>
               <span className="text-white">Carregando catálogo...</span>
           </div>
        ) : (
          <div className="row justify-content-center g-4">
            
            {filmes.map((filme) => (
              <CardFilm
                key={filme.id}
                image={filme.imagemUrl} 
                title={filme.titulo}
                description={filme.descricao}
                className="bg-dark text-white border-secondary shadow-lg"
              >
                {/* 1. Badges acima dos botões */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-secondary bg-opacity-50 text-uppercase" style={{fontSize: '0.7rem'}}>
                        {filme.genero || 'Geral'}
                    </span>
                    <span className={`badge ${getClassificacaoCor(filme.classificacao)}`} style={{width: '30px'}}>
                        {formatarClassificacao(filme.classificacao)}
                    </span>
                </div>

                {/* 2. Botões de Ação */}
                <div className="d-grid gap-2">
                    {/* Botão Principal: COMPRAR */}
                    <Link to="/ingressos" className="btn btn-danger fw-bold shadow-sm">
                        <i className="bi bi-ticket-perforated me-2"></i>
                        Comprar Ingressos
                    </Link>

                    {/* Botão Secundário: DETALHES (Agora visível: Outline Light) */}
                    <button 
                        className="btn btn-outline-light btn-sm border-opacity-25 text-opacity-75"
                        style={{ borderStyle: 'dashed' }} 
                        onClick={() => abrirDetalhes(filme)}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Ver trailer e sinopse
                    </button>
                </div>
              </CardFilm>
            ))}

            {!loading && filmes.length === 0 && (
                <div className="col-12 text-center text-secondary py-5">
                    <i className="bi bi-film fs-1 d-block mb-3"></i>
                    <h4>Nenhum filme em cartaz no momento.</h4>
                    <p>Volte em breve para novas estreias!</p>
                </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL DE DETALHES --- */}
      <div className="modal fade" id="modalDetalhesCliente" tabIndex="-1" aria-hidden="true">
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
                                        <span className="badge bg-secondary text-uppercase">{filmeSelecionado.genero}</span>
                                        <span className="badge bg-dark border border-secondary text-light">
                                            <i className="bi bi-clock me-1"></i>{filmeSelecionado.duracao} min
                                        </span>
                                    </div>

                                    <h6 className="text-secondary fw-bold small">SINOPSE</h6>
                                    <p className="text-light">{filmeSelecionado.descricao}</p>
                                    
                                    {filmeSelecionado.trailerYoutube && (
                                        <button 
                                            className="btn btn-outline-light w-100 mt-3"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#modalTrailerCliente"
                                            onClick={() => handleAssistirTrailer(filmeSelecionado.trailerYoutube)}
                                        >
                                            <i className="bi bi-play-circle me-2"></i>Assistir Trailer
                                        </button>
                                    )}

                                    <Link to="/ingressos" className="btn btn-danger w-100 mt-2">
                                        Garantir meu lugar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>

      {/* --- MODAL TRAILER --- */}
      <div 
        className="modal fade" 
        id="modalTrailerCliente" 
        tabIndex="-1" 
        aria-hidden="true" 
        onClick={(e) => { if(e.target.id === 'modalTrailerCliente') limparTrailer() }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-black border-secondary">
                <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title text-white">Trailer</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={limparTrailer}></button>
                </div>
                <div className="modal-body p-0">
                    <div className="ratio ratio-16x9">
                        {trailerUrl && (
                            <iframe 
                                src={trailerUrl} 
                                title="Trailer" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;