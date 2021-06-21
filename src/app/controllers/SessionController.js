import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body.user)))
      return res.status(400).json({ error: 'Validation fails' });

    const { email, password } = req.body.user;

    const userExist = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!userExist)
      return res
        .status(400)
        .json({ errors: { body: ['User does not exist'] } });

    if (!(await userExist.checkPassword(password)))
      return res
        .status(400)
        .json({ errors: { body: ['User does not match'] } });

    const { id, username, avatar } = userExist;

    return res.json({
      user: {
        id,
        username,
        email,
        avatar,
        token: jwt.sign({ id }, authConfig?.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      },
    });
  }
}

export default new SessionController();
