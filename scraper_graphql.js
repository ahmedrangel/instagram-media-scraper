// Load from ENV
require('dotenv').config()

const _userAgent = process.env.USER_AGENT;
const _xIgAppId = process.env.X_IG_APP_ID;

if (!_userAgent || !_xIgAppId) {
  console.error("Required headers not found in ENV");
  process.exit(1);
}

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
  const graphql = new URL(`https://www.instagram.com/api/graphql`);
  graphql.searchParams.set("variables", JSON.stringify({ shortcode: igId }));
  graphql.searchParams.set("doc_id", "10015901848480474");
  graphql.searchParams.set("lsd", "AVqbxe3J_YA"); 

  const response = await fetch(graphql, {
    method: "POST",
    headers: {
      "User-Agent": _userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      "X-IG-App-ID": _xIgAppId,
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Site": "same-origin"
    }
  });

  const json = await response.json();
  const items = json?.data?.xdt_shortcode_media; 
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
  const data = await getInstagramGraphqlData("https://www.instagram.com/reel/CtjoC2BNsB");
  console.log(data);
})();