const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function nuevoUsuario(email, nombre, password) {
    const client = await pool.connect();
    const result = await client.query(`INSERT INTO usuarios (email, nombre, password, auth) values ('${email}', '${nombre}', '${password}', false) RETURNING *;`);
    const results = result.rows[0];
    client.release();
    return results;
}

async function getUsuarios() {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM usuarios;`);
    const results = result.rows;
    client.release();
    return results;
}

async function setUsuarioStatus(id, auth) {
    const client = await pool.connect();
    const result = await client.query(`UPDATE usuarios SET auth = ${auth} WHERE id = ${id} RETURNING *;`);
    const results = result.rows[0];
    client.release();
    return results;
}

async function getUsuario(email, password) {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}';`);
    const results = result.rows[0];
    client.release();
    return results;
}

module.exports = { nuevoUsuario, getUsuarios, setUsuarioStatus, getUsuario };
