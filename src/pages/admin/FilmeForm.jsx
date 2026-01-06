import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const FilmeForm = () => {
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8080/filmes';

    // 1. Estados visuais para Duração (UX amigável)
    const [horas, setHoras] = useState(0);
    const [minutos, setMinutos] = useState(0);

    // 2. Estado do Objeto Filme (DTO)
    const [filme, setFilme] = useState({
        titulo: '',
        descricao: '',
        preco: '',
        trailerYoutube: '',
        genero: '',         // NOVO: Campo obrigatório
        classificacao: '',  // NOVO: Campo obrigatório
        ativo: true,
        meiaEntrada: false
    });

    // Estados de Arquivo e Controle
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // Atualiza campos de texto, selects e checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilme({
            ...filme,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Atualiza o arquivo de imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // ENVIO DO FORMULÁRIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        const totalMinutos = (parseInt(horas || 0) * 60) + parseInt(minutos || 0);
        if (totalMinutos <= 0) {
            setErro("A duração do filme deve ser maior que zero.");
            setLoading(false);
            return;
        }

        if (!filme.genero || !filme.classificacao) {
            setErro("Por favor, selecione o Gênero e a Classificação.");
            setLoading(false);
            return;
        }


        try {
            const dadosParaEnviar = {
                ...filme,
                duracao: totalMinutos // O Java recebe um Integer
            };

            const formData = new FormData();
            
            // 1. Anexa o JSON como string
            formData.append('filme', JSON.stringify(dadosParaEnviar));
            
            // 2. Anexa a Imagem
            if (imagem) {
                formData.append('imagem', imagem);
            }

            // DEBUG: Mostra no console o que está indo (ajuda muito!)
            console.log("Enviando Token:", localStorage.getItem("token"));
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]); 
            }

            // 3. Envia usando o API (AXIOS) em vez do FETCH
            // O 'api' já vai injetar o Bearer Token automaticamente!
            await api.post("/filmes/save", formData, {
                headers: {
                    // O TRUQUE MÁGICO:
                    // Forçamos "undefined" para anular qualquer configuração global de JSON.
                    // Isso deixa o navegador definir: "multipart/form-data; boundary=----WebKitFormBoundary..."
                    "Content-Type": undefined 
                }
            });

            alert('Filme cadastrado com sucesso!');
            navigate('/admin/filmes');

        } catch (error) {
            console.error("Erro no envio:", error);
            // Se for 403, o problema é Permissão/Token.
            // Se for 400/415, o problema é esse formato do JSON acima.
            if (error.response) {
                setErro(`Erro ${error.response.status}: ${error.response.data?.message || 'Falha ao salvar'}`);
            } else {
                setErro("Erro de conexão.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid text-white py-4">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card bg-dark border-secondary shadow-lg">
                        <div className="card-header border-secondary bg-black bg-opacity-25 py-3">
                            <h3 className="mb-0 text-warning fw-bold">
                                <i className="bi bi-film me-2"></i>Novo Filme
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            
                            {erro && <div className="alert alert-danger d-flex align-items-center"><i className="bi bi-exclamation-triangle-fill me-2"></i>{erro}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* LINHA 1: Título e Duração */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-8">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Título</label>
                                        <input 
                                            type="text" name="titulo" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            value={filme.titulo} onChange={handleChange} required 
                                        />
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Duração</label>
                                        <div className="input-group">
                                            <input 
                                                type="number" className="form-control bg-dark text-white border-secondary" 
                                                placeholder="0" min="0" value={horas} onChange={(e) => setHoras(e.target.value)}
                                            />
                                            <span className="input-group-text bg-secondary border-secondary text-white">h</span>
                                            <input 
                                                type="number" className="form-control bg-dark text-white border-secondary" 
                                                placeholder="0" min="0" max="59" value={minutos} onChange={(e) => setMinutos(e.target.value)}
                                            />
                                            <span className="input-group-text bg-secondary border-secondary text-white">min</span>
                                        </div>
                                    </div>
                                </div>

                                {/* LINHA 2 (NOVA): Gênero e Classificação */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Gênero</label>
                                        <select 
                                            name="genero" 
                                            className="form-select bg-dark text-white border-secondary"
                                            value={filme.genero} onChange={handleChange} required
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="ACAO">Ação</option>
                                            <option value="COMEDIA">Comédia</option>
                                            <option value="DRAMA">Drama</option>
                                            <option value="TERROR">Terror</option>
                                            <option value="FICCAO">Ficção Científica</option>
                                            <option value="ANIMACAO">Animação</option>
                                            <option value="ROMANCE">Romance</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Classificação Indicativa</label>
                                        <select 
                                            name="classificacao" 
                                            className="form-select bg-dark text-white border-secondary"
                                            value={filme.classificacao} onChange={handleChange} required
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="LIVRE">Livre (L)</option>
                                            <option value="DEZ">10 Anos</option>
                                            <option value="DOZE">12 Anos</option>
                                            <option value="QUATORZE">14 Anos</option>
                                            <option value="DEZESSEIS">16 Anos</option>
                                            <option value="DEZOITO">18 Anos</option>
                                        </select>
                                    </div>
                                </div>

                                {/* LINHA 3: Descrição */}
                                <div className="mb-3">
                                    <label className="form-label text-secondary small text-uppercase fw-bold">Sinopse</label>
                                    <textarea 
                                        name="descricao" className="form-control bg-dark text-white border-secondary" 
                                        rows="3" value={filme.descricao} onChange={handleChange}
                                    ></textarea>
                                </div>

                                {/* LINHA 4: Preço e Trailer */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Preço Base (R$)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-secondary">R$</span>
                                            <input 
                                                type="number" step="0.01" name="preco" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                value={filme.preco} onChange={handleChange} required 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Trailer (URL YouTube)</label>
                                        <input 
                                            type="url" name="trailerYoutube" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            placeholder="https://youtube.com/..." 
                                            value={filme.trailerYoutube} onChange={handleChange} 
                                        />
                                    </div>
                                </div>

                                {/* LINHA 5: Imagem */}
                                <div className="mb-4 p-3 border border-secondary rounded bg-black bg-opacity-25">
                                    <label className="form-label text-secondary small text-uppercase fw-bold d-block">Capa do Filme</label>
                                    <div className="d-flex gap-3 align-items-center">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="rounded border border-secondary" style={{width: '80px', height: '120px', objectFit: 'cover'}} />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center rounded border border-secondary text-secondary bg-dark" style={{width: '80px', height: '120px'}}>
                                                <i className="bi bi-camera fs-2"></i>
                                            </div>
                                        )}
                                        <div className="flex-grow-1">
                                            <input 
                                                type="file" className="form-control bg-dark text-white border-secondary" 
                                                accept="image/*" onChange={handleImageChange} required={!imagem}
                                            />
                                            <div className="form-text text-muted small mt-1">Recomendado: 300x450px (Formato JPG/PNG).</div>
                                        </div>
                                    </div>
                                </div>

                                {/* LINHA 6: Switches */}
                                <div className="row mb-4 px-2">
                                    <div className="col-md-6 d-flex align-items-center mb-2 mb-md-0">
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" type="checkbox" 
                                                name="meiaEntrada" checked={filme.meiaEntrada} onChange={handleChange} 
                                            />
                                            <label className="form-check-label text-white ms-2">Aceita Meia-Entrada</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center">
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input bg-success border-success" type="checkbox" 
                                                name="ativo" checked={filme.ativo} onChange={handleChange} 
                                            />
                                            <label className="form-check-label text-white fw-bold ms-2">Filme Ativo no Catálogo</label>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTÕES */}
                                <div className="d-flex justify-content-end gap-2 border-top border-secondary pt-3">
                                    <Link to="/admin/filmes" className="btn btn-outline-light px-4">Cancelar</Link>
                                    <button type="submit" className="btn btn-warning px-5 fw-bold text-dark d-flex align-items-center gap-2" disabled={loading}>
                                        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                        {loading ? 'Enviando...' : 'Salvar Filme'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmeForm;