exports.up = (knex, Promise) => {
  return knex.schema.createTable('template', (table) => {
    table.increments()

    table.varchar('template_name', 63)
      .notNullable()
      .defaultTo('')

    table.timestamps(true, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('template')
}
