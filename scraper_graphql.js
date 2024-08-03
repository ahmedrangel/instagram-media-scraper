// Required headers example
const _userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"; // Use this one or get your User-Agent from your browser
const _cookie = "ds_user_id=...; sessionid=...;"; // required! get your Cookie values from your browser
const _xIgAppId = "93661974..."; // required! get your X-Ig-App-Id from your browser

// Function to get instagram post ID from URL string
const getId = (url) => {
  const regex = /instagram.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  return match && match[2] ? match[2] : null;
};

// Function to get instagram data from URL string
const getInstagramGraphqlData = async (url) => {
  const igId = getId(url);
  if (!igId) return "Invalid URL";

  // Fetch graphql data from instagram post
  const graphql = new URL("https://www.instagram.com/graphql/query");
  graphql.searchParams.set("query_hash", "9f8827793ef34641b2fb195d4d41151c");
  graphql.searchParams.set("variables", JSON.stringify({ shortcode: igId }));

  const response = await fetch(graphql, {
    headers: {
      "cookie": _cookie,
      "user-agent": _userAgent,
      "x-ig-app-id": _xIgAppId,
      ["sec-fetch-site"]: "same-origin"
    }
  });

  const json = await response.json();
  const items = json?.data?.shortcode_media; 
  // You can return the entire items or create your own JSON object from them
  // return items;

  // Return custom json object
  return {
    __typename: items?.__typename,
    shortcode: items?.shortcode,
    dimensions: items?.dimensions,
    display_url: items?.display_url,
    display_resources: items?.display_resources,
    has_audio: items?.has_audio,
    video_url: items?.video_url,
    video_view_count: items?.video_view_count,
    video_play_count: items?.video_play_count,
    is_video: items?.is_video,
    caption: items?.edge_media_to_caption?.edges[0]?.node?.text,
    is_paid_partnership: items?.is_paid_partnership,
    location: items?.location,
    owner: items?.owner,
    product_type: items?.product_type,
    video_duration: items?.video_duration,
    thumbnail_src: items?.thumbnail_src,
    clips_music_attribution_info: items?.clips_music_attribution_info,
    sidecar: items?.edge_sidecar_to_children?.edges,
  }
};

(async() => {
  // Get data from instagram post or reel URL string
  const data = await getInstagramGraphqlData("https://www.instagram.com/reel/CtjoC2BNsB2");
  console.log(data);
})();