import { Model, DataTypes } from 'sequelize';

class Article extends Model {
  static init(sequelize) {
    super.init(
      {
        slug: DataTypes.STRING,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        body: DataTypes.STRING,
        favorited: DataTypes.BOOLEAN,
        favoritesCount: DataTypes.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    this.belongsToMany(models.Tag, {
      foreignKey: 'articleId',
      through: 'articleTags',
      as: 'tagList',
    });
  }
}

export default Article;
