import express from 'express';
import prisma from '../db/prisma';
import {CreateRecipeDto, UpdateRecipeDto} from '../dto';

const router = express.Router();


router.get('/', async (req, res) => {
  const { search } = req.query

  /*
  * 1 - Busca receitas pelo título
  * SELECT * FROM receita r
  * LEFT JOIN ingredientes ing ON r.id_receita = ing.id_receita
  * LEFT JOIN instrucoes ins ON r.id_receita = ins.id_receita
  * WHERE r.titulo like '%search%'
  * */
  const recipes = await prisma.receita.findMany({
    where: { ...(search ? { titulo: { contains: search as string } } : {}) },
    include: {
      instrucoes: true,
      ingredientes: true
    }
  });

  res.json(recipes);
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    /*
    * 1 - Busca a receita pelo ID
    * SELECT * FROM receita r
    * LEFT JOIN ingredientes ing ON r.id_receita = ing.id_receita
    * LEFT JOIN instrucoes ins ON r.id_receita = ins.id_receita
    * WHERE r.id_receita = ?
    * */
    const recipe = await prisma.receita.findUnique({
      where: { id_receita: Number(id) },
      include: {
        ingredientes: true,
        instrucoes: true
      }
    });
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.$queryRaw`call apagar_receita(${Number(id)})`;
    res.status(204).send();
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
})

router.post('/', async (req, res) => {
  console.log('body', req.body);
  const { titulo, tempo_preparo, categoria, ingredientes, instrucoes } = req.body as CreateRecipeDto;

  try {
    /*
    * 1 - Insere a receita
    * INSERT INTO receita (titulo, tempo_preparo, categoria)
    * VALUES (?, ?, ?)
    * RETURNING id_receita
    *
    * 2 - Insere os ingredientes
    * INSERT INTO ingredientes (descricao, quantidade, medida, id_receita)
    * VALUES (?, ?, ?, ?)
    *
    * 3 - Insere as instruções
    * INSERT INTO instrucoes (posicao, descricao, id_receita)
    * VALUES (?, ?, ?)
    * */

    const newRecipe = await prisma.receita.create({
      data: {
        titulo: titulo,
        tempo_preparo,
        categoria,
        ingredientes: {
          create: ingredientes?.map((ingrediente) => ({
            descricao: ingrediente.descricao,
            quantidade: ingrediente.quantidade,
            medida: ingrediente.medida,
          }))
        },
        instrucoes: {
          create: instrucoes?.map((instrucao) => ({
            posicao: instrucao.posicao,
            descricao: instrucao.descricao,
          }))
        }
      },
    });
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create recipe' });
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, tempo_preparo, categoria, ingredientes, instrucoes } = req.body as UpdateRecipeDto;
  try {

    /*
    * 1 - Atualizar a receita
    * UPDATE receita
    * SET titulo = ?, tempo_preparo = ?, categoria = ?
    * WHERE id_receita = ?
    *
    * 2 - Remove ingrediente existentes
    * DELETE FROM ingredientes WHERE id_receita = ?
    *
    * 3 - Insere novos ingredientes
    * INSERT INTO ingredientes (descricao, quantidade, medida, id_receita)
    *
    * 4 - Remove instruções existentes
    * DELETE FROM instrucoes WHERE id_receita = ?
    * 5 - Insere novas instruções
    * INSERT INTO instrucoes (posicao, descricao, id_receita)
    * */

    const updatedRecipe = await prisma.receita.update({
      where: { id_receita: Number(id) },
      data: {
        titulo,
        tempo_preparo,
        categoria,
        ingredientes: {
          deleteMany: {},
          create: ingredientes?.map((ingrediente) => ({
            descricao: ingrediente.descricao,
            quantidade: ingrediente.quantidade,
            medida: ingrediente.medida,
          }))
        },
        instrucoes: {
          deleteMany: {},
          create: instrucoes?.map((instrucao) => ({
            posicao: instrucao.posicao,
            descricao: instrucao.descricao,
          }))
        }
      },
    });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
})

export default router;
