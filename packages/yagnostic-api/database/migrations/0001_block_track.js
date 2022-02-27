exports.up = (knex) => {
  return knex.raw(`
    CREATE TABLE graph_block
    (
      "network"     varchar   NOT NULL,
      "block"       bigint    NOT NULL default 0,
      primary key ("network")
    )
  `);
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('graph_block');
};
