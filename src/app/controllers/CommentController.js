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
    const { authorId } = req.params;
    const schema = Yup.object().shape({
      body: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body.comment)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    console.log('author=>', { ...req.body.comment, authorId });

    const userExists = await User.findByPk(authorId);

    if (!userExists) {
      return res
        .status(400)
        .json({ errors: { body: ['User does not existis'] } });
    }

    const comments = await Comment.create({ ...req.body.comment, authorId });
    return res.json(comments);
  }
}

export default new CommentController();
