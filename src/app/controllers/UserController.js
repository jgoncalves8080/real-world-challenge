import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req?.body?.user)))
      return res.status(400).json({ errors: { body: ["'Validation fails'"] } });

    const userExists = await User.findOne({
      where: { email: req.body.user?.email },
    });

    if (userExists)
      return res
        .status(400)
        .json({ errors: { body: ['User already exists'] } });

    const { id, username, email } = await User.create(req?.body?.user);
    return res.json({ id, username, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      username: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    console.log(await schema.isValid(req?.body?.user));

    if (!(await schema.isValid(req?.body?.user)))
      return res.status(400).json({ errors: { body: ['Validation fails'] } });

    const { email, oldPassword } = req?.body?.user;

    const user = await User.findByPk(req?.userId);

    if (email && email !== user?.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists)
        return res
          .status(400)
          .json({ errors: { body: ['User already exists'] } });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res
        .status(401)
        .json({ errors: { body: ['Password does not match'] } });

    console.log('user=>', req?.body?.user);

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

export default new UserController();
