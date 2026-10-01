# Envio das respostas

O painel é outro projeto: `../painel-admin-geleias`.

Siga o README desse projeto para criar as tabelas e autorizar a conta do administrador. Depois copie `.env.example` para `.env.local` neste quiz e preencha a chave **publishable** ou **anon** do Supabase. Nunca use `service_role` ou uma chave `secret`. Reinicie o servidor após preencher as variáveis.

A integração salva a abertura, cada resposta e a chegada à tela do vídeo; também mantém respostas parciais. Não altera perguntas ou oferta. Sem a configuração, o quiz funciona normalmente, mas não envia respostas. Dados anteriores à ativação não podem ser recuperados.

O painel é executado separadamente na porta 5174; este quiz continua na porta 5173. Não existe rota administrativa neste projeto.
