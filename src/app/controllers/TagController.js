import * as Yup from 'yup';
import Tag from '../models/Tag';

class TagController {
  async index(req, res) {
    const allTags = await Tag.findAll({
      attributes: ['title'],
      raw: true,
    }).then((tags) => tags.map((tag) => tag?.title));
    res.json({ tags: allTags });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
    });

    if (!(await schema.isValid(req?.body)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const { id, title } = await Tag.create(req?.body);
    return res.json({ id, title });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
    });

    if (!(await schema.isValid(req?.body)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    await Tag.update(req?.body);

    const { id, Tagname, following, image, avatar, bio } = await Tag.findByPk(
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

    return res.json({ id, Tagname, bio, image, following, email, avatar });
  }
}

export default new TagController();
