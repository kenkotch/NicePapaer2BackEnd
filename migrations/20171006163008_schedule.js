exports.up = (knex, Promise) => {
  return knex.schema.createTable('schedule', (table) => {
    table.increments()

    table.varchar('time', 5)
      .defaultTo('')

    table.text('item')
      .notNullable()
      .defaultTo('')

    table.text('description')
      .notNullable()
      .defaultTo('')

    table.integer('account_id')
      .references('id')
      .inTable('account')
      .onDelete('CASCADE')
      .notNullable()

    table.timestamps(true, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('schedule')
}
