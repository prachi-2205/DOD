module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "deals_on_demand_db",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: "null",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
