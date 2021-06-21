import Sequelize from 'sequelize';
import dbConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Tag from '../app/models/Tag';
import Comment from '../app/models/Comment';

const models = [User, File, Tag, Comment];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(dbConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
