import { Model, DataTypes } from 'sequelize';

class Comment extends Model {
  static init(sequelize) {
    super.init(
      {
        body: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  }
}

export default Comment;
