# Envio das respostas

O painel é outro projeto: `../painel-admin-geleias`.

Siga o README desse projeto para criar as tabelas e autorizar a conta do administrador. Depois copie `.env.example` para `.env.local` neste quiz e preencha a chave **publishable** ou **anon** do Supabase. Nunca use `service_role` ou uma chave `secret`. Reinicie o servidor após preencher as variáveis.

A integração salva a abertura, cada resposta e a chegada à tela do vídeo; também mantém respostas parciais. Não altera perguntas ou oferta. O quiz inclui a URL e a chave pública deste projeto como configuração padrão, inclusive quando a hospedagem não fornece variáveis Vite. As variáveis opcionais podem substituir esses valores. A leitura dos dados permanece protegida pelas regras do banco. Dados anteriores à ativação não podem ser recuperados.

O painel é executado separadamente na porta 5174; este quiz continua na porta 5173. Não existe rota administrativa neste projeto.

## Antes de publicar esta atualização

Execute `../painel-admin-geleias/supabase/migrations/20261002_quiz_intro.sql` no SQL Editor do Supabase. A versão atual pergunta experiência e idade antes das seis perguntas originais e usa `save_quiz_progress_v2`. Publicar antes de executar essa migration impede a sincronização das novas tentativas até que a função seja criada.
