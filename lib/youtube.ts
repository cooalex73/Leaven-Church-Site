export type YouTubeVideo={
    id: string;
    title: string;
    thumbnailUrl: string;
    publishedAt: string;
}

export async function fetchLatestVideo(maxResults = 5) : Promise<YouTubeVideo[]>{
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId)
    {
        throw new Error("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in env.");
    }

    const YT_API = "https://www.googleapis.com/youtube/v3";

    async function fetchJson(url: string){
        const res = await fetch(url, {next: {revalidate: 60}});
        const text = await res.text();
        if (!res.ok) throw new Error(`YouTube API error ${res.status}: ${text}`);
        return JSON.parse(text);
    }

    const chUrl =
    `${YT_API}/channels?part=contentDetails&id=${encodeURIComponent(channelId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

    const chData = await fetchJson(chUrl);
    const uploadsPlaylistId = chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if(!uploadsPlaylistId) throw new Error(`Failed to resolve uploads playlist ID from channelId`);

    const collected: YouTubeVideo[] = [];
    let pageToken: string | undefined = undefined;

    while (collected.length < maxResults){
        const pageSize = 25;
        const plUrl = `${YT_API}/playlistItems?part=contentDetails`+
        `&playlistId=${encodeURIComponent(uploadsPlaylistId)}` +
        `&maxResults=${pageSize}` + (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : "") +
        `&key=${encodeURIComponent(apiKey)}`;

        const plData = await fetchJson(plUrl);
        pageToken = plData.nextPageToken;

        const videoIds: string[] = (plData.items ?? []).map((it: any)=>it?.contentDetails?.videoId).filter(Boolean);
        if (!videoIds.length) break;

        const vUrl = `${YT_API}/videos?part=snippet,status&id=${encodeURIComponent(videoIds.join(","))}`+
            `&key=${encodeURIComponent(apiKey)}`
        const vData = await fetchJson(vUrl);
        
        const byId = new Map<string, any>();

        for (const v of vData.items ?? []){
            byId.set(v.id, v);
        }

        for (const id of videoIds){
            const v = byId.get(id);
            if (!v) continue;
            if (v.status?.privacyStatus != "public") continue;

            collected.push({
                id: v.id,
                title: v.snippet.title,
                thumbnailUrl:
                v.snippet.thumbnails?.maxres?.url ||
                v.snippet.thumbnails?.high?.url ||
                v.snippet.thumbnails?.medium?.url ||
                v.snippet.thumbnails?.default?.url,
                publishedAt: v.snippet.publishedAt,
            });

            if (collected.length >= maxResults) break;
        }
    }

    return collected;
}