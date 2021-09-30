class Listener {
  constructor(mailSender, playlistsService) {
    this._mailSender = mailSender;
    this._playlistsService = playlistsService;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());
      console.log(targetEmail);
      const playlist = await this._playlistsService.getSongInPlaylist(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
