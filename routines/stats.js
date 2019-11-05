import RoutineStructure from '../structures/routine';

/**
 * Stats routine.
 * 
 * @prop {Function} guilds Guild count
 * @prop {Function} channels Channel count
 * @prop {Function} users User count
 */
class StatsRoutine extends RoutineStructure {
    /**
     * Create stats routine.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client, 1000 * 60 * 60 * 8, { // 8 hours
            runOnIntervalStart: true,
        });

        this.statsUtil = this.client.util.getUtil('stats');
        this.statsRepository = this.client.repository.getRepository('stats');
    }

    /**
     * Function to run on interval.
     * 
     * @returns {undefined}
     */
    run() {
        const stats = {
            guilds: this.statsUtil.getGuilds(),
            channels: this.statsUtil.getChannels(),
            users: this.statsUtil.getUsers(),
        };

        this.statsRepository.insert(stats);

        this.client.log.info(
            `${stats.guilds} Guilds, ${stats.channels} Channels, ${stats.users} Users.`
        );
    }
}

export default StatsRoutine;
