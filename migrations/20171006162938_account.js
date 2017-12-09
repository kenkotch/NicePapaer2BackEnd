exports.up = (knex, Promise) => {
  return knex.schema.createTable('account', (table) => {
    table.increments()

    table.varchar('username', 63)
      .notNullable()
      .defaultTo('')
      .unique()

    table.specificType('hashed_password', 'CHAR(60)')
      .notNullable()

    table.varchar('email', 63)
      .notNullable()
      .defaultTo('')
      .unique()

    table.varchar('first_name_1', 63)
      .defaultTo('')

    table.varchar('last_name_1', 63)
      .defaultTo('')

    table.varchar('first_name_2', 63)
      .notNullable()
      .defaultTo('')

    table.varchar('last_name_2', 63)
      .notNullable()
      .defaultTo('')

    table.date('wedding_date')
      // .defaultTo(null)

    table.integer('account_id')
      .references('id')
      .inTable('account')
      .onDelete('CASCADE')

    table.integer('role')
      .notNullable()

    table.integer('template_id')
      .references('id')
      .inTable('template')
      .onDelete('CASCADE')
      .notNullable()
      .defaultTo(1)

    table.timestamps(true, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('account')
}
