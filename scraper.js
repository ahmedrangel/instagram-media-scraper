// Load from ENV
require('dotenv').config()

const _userAgent = process.env.USER_AGENT;
const _cookie = process.env.COOKIE;
const _xIgAppId = process.env.X_IG_APP_ID;

if (!_userAgent || !_cookie || !_xIgAppId) {
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
const getInstagramData = async (url) => {
  const igId = getId(url);
  if (!igId) return "Invalid URL";

  // Fetch data from instagram post
  const response = await fetch(`https://www.instagram.com/p/${igId}?__a=1&__d=dis`, {
    headers: {
      "Cookie": _cookie,
      "User-Agent": _userAgent,
      "X-IG-App-ID": _xIgAppId,
      "Sec-Fetch-Site": "same-origin"
    }
  });

  const json = await response.json();
  const items = json?.items[0];
  // You can return the entire items or create your own JSON object from them
  // return items;
  
  // Check if post is a carousel
  let carousel_media = [];
  items?.product_type === "carousel_container" ? (() => {
    for (const el of items?.carousel_media) {
      carousel_media.push({
        image_versions: el?.image_versions2?.candidates,
        video_versions: el?.video_versions
      })
    }
    return carousel_media;
  })() : carousel_media = undefined;
  
  // Return custom json object
  return {
    code: items?.code,
    created_at: items?.taken_at,
    username: items?.user?.username,
    full_name: items?.user?.full_name,
    profile_picture: items?.user?.profile_pic_url,
    is_verified: items?.user?.is_verified,
    is_paid_partnership: items?.is_paid_partnership,
    product_type: items?.product_type,
    caption: items?.caption?.text,
    like_count: items?.like_count,
    comment_count: items?.comment_count,
    view_count: items?.view_count ? items.view_count : items?.play_count,
    video_duration: items?.video_duration,
    location: items?.location,
    height: items?.original_height,
    width: items?.original_width,
    image_versions: items?.image_versions2?.candidates,
    video_versions: items?.video_versions,
    carousel_media
  };
};

(async() => {
  // Get data from instagram post or reel URL string
  const data = await getInstagramData("https://www.instagram.com/reel/CtjoC2BNsB2");
  console.log(data);
})();