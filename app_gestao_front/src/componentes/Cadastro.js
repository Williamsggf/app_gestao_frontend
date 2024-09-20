import React, { useState } from 'react';
import axios from 'axios';
import md5 from 'md5';

function formatCPF(value) {
    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Adiciona pontos e hífen conforme necessário
    if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3})/, '$1.$2');
    }

    return value;
}

function formatCelular(value) {
    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Adiciona pontos e hífen conforme necessário
    if (value.length > 4) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 3) {
        value = value.replace(/^(\d{2})(\d{5})/, '($1) $2');
    }

    return value;
}

function Cadastro() {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCPF] = useState('');
    const [email, setEmail] = useState('');
    const [celular, setCelular] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfir, setPasswordConfir] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário

    const handleCadastro = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== passwordConfir) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        // Exemplo de criptografia de senha com MD5 (não recomendado para produção)
        const hashedPassword = md5(password);

        try {
            const response = await axios.post('https://app-gestao-backend.vercel.app/auth/RTCadastro', {
                nome,
                sobrenome,
                cpf,
                email,
                celular,
                password: hashedPassword
            });

            console.log('Cadastro realizado com sucesso');

            // Extraindo o ID do usuário da resposta
            const { id } = response.data;
            setUserId(id); // Atualiza o estado com o ID do usuário

            // Lógica adicional após o cadastro

        } catch (error) {
            console.error('Erro ao fazer cadastro:', error);
            setError('Erro ao fazer cadastro. Verifique suas informações.');
        } finally {
            setLoading(false);
        }
    };

    const handleCPFChange = (e) => {
        const formattedCPF = formatCPF(e.target.value);
        setCPF(formattedCPF);
    };

    const handleCelularChange = (e) => {
        const formattedCelular = formatCelular(e.target.value);
        setCelular(formattedCelular);
    };

    return (
        <div className='login-form-wrap'>
            <h2>Cadastro</h2>
            <form className='login-form' onSubmit={handleCadastro}>
                <input
                    type='text'
                    name='nome'
                    placeholder='Nome'
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type='text'
                    name='sobrenome'
                    placeholder='Sobrenome'
                    required
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                />
                <input
                    type='text'
                    name='cpf'
                    placeholder='CPF'
                    required
                    value={cpf}
                    onChange={handleCPFChange}
                />
                <input
                    type='email'
                    name='email'
                    placeholder='E-mail'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='text'
                    name='celular'
                    placeholder='Celular'
                    required
                    value={celular}
                    onChange={handleCelularChange}
                />
                <input
                    type='password'
                    name='senha'
                    placeholder='Senha'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type='password'
                    name='confirSenha'
                    placeholder='Confirme a Senha'
                    required
                    value={passwordConfir}
                    onChange={(e) => setPasswordConfir(e.target.value)}
                />
                <button type='submit' className='btn-login' disabled={loading}>
                    {loading ? 'Carregando...' : 'Cadastrar'}
                </button>
                {error && <p className='error'>{error}</p>}
                {userId && <p>ID do usuário: {userId}</p>}
            </form>
        </div>
    );
}

export default Cadastro;
