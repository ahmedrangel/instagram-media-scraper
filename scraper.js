// Instgram post or reel URL
const url = "https://www.instagram.com/reel/CtjoC2BNsB2/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==" // url example
const _cookie = `fbm_124024...dab7cd8"`;    // required! get your Cookie from your browser
const _userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"; // or get your User-Agent from your browser
const _xIgAppId = "93661974...";            // required! get your X-Ig-App-Id from your browser

// Function to get instagram post ID from any url string
const getId = (url) => {
  const regex = /\/([a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9]+)?(?:\?|$|\/\?|\/$)/;
  const result = regex.exec(url);
  if (result && result.length > 1) {
    return result[1];
  } else {
    return null;
  }
}

const idUrl = getId(url);

// Fetch data from instagram post
if (!idUrl) {
  console.log('Invalid URL');
} else {
  const response = await fetch(`https://www.instagram.com/p/${idUrl}?__a=1&__d=di`, {
    headers: {
      "cookie": _cookie,
      "user-agent": _userAgent,
      "x-ig-app-id": _xIgAppId,
      ["sec-fetch-site"]: "same-origin"
    }
  });
  const json = await response.json();
  const items = json.items[0];
  let carousel_media = [];

  // Check if post is a carousel post
  items.product_type === "carousel_container" ? (() => {
    items.carousel_media.forEach(element => {
      carousel_media.push({
        image_versions: element.image_versions2.candidates,
        video_versions: element.video_versions
      })
    })
    return carousel_media;
  })() : carousel_media = null;
  
  // Create json data
  const json_data = {
    code: items.code,
    created_at: items.taken_at,
    username: items.user.username,
    full_name: items.user.full_name,
    profile_picture: items.user.profile_pic_url,
    is_verified: items.user.is_verified,
    is_paid_partnership: items.is_paid_partnership,
    product_type: items.product_type,
    caption: items.caption !== null ? items.caption.text : null,
    like_count: items.like_count,
    comment_count: items.comment_count,
    view_count: items.view_count,
    location: items.location,
    height: items.original_height,
    width: items.original_width,
    image_versions: items.image_versions2 !== null ? items.image_versions2.candidates : null,
    video_versions: items.video_versions,
    carousel_media: carousel_media
  }

  // Print json data
  console.log(json_data);
}