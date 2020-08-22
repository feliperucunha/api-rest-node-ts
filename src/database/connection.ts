import knex from 'knex';
//o path universaliza os caminhos locais
import path from 'path';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});

export default db;

//Migration do knex = 