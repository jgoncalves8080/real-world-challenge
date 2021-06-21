module.exports = {
  dialect: process.env.CONNECTION_DIALECT,
  host: process.env.CONNECTION_HOST,
  username: process.env.CONNECTION_USERNAME,
  password: process.env.CONNECTION_PASSWORD,
  database: process.env.CONNECTION_DATABASE,
  define: {
    timestamps: true,
  },
};
