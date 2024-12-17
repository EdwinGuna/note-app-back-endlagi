const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistsPayloadSchema,
        PostPlaylistsIdSongPayloadSchema, } = require('./schema');
 
const PlaylistsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistsIdSongPayload: (payload) => {
    const validationResult = PostPlaylistsIdSongPayloadSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = PlaylistsValidator;