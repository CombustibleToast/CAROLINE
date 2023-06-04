
module.exports = {
	name: "assignLoudspeaker",
	async execute(voiceChannelId, loudspeakerMap) {
		/**
		 * This function should:
		 * Find out whether the user's vc needs a loudspeaker assigned to it. Return {status: "already assigned", loudspeakerid: loudspeakerid}
		 * If it does, search the client.loudspeakers collection and find one that is unassigned.
		 * If there are no vacancies, return {status: "no vacancies"}
		 * Return {status: "new assignment", loudspeakerid}
		 */

		//search for both a vacant loudspeaker and a loudspeaker that is already occupying the user's vc
		let vacantLoudspeakerList = [];
		let vacantLoudspeakerClient;
		let channelHasLoudspeakerAlready = false;
		loudspeakerMap.each(loudspeakerClient => {
			if (!loudspeakerClient.connection)
				vacantLoudspeakerList.push(loudspeakerClient);
			//vacantLoudspeakerClient = loudspeakerClient;
			else if (loudspeakerClient.connection.joinConfig.channelId == voiceChannelId) {
				channelHasLoudspeakerAlready = true;
				vacantLoudspeakerClient = loudspeakerClient;
				return;
			}
		});

		if (channelHasLoudspeakerAlready)
			return { status: "already assigned", loudspeakerId: vacantLoudspeakerClient.user.id };

		if (vacantLoudspeakerList.length == 0)
			return { status: "no vacancies" };

		vacantLoudspeakerClient = vacantLoudspeakerList[Math.floor(Math.random() * vacantLoudspeakerList.length)];

		return { status: "new assignment", loudspeakerId: vacantLoudspeakerClient.user.id };
	}
}

