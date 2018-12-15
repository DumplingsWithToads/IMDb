const Command = require('../handlers/commandHandler');

class ShowHandler extends Command {
    constructor(client) {
        super(client, {
            'shortDescription': 'Get information about a TV show.',
            'longDescription': 'Get information about a TV show with an IMDb ID, TMDb ID, or the show\'s name.',
            'usage': '<TV Show Name or ID>',
            'visible': true,
            'restricted': false,
            'weight': 37
        });
    }

    async process(message) {
        // Check for query
        if (!message.arguments[0]) return this.usageMessage(message);

        // Status of command response
        const status = await this.searchingMessage(message);

        // Get movie from API
        const TVShow = await this.api.getTVShow(message.arguments.join(' '));
        if (TVShow.error) return this.embed.error(status, TVShow); // Error

        // Response
        this.embed.edit(status, {
            'url': this.movieUrl(TVShow.imdb_id, TVShow.id),
            'title': TVShow.name,
            'description': TVShow.overview,
            'thumbnail': this.thumbnail(TVShow.poster_path),

            'fields': this.parseEmbedFields([
                { 'name': 'Status', 'value': TVShow.status },
                { 'name': 'Type', 'value': this.type(TVShow.type) },
                { 'name': 'Episode Runtime', 'value': this.epRuntime(TVShow.episode_run_time) },
                { 'name': 'In Production', 'value': this.yesno(TVShow.in_production) },
                { 'name': 'First Air Date', 'value': this.releaseDate(TVShow.first_air_date) },
                { 'name': 'Last Air Date', 'value': this.releaseDate(TVShow.last_air_date) },
                { 'name': 'Genres', 'value': this.genres(TVShow.genres), 'inline': false },
                { 'name': 'Homepage', 'value': this.homepage(TVShow.homepage), 'inline': false },
                { 'name': 'Vote Average', 'value': this.voteAverage(TVShow.vote_average) },
                { 'name': 'Votes', 'value': this.voteCount(TVShow.vote_count) },
                { 'name': 'IMDb ID', 'value': this.IMDbID(TVShow.imdb_id) },
                { 'name': 'TMDb ID', 'value': this.TMDbID(TVShow.id)
            }]),

            'footer': `Not the TV show you wanted? Try searching for it using the ${message.prefix}shows command.`
        });
    }
}

module.exports = ShowHandler;