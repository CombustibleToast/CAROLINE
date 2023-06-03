
module.exports = {
    name: "destroyLoudspeaker",
    /**
     * This function should:
     * If there is no loudspeaker assigned to the VC, ignore the command
     * Disconnect the loudspeaker from the VC
     * Clear/delete the queue (not decided on the specification yet)
     * Clear the connection status
     */
    async execute(loudspeakerClient) {
        //notify the autoplayer to not play the next song because the player is about to be deleted.
        loudspeakerClient.player.markedForDestroy = true;
        //destroy player -> stop playback and avoid memory leaks
        //https://discordjs.guide/voice/audio-player.html#deletion
        loudspeakerClient.player.stop();
        loudspeakerClient.player = undefined;
        //destroying this is actually good because the player is created at connection time

        //destroy connection -> disconnect
        loudspeakerClient.connection.destroy();
        loudspeakerClient.connection = undefined;

        //destroy queue
        loudspeakerClient.queue.length = 0;
        loudspeakerClient.queue = undefined;
    }
}