import Knex from 'knex';

//cria tabela e altera campos
//migration api (documentação)
export async function up(knex: Knex) {
    return knex.schema.createTable('class_schedule', table => {
        table.increments('id').primary();

        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();

        //Interliga as aulas ao professor
        table.integer('class_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}

//desfaz as cagadas
export async function down(knex: Knex) {
    return knex.schema.dropTable('class_schedule');
}