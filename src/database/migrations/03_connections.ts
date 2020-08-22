import Knex from 'knex';

//cria tabela e altera campos
//migration api (documentação)
export async function up(knex: Knex) {
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();

        //Verifica quem é o usuário
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        //Verifica a entrada dos usuários no sistema
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();        
    })
}

//desfaz as cagadas
export async function down(knex: Knex) {
    return knex.schema.dropTable('connections');
}