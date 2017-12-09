'use strict'

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/nice_paper_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/nice_paper_test'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
