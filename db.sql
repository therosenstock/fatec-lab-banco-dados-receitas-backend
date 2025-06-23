create database bd_recipes;

use bd_recipes;

CREATE TABLE receita (
	id_receita int primary key not null auto_increment,
    titulo varchar(50) not null,
    tempo_preparo varchar(5),
    categoria varchar(30)
);

CREATE TABLE ingredientes(
	id_ingrediente int primary key not null auto_increment,
    id_receita int not null,
	medida varchar(10),
    quantidade varchar(10),
    descricao varchar(50)
);

CREATE TABLE instrucoes(
	id_instrucoes int primary key not null auto_increment,
    posicao int,
    descricao varchar(200),
    id_receita int not null
);

ALTER TABLE ingredientes ADD CONSTRAINT fk_receita FOREIGN KEY (id_receita) references receita(id_receita);

ALTER TABLE instrucoes ADD CONSTRAINT fk_receita_instrucoes FOREIGN KEY (id_receita) references receita(id_receita);

DELIMITER $$

CREATE PROCEDURE apagar_receita(IN p_id_receita INT)
BEGIN
    DELETE FROM ingredientes WHERE id_receita = p_id_receita;
    DELETE FROM instrucoes WHERE id_receita = p_id_receita;
    DELETE FROM receita WHERE id_receita = p_id_receita;
END $$

DELIMITER ;



-- Inserção de receitas
INSERT INTO receita (id_receita, titulo, tempo_preparo, categoria) VALUES
(1, 'Bolo de Cenoura', '00:50', 'Bolos'),
(2, 'Panqueca de Frango', '00:30', 'Massas'),
(3, 'Arroz à Grega', '00:25', 'Acompanhamento');

-- Inserção de ingredientes
INSERT INTO ingredientes (id_ingrediente, id_receita, medida, quantidade, descricao) VALUES
-- Bolo de Cenoura
(1, 1, 'unidade', '2', 'Cenoura'),
(2, 1, 'unidade', '3', 'Ovo'),
(3, 1, 'xícara', '2', 'Farinha de trigo'),
(4, 1, 'xícara', '1.5', 'Açúcar'),
(5, 1, 'xícara', '0.5', 'Óleo'),

-- Panqueca de Frango
(6, 2, 'unidade', '2', 'Ovo'),
(7, 2, 'xícara', '1', 'Farinha de trigo'),
(8, 2, 'xícara', '1', 'Leite'),
(9, 2, 'xícara', '1', 'Frango desfiado'),
(10, 2, 'colher', '1', 'Sal'),

-- Arroz à Grega
(11, 3, 'xícara', '2', 'Arroz cozido'),
(12, 3, 'colher', '2', 'Óleo'),
(13, 3, 'xícara', '0.5', 'Cenoura ralada'),
(14, 3, 'xícara', '0.5', 'Ervilha'),
(15, 3, 'xícara', '0.5', 'Milho');

-- Inserção de instruções
INSERT INTO instrucoes (id_instrucoes, posicao, descricao, id_receita) VALUES
-- Bolo de Cenoura
(1, 1, 'Bata no liquidificador a cenoura, ovos e óleo até virar um creme.', 1),
(2, 2, 'Adicione o açúcar e bata mais um pouco.', 1),
(3, 3, 'Misture a farinha e leve ao forno por 40 minutos.', 1),

-- Panqueca de Frango
(4, 1, 'Misture os ingredientes da massa até ficar homogênea.', 2),
(5, 2, 'Despeje porções da massa na frigideira para formar as panquecas.', 2),
(6, 3, 'Recheie com o frango, enrole e sirva.', 2),

-- Arroz à Grega
(7, 1, 'Refogue a cenoura no óleo por 2 minutos.', 3),
(8, 2, 'Adicione o arroz, ervilha e milho e misture bem.', 3),
(9, 3, 'Aqueça por mais alguns minutos e sirva.', 3);
