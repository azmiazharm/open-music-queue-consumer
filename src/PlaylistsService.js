const { Pool } = require('pg');

class PlalistsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getSongInPlaylist(id) {
    try {
      // get from cache
      const result = await this._cacheService.get(`playlist:${id}`);

      return JSON.parse(result);
    } catch (error) {
      // query db if not in cache
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM songs
        LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id
        WHERE playlistsongs.playlist_id = $1
        GROUP BY songs.id;`,
        values: [id],
      };

      const result = await this._pool.query(query);

      // set new cache
      await this._cacheService.set(`playlist:${id}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }
}

module.exports = PlalistsService;
