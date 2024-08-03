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
const getInstagramData = async (url) => {
  const igId = getId(url);
  if (!igId) return "Invalid URL";

  // Fetch data from instagram post
  const response = await fetch(`https://www.instagram.com/p/${igId}?__a=1&__d=dis`, {
    headers: {
      "cookie": _cookie,
      "user-agent": _userAgent,
      "x-ig-app-id": _xIgAppId,
      ["sec-fetch-site"]: "same-origin"
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
  })() : carousel_media = null;
  
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