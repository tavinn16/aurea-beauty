CREATE TABLE usuario (
	id int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(100),
    email_user varchar(255),
    idade int,
    data_nascimento date,
    telefone int,
    password_user varchar(255),
    endereco_user varchar(355)
),

CREATE TABLE dados_cabelo_personalizao (
    id int PRIMARY KEY AUTO_INCREMENT,
    curvatura_cabelo enum('liso', 'ondulado', 'cacheado', 'crespo', 'não sei dizer'),
    /*ver melhor essa opção para ter uma condição que verifica qual o tipo de cablo o usuário se identifica através da imagem, caso ele não
    saiba dizer qual é o seu tipo de cabelo*/
    imagem_tipo_cabelo enum('imagem1', 'imagem2', 'imagem3', 'imagem4', 'imagem5', 'imagem6', 'imagem7', 'imagem8'),
    objetivo_cabelo varchar(500),
    comprimento_cabelo varchar(100),
    virgindade_cabelo enum('sim', 'não'),
    tipo_de_quimica varchar(255),
    textura_cabelo varchar(100), /*ver sobre o tipo de dado disso aqui*/
    cortes_preferencia varchar(100), /*opcional*/
    porosidade enum('baixa', 'media', 'alta', 'nenhuma'),
    elasticidade enum('baixa', 'normal', 'alta'),
    saude_aparente varchar(255),
    fotos_cabelo varchar(255), /*opcional*/
    video_cabelo varchar(255), /*opcional*/
    comentario_adicional varchar(900),
    usuario_id int,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
),

CREATE TABLE preferencias_marcas (
    id int PRIMARY KEY AUTO_INCREMENT,
    marcas_preferidas varchar(255),
    motivo_preferencia varchar(500),
    usuario_id int,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
),

CREATE TABLE conversas_ia (
    id int PRIMARY KEY AUTO_INCREMENT,
    pergunta_usuario TEXT,
    resposta_ia TEXT,
    data_conversa datetime,
    usuario_id int,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);