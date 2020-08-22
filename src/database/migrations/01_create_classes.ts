import Knex from 'knex';

//cria tabela e altera campos
//migration api (documentação)
export async function up(knex: Knex) {
    return knex.schema.createTable('classes', table => {
        table.increments('id').primary();
        table.string('subject').notNullable();
        table.string('cost').notNullable();

        //Interliga as aulas ao professor
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
}

//desfaz as cagadas
export async function down(knex: Knex) {
    return knex.schema.dropTable('classes');
}