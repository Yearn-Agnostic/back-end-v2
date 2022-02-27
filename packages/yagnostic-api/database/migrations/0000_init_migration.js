exports.up = (knex) => {
  return knex.raw(`
    CREATE TABLE proposals
    (
      "id"             bigint         NOT NULL,
      "description"    varchar(2000)  NOT NULL,
      primary key ("id")
    )
  `);
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('proposals');
};
