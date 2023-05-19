// https://github.com/fent/node-ytdl-core#readme
const ytdl = require('ytdl-core');
// https://github.com/TimeForANinja/node-ytsr
const ytsr = require('ytsr');
// https://github.com/TimeForANinja/node-ytpl
const ytpl = require('ytpl')

module.exports = {
	name: "enqueueQuery",

	async execute(query, loudspeakerClient) {
        //append queries to queue
        const videos = await getQuery(query);
		Array.prototype.push.apply(loudspeakerClient.queue, videos);

		return videos;
    }
}

async function getQuery(query) {
	//result should be a list of {songName, songURL} that will later be turned into ytdl streams when playback happens
	const result = [];

	//Function for pushing video objects to the results list
	const pushVideoInfo = async (url) => {
		const videoInfo = await ytdl.getInfo(url);
		result.push({ title: videoInfo.videoDetails.title, url: videoInfo.videoDetails.video_url });
	}

	//Testing for playlist URL
	let playlistID;
	try {
		playlistID = await ytpl.getPlaylistID(query);
	}
	catch (e) {
		playlistID = null;
	}

	//if query is a video link
	if (ytdl.validateURL(query)) {
		console.log("Query was video URL");
		await pushVideoInfo(query);
	}

	//if query is a playlist link
	else if (playlistID) {
		console.log("Query was playlist URL");
		//playlist response https://github.com/timeforaninja/node-ytpl/blob/master/example/example_output.txt
		/*
		await ytpl(playlistID).then(async playlistResponse => {
			playlistResponse.items.forEach(async item => {
				//console.log(`Playlist adding ${item.shortUrl}`);
				await pushVideoInfo(item.shortUrl);
			})
		});
		*/
		//below boomer way adds them 1 at a time and is much slower but ensures they are in order
		const response = await ytpl(playlistID);
		for (item of response.items) {
			await pushVideoInfo(item.shortUrl);
		}
	}

	//query is not a link, seqrch
	else {
		console.log("Query was search query");
		//search response https://github.com/timeforaninja/node-ytsr/blob/master/example/example_search_output.txt
		//get the first video in the results and ytdl it
		await ytsr(query).then(async searchResult => {
			await pushVideoInfo(searchResult.items.filter(item => item.type == 'video')[0].url);
		});
	}

	//result is now a list of {title, url}
	//result.forEach(item => console.log(item));
	return result;
}