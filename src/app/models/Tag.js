import { Model, DataTypes } from 'sequelize';

class Tag extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Tag;
