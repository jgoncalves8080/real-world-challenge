import * as Yup from 'yup';
import User from '../models/User';
import Comment from '../models/Comment';
import File from '../models/File';

class CommentController {
  async index(req, res) {
    const { commentId } = req.params;
    let comments;
    if (commentId) {
      const commentExist = await Comment.findByPk(commentId);

      if (!commentExist)
        return res.status(400).json({ error: 'Comment not found' });

      comments = await Comment.findByPk(commentId, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['username', 'bio', 'image', 'following'],
          },
        ],
      });
      return res.status(200).json({ comments });
    }
    comments = await Comment.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'bio', 'image', 'following'],
        },
      ],
    });
    return res.json({ comments });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      body: Yup.string().required(),
      authorId: Yup.number().required(),
    });

    if (!(await schema.isValid(req?.body?.comment)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const userExists = await User.findOne({
      where: { id: req.body?.comment?.authorId },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ errors: { body: ['User does not existis'] } });
    }

    const { id, body, authorId } = await Comment.create(req?.body?.comment);
    return res.json({ id, body, authorId });
  }

  async update(req, res) {
    const { authorId } = req.body;
    const schema = Yup.object().shape({
      username: Yup.string(),
      email: Yup.string(),
    });

    if (!(await schema.isValid(req?.body?.comment)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const user = await User.findByPk(authorId);

    await user.update(req?.body?.user);

    const { id, username, following, image, avatar, bio } = await User.findByPk(
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

export default new CommentController();
