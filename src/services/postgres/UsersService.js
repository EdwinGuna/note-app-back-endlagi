const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0 ) {
            throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
        }
    }

    async verifyUserCredential(username, password) {
        const query = {
            text: "SELECT id, password FROM users WHERE username = $1",
            values: [username],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }
        const { id, password: hashed_Password } = result.rows[0];
        const match = await bcrypt.compare(password, hashed_Password);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah');
        }

        return id;
    }

    async addUser({ username, password, fullname }) {
        await this.verifyNewUsername(username);
        
        const id = `user-${nanoid(16)}`;
        const hashed_Password = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, username, hashed_Password, fullname],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError('User gagal ditambahkan.')
        }

        return result.rows[0].id;
    }

    async getUserById(userId) {
        const query = {
            text: 'SELECT id, username, fullname FROM users WHERE id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        return result.rows[0]
    }
}

module.exports = UsersService;