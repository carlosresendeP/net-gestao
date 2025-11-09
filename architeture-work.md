## passo a passo
1-

Página Pública – Intenção de Participação -ok

Formulário com: nome, email, empresa e porque vc quer participar. -ok

Salva no banco (intencoes). - ok 


## 2- area do admin

Página admin - ok (somente acessar com o password) -ok
    -

header- footer (botão com meus contato e botão de voltar que aparece na cadatro e admin) -ok

cardcontato -ok (home)

rotas: -ok
    1- post para criar o cadastro de interação
    2- get listar interaçoes 
    3 - Patch [id] para atualizar um cadastro e atualizar no banco tambem
    4- rota auth para verificar se a senha que vem do .env é correta 
    5- rota de convite
    6- rota para validar o token
    7- rota para vericar o token
    8- rota de gerar o convite

## 3-Passo 3: Cadastro Completo
Ao aprovar uma intenção: ok

O sistema gera um token único e cria um registro de convite no banco. ok

Esse token é usado para acessar a página /cadastro?token=....  ok

O usuário preenche um formulário mais completo. ok 

O backend valida o token e salva o novo membro. ok

O envio de e-mail é simulado com console.log do link.  ok 

verificar os emails se ja estão no banco de dados ok
implementar login com senha e email no banco e valiadar no frontend  ok

area de menbros apos logado (adcionar senha passoword do usuario no cadastro final) ok
fazer o sistema de indicaçoes  ok



