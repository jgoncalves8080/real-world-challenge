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
  static associate(models) {
    this.belongsToMany(models.Article, {
      foreignKey: 'tagId',
      through: 'articleTags',
      as: 'articles',
    });
  }
}

export default Tag;
