import { useState, useEffect } from 'react';

export const useAdminUsuarios = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [gestores, setGestores] = useState([]);
    const [loading, setLoading] = useState(true); // Loading da lista
    
    // NOVOS ESTADOS PARA O FORMULÁRIO
    const [submitting, setSubmitting] = useState(false); // Loading do botão salvar
    const [feedback, setFeedback] = useState({ type: '', msg: '' }); // Mensagem (sucesso/erro)

    const [novoGestor, setNovoGestor] = useState({
        cpf: '',
        email: '',
        senha: ''
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // --- BUSCAR GESTORES ---
    const carregarGestores = () => {
        // setLoading(true); // Opcional: se quiser spinner na lista toda vez que atualizar
        fetch('http://localhost:8080/usuarios/gestores', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(!res.ok) throw new Error("Erro ao buscar gestores");
            return res.json();
        })
        .then(data => {
            setGestores(data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        carregarGestores();
    }, []);

    // --- CRIAR GESTOR (COM FEEDBACK VISUAL) ---
    const handleCriarGestor = (e) => {
        e.preventDefault();
        setSubmitting(true); // Ativa spinner do botão
        setFeedback({ type: '', msg: '' }); // Limpa msgs anteriores
        
        // Limpeza básica do CPF (opcional)
        const payload = {
            ...novoGestor,
            cpf: novoGestor.cpf.replace(/\D/g, '') // Envia apenas números
        };

        fetch('http://localhost:8080/auth/register-gestor', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if (res.ok) {
                // SUCESSO: Mostra mensagem verde
                setFeedback({ type: 'success', msg: 'Gestor criado com sucesso! Fechando...' });
                
                // Espera 1.5 segundos para o usuário ler, depois fecha
                setTimeout(() => {
                    // Fecha o modal
                    const closeBtn = document.getElementById('btn-close-modal');
                    if(closeBtn) closeBtn.click();
                    
                    // Reseta tudo
                    setNovoGestor({ cpf: '', email: '', senha: '' }); 
                    setFeedback({ type: '', msg: '' });
                    carregarGestores(); // Atualiza a lista
                    setSubmitting(false);
                }, 1500);

            } else {
                // ERRO: Mostra mensagem vermelha e libera o botão
                const erro = await res.text();
                setFeedback({ type: 'error', msg: `Erro: ${erro}` });
                setSubmitting(false);
            }
        })
        .catch(() => {
            setFeedback({ type: 'error', msg: 'Erro de conexão com o servidor.' });
            setSubmitting(false);
        });
    };

    // --- ALTERAR STATUS ---
    const toggleStatus = (id) => {
        if(!window.confirm("Deseja alterar o status deste usuário?")) return;

        // Opcional: Você pode criar um loading específico para cada card se quiser muito detalhe
        // mas aqui vamos manter simples.
        fetch(`http://localhost:8080/usuarios/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if(res.ok) {
                carregarGestores(); 
            } else {
                alert("Erro ao alterar status");
            }
        });
    };

    return {
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        gestores,
        loading,
        novoGestor,
        setNovoGestor,
        handleCriarGestor,
        toggleStatus,
        // Exportando os novos estados
        submitting,
        feedback
    };
};