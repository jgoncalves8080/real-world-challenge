import File from '../models/File';

class FileController {
  async index(req, res) {
    const files = await File.findAll({
      attributes: ['id', 'url', 'name', 'path'],
    });

    res.json(files);
  }
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });
    return res.json(file);
  }
}

export default new FileController();
