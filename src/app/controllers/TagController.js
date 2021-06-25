import * as Yup from 'yup';
import Tag from '../models/Tag';
import Article from '../models/Article';

class TagController {
  async index(req, res) {
    const allTags = await Tag.findAll({
      attributes: ['title'],
      raw: true,
    }).then((tags) => tags.map((tag) => tag?.title));
    res.json({ tags: allTags });
  }

  async store(req, res) {
    const { articleId } = req.params;
    const { title } = req.body;
    const schema = Yup.object().shape({
      title: Yup.string().required(),
    });

    if (!(await schema.isValid(req?.body)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const article = await Article.findByPk(articleId);

    if (!article)
      return res
        .status(400)
        .json({ errors: { body: ['Article does not exist'] } });

    const [tag] = await Tag.findOrCreate({
      where: { title },
    });

    await article.addTag(tag);

    return res.json(tag);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
    });

    if (!(await schema.isValid(req?.body)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    await Tag.update(req?.body);

    const { id, username, following, image, avatar, bio } = await Tag.findByPk(
      req?.userId,
      {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      }
    );

    return res.json({ id, username, bio, image, following, email, avatar });
  }
}

export default new TagController();
