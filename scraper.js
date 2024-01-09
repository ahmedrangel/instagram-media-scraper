// Required headers example
const _userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"; // Use this one or get your User-Agent from your browser
const _cookie = "ds_user_id=...; sessionid=...;"; // required! get your Cookie values from your browser
const _xIgAppId = "93661974..."; // required! get your X-Ig-App-Id from your browser

// Function to get instagram post ID from URL string
const getId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[^/]+\/)?([^/?]+)/;
  const result = regex.exec(url);
  return result && result.length > 1 ? result[1] : null;
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
  const items = json.items[0]; // You can return the entire items or create your own JSON object from them
  
  // Check if post is a carousel
  let carousel_media = [];
  items.product_type === "carousel_container" ? (() => {
    items.carousel_media.forEach(element => {
      carousel_media.push({
        image_versions: element.image_versions2.candidates ?? null,
        video_versions: element.video_versions ?? null
      })
    })
    return carousel_media;
  })() : carousel_media = null;
  
  // Return custom json object
  return {
    code: items.code ?? null,
    created_at: items.taken_at ?? null,
    username: items.user.username ?? null,
    full_name: items.user.full_name ?? null,
    profile_picture: items.user.profile_pic_url ?? null,
    is_verified: items.user.is_verified ?? null,
    is_paid_partnership: items.is_paid_partnership ?? null,
    product_type: items.product_type ?? null,
    caption: items.caption?.text ?? null,
    like_count: items.like_count ?? null,
    comment_count: items.comment_count ?? null,
    view_count: items.view_count ? items.view_count : items.play_count ?? null,
    video_duration: items.video_duration ?? null,
    location: items.location ?? null,
    height: items.original_height ?? null,
    width: items.original_width ?? null,
    image_versions: items.image_versions2?.candidates ?? null,
    video_versions: items.video_versions ?? null,
    carousel_media: carousel_media
  };
};

(async() => {
  // Get data from instagram post or reel URL string
  const data = await getInstagramData("https://www.instagram.com/reel/CtjoC2BNsB2");
  console.log(data);
})();