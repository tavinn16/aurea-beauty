CREATE TABLE usuario (
	id int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(100),
    email_user varchar(255),
    idade int,
    data_nascimento date,
    telefone int,
    password_user varchar(255),
    endereco_user varchar(355)
)