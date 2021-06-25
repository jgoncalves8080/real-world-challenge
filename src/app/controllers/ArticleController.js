import * as Yup from 'yup';
import User from '../models/User';
import Tag from '../models/Tag';
import Article from '../models/Article';

class ArticleController {
  async index(req, res) {
    const { author, tag, page = 1, limit = 20 } = req.query;
    let articles;
    articles = await Article.findAll({
      attributes: [
        'slug',
        'title',
        'description',
        'body',
        'favorited',
        'favoritesCount',
      ],
      limit,
      offset: (page - 1) * 20,
      include: [
        {
          model: Tag,
          as: 'tagList',
          attributes: ['title'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'author',
          attributes: ['username', 'bio', 'image', 'following'],
        },
      ],
    });
    let data;
    if (author) {
      data = articles.filter((item) => item?.author?.username === author);
      return res.json({ data, articlesCount: data.length });
    }

    if (tag) {
      // data = articles?.tagList?.filter((item) => item?.title === tag);

      const test = articles.filter((article) => {
        return article.tagList.includes({ title: tag });
      });

      console.log('test=>', test);
      return res.json({ test, articlesCount: test.length });
    }

    return res.json({ articles, articlesCount: articles.length });
  }

  async store(req, res) {
    const { authorId } = req.params;
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      body: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body.article)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const userExists = await User.findByPk(authorId);

    if (!userExists) {
      return res
        .status(400)
        .json({ errors: { body: ['User does not existis'] } });
    }

    const article = await Article.create({ ...req.body.article, authorId });
    return res.json(article);
  }
}

export default new ArticleController();
