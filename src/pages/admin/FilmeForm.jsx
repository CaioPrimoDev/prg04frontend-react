import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Adicionado useParams
import api from '../../api/axiosConfig';

const FilmeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Captura o ID da URL (se existir)
    const isEditMode = !!id; // Transforma em booleano: true se for edição

    // Estados visuais
    const [horas, setHoras] = useState(0);
    const [minutos, setMinutos] = useState(0);

    // Estado do Objeto Filme
    const [filme, setFilme] = useState({
        titulo: '',
        descricao: '',
        preco: '',
        trailerYoutube: '',
        genero: '',          
        classificacao: '',   
        ativo: true,
        meiaEntrada: false
    });

    // Para comparar se o status 'ativo' mudou durante a edição
    const [ativoInicial, setAtivoInicial] = useState(true);

    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null); // Preview da nova imagem ou da atual
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);


    // A função agora é memorizada e só muda se o 'id' mudar
    const carregarFilmeParaEdicao = useCallback(async () => {
        if (!id) return; // Segurança extra

        try {
            setLoading(true);
            const response = await api.get(`/filmes/${id}`);
            const dados = response.data;

            // Converter duração
            const h = Math.floor(dados.duracao / 60);
            const m = dados.duracao % 60;
            setHoras(h);
            setMinutos(m);

            setFilme(dados);
            setAtivoInicial(dados.ativo);

            if (dados.imagemUrl) {
                setPreview(dados.imagemUrl); 
            }
        } catch (error) {
            console.error("Erro ao carregar filme:", error);
            setErro("Erro ao carregar dados do filme para edição.");
        } finally {
            setLoading(false);
        }
    }, [id]); // <--- A dependência da função é o ID

    // --- EFEITO: CARREGAR DADOS NO MODO EDIÇÃO ---
    useEffect(() => {
        if (isEditMode) {
            carregarFilmeParaEdicao();
        }
    }, [isEditMode, carregarFilmeParaEdicao]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilme({
            ...filme,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- LÓGICA DE ENVIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        const totalMinutos = (parseInt(horas || 0) * 60) + parseInt(minutos || 0);
        if (totalMinutos <= 0) {
            setErro("A duração deve ser maior que zero.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            
            // Prepara o objeto.
            // NOTA: No modo Edição, o 'ativo' no JSON pode ser ignorado pelo backend 
            // se a lógica for exclusiva via endpoints, mas enviamos para manter consistência.
            const dadosParaEnviar = {
                ...filme,
                id: isEditMode ? id : null, // Garante que o ID vai se for edição
                duracao: totalMinutos
            };

            formData.append('filme', JSON.stringify(dadosParaEnviar));
            
            if (imagem) {
                formData.append('imagem', imagem);
            }

            // 1. CRIAÇÃO OU ATUALIZAÇÃO DOS DADOS BÁSICOS
            if (isEditMode) {
                // PUT para atualizar dados (Título, Preço, etc)
                await api.put(`/filmes/update/${id}`, formData, {
                    headers: { "Content-Type": undefined }
                });

                // 2. LÓGICA ESPECÍFICA DO STATUS (Só roda na edição)
                // Compara o que o usuário quer agora (filme.ativo) com o que estava (ativoInicial)
                if (filme.ativo !== ativoInicial) {
                    if (filme.ativo === true) {
                        await api.put(`/filmes/activate/${id}`);
                    } else {
                        await api.put(`/filmes/disable/${id}`);
                    }
                }
                alert('Filme atualizado com sucesso!');

            } else {
                // POST normal de criação
                await api.post("/filmes/save", formData, {
                    headers: { "Content-Type": undefined }
                });
                alert('Filme cadastrado com sucesso!');
            }

            navigate('/admin/filmes');

        } catch (error) {
            console.error("Erro no envio:", error);
            if (error.response) {
                setErro(`Erro: ${error.response.data?.message || 'Falha ao salvar'}`);
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
                            {/* TÍTULO DINÂMICO */}
                            <h3 className="mb-0 text-warning fw-bold">
                                <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-film'} me-2`}></i>
                                {isEditMode ? 'Editar Filme' : 'Novo Filme'}
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            
                            {erro && <div className="alert alert-danger d-flex align-items-center"><i className="bi bi-exclamation-triangle-fill me-2"></i>{erro}</div>}

                            <form onSubmit={handleSubmit}>
                                
                                <div className="row g-3 mb-3">
                                    <div className="col-md-8">
                                        <label className="form-label text-secondary small text-uppercase fw-bold">Título</label>
                                        <input 
                                            type="text" name="titulo" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            value={filme.titulo} onChange={handleChange} required 
                                        />
                                    </div>
                                    {/* DURAÇÃO... */}
                                    <div className="col-md-4">
                                        <label className="form-label text-secondary small">Duração</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="0" value={horas} onChange={(e) => setHoras(e.target.value)} />
                                            <span className="input-group-text bg-secondary border-secondary text-white">h</span>
                                            <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="0" value={minutos} onChange={(e) => setMinutos(e.target.value)} />
                                            <span className="input-group-text bg-secondary border-secondary text-white">min</span>
                                        </div>
                                    </div>
                                </div>

                                {/* GENEROS E CLASSIFICACAO (Mantenha igual ao seu código anterior) */}
                                <div className="row g-3 mb-3">
                                     <div className="col-md-6">
                                        <label className="form-label text-secondary small">Gênero</label>
                                        <select name="genero" className="form-select bg-dark text-white border-secondary" value={filme.genero} onChange={handleChange} required>
                                            <option value="">Selecione...</option>
                                            <option value="ACAO">Ação</option>
                                            <option value="COMEDIA">Comédia</option>
                                            <option value="DRAMA">Drama</option>
                                            <option value="FICCAO_CIENTIFICA">Ficção Científica</option>
                                            <option value="TERROR">Terror</option>
                                            <option value="ROMANCE">Romance</option>
                                            <option value="ANIMACAO">Animação</option>
                                            <option value="DOCUMENTARIO">Documentário</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small">Classificação</label>
                                        <select name="classificacao" className="form-select bg-dark text-white border-secondary" value={filme.classificacao} onChange={handleChange} required>
                                            <option value="">Selecione...</option>
                                            <option value="LIVRE">Livre</option>
                                            <option value="DEZ">10 Anos</option>
                                            <option value="DOZE">12 Anos</option>
                                            <option value="QUATORZE">14 Anos</option>
                                            <option value="DEZESSEIS">16 Anos</option>
                                            <option value="DEZOITO">18 Anos</option>
                                        </select>
                                    </div>
                                </div>

                                {/* DESCRICAO, PRECO, TRAILER (Mantenha igual) */}
                                <div className="mb-3">
                                     <label className="form-label text-secondary small">Sinopse</label>
                                     <textarea name="descricao" className="form-control bg-dark text-white border-secondary" rows="3" value={filme.descricao} onChange={handleChange}></textarea>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small">Preço Base</label>
                                        <input type="number" step="0.01" name="preco" className="form-control bg-dark text-white border-secondary" value={filme.preco} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-secondary small">Trailer URL</label>
                                        <input type="url" name="trailerYoutube" className="form-control bg-dark text-white border-secondary" value={filme.trailerYoutube} onChange={handleChange} />
                                    </div>
                                </div>

                                {/* IMAGEM (Com lógica visual de edição) */}
                                <div className="mb-4 p-3 border border-secondary rounded bg-black bg-opacity-25">
                                    <label className="form-label text-secondary small text-uppercase fw-bold d-block">
                                        {isEditMode ? 'Alterar Capa (Opcional)' : 'Capa do Filme'}
                                    </label>
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
                                                accept="image/*" onChange={handleImageChange} 
                                                required={!isEditMode && !imagem} // Só é obrigatório se for NOVO e não tiver imagem
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SWITCHES */}
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
                                            <label className="form-check-label text-white fw-bold ms-2">
                                                {filme.ativo ? "Filme Ativo no Catálogo" : "Filme Oculto (Inativo)"}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTÕES DINÂMICOS */}
                                <div className="d-flex justify-content-end gap-2 border-top border-secondary pt-3">
                                    <Link to="/admin/filmes" className="btn btn-outline-light px-4">Cancelar</Link>
                                    <button type="submit" className="btn btn-warning px-5 fw-bold text-dark d-flex align-items-center gap-2" disabled={loading}>
                                        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                        {loading ? 'Processando...' : (isEditMode ? 'Atualizar Filme' : 'Salvar Filme')}
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