
module.exports = {
  name: "assignLoudspeaker",
  async execute(voiceChannelId, loudspeakerList) {
    /**
     * This function should:
     * Find out whether the user's vc needs a loudspeaker assigned to it. Return {status: "already assigned", loudspeakerid: loudspeakerid}
     * If it does, search the client.loudspeakers collection and find one that is unassigned.
     * If there are no vacancies, return {status: "no vacancies"}
     * Return {status: "ok", loudspeakerid}
     */

    //search for both a vacant loudspeaker and a loudspeaker that is already occupying the user's vc
    let vacantLoudspeakerClient;
    let channelHasLoudspeakerAlready = false;
    loudspeakerList.each(loudspeakerClient => {
      if (!loudspeakerClient.connection)
        vacantLoudspeakerClient = loudspeakerClient;
      else if (loudspeakerClient.connection.joinConfig.channelId == voiceChannelId) {
        channelHasLoudspeakerAlready = true;
        vacantLoudspeakerClient = loudspeakerClient;
        return;
      }
    });

    if (channelHasLoudspeakerAlready)
      return { status: "already assigned", loudspeakerId: vacantLoudspeakerClient.user.id };

    if (!vacantLoudspeakerClient)
      return { status: "no vacancies" };

    return { status: "new assignment", loudspeakerId: vacantLoudspeakerClient.user.id };
  }
}

