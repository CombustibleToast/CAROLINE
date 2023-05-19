
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
        //TODO: stop playback

        //destroy connection -> disconnect
        loudspeakerClient.connection.destroy();
        loudspeakerClient.connection = undefined;

        //destroy queue
        loudspeakerClient.queue = undefined;
    }
}