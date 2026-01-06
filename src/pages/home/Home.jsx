import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardFilm from "../../components/cardFilm";

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MUDANÇA: Chamando diretamente a rota que traz só os ativos
    fetch('http://localhost:8080/filmes/ativos')
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao buscar filmes ativos');
          }
          return response.json();
      })
      .then(data => {
        // Como o Java já filtrou, jogamos os dados direto no estado
        setFilmes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao carregar catálogo:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      
      <main className="container mt-5 mb-5" style={{ minHeight: '60vh' }}>
        <h2 className="text-white mb-4 border-start border-4 border-danger ps-3">
            Em Cartaz
        </h2>

        {loading ? (
           <div className="d-flex justify-content-center align-items-center py-5">
               <div className="spinner-border text-danger me-2" role="status"></div>
               <span className="text-white">Carregando catálogo...</span>
           </div>
        ) : (
          <div className="row justify-content-center g-4">
            
            {/* RENDERIZAÇÃO DINÂMICA */}
            {filmes.map((filme) => (
              <CardFilm
                key={filme.id}
                image={filme.imagemUrl} 
                title={filme.titulo}
                description={filme.descricao}
                // Sem 'children' -> Renderiza botão "Comprar Ingressos"
              />
            ))}

            {/* Tratamento para lista vazia */}
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

      <Footer />
    </>
  );
}

export default Home;