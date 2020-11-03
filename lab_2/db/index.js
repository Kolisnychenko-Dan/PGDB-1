const { Pool } = require('pg')

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	database: 'PGDB1',
	password: 'dankoles'
})

module.exports = {
	async query(text, params) {
		const start = Date.now();
		const res = await pool.query(text, params);
		const duration = Date.now() - start;
		console.log('executed query', { text, duration, rows: res.rowCount });
		return res;
	},
	
	closeAll: () => {pool.end()}
}