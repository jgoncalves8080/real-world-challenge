import * as Yup from 'yup';
import User from '../models/User';
import Comment from '../models/Comment';
import Article from '../models/Article';

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
    const { slug } = req.params;
    const { authorId } = req.body.comment;

    const schema = Yup.object().shape({
      body: Yup.string().required(),
      authorId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body.comment)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const authorExists = await User.findByPk(authorId);

    if (!authorExists) {
      return res
        .status(400)
        .json({ errors: { body: ['User does not existis'] } });
    }

    const articleExists = await Article.findOne({
      where: { slug },
    });

    if (!articleExists) {
      return res
        .status(400)
        .json({ errors: { body: ['Article does not existis'] } });
    }

    const comments = await Comment.create({
      ...req.body.comment,
      articleId: articleExists?.id,
      authorId,
    });
    return res.json(comments);
  }
}

export default new CommentController();
