# **Instagram Media Scraper Without API (Working July 2023)**
 This is simple Node.js code to get public **information** and **media** (*images*, *videos*, *carousel*) from every instagram post or reel URL without API. Working in 2023.

You can get **information**, **image versions**, **video versions** and **carousel media** with their respective image versions and/or video versions of each of them.

## **How to get your Cookie, User-Agent and X-Ig-App-Id**
- Login to Instagram
- Go to your **profile page** or any **instagram page**.
- Right click and **inspect** or press F12 (Chrome).
    1. Select **Network** tab.
    2. Selec **All** filter.
    3. Select **timeline/** file. You can use the filter field to search it. If it's empty just refresh the page.
    4. Select **Headers** bar.
    5. Scroll down and look for **Request Headers** tab.
    6. Copy your **Cookie** code.
    7. Copy your **User-Agent** code.
    8. Copy your **X-Ig-App-Id** code.

![scraper](https://github.com/ahmedrangel/instagram-media-scraper/assets/50090595/4cc339ea-a314-4696-8fc2-eaa756d4018e)

> Don't share your cookie code with anyone!
- If you get these syntax error mark just put a forward slash after all the back slashes.

![image](https://github.com/ahmedrangel/instagram-media-scraper/assets/50090595/a42bf426-8c89-4099-81e2-1017a1a3e7d8)

![image](https://github.com/ahmedrangel/instagram-media-scraper/assets/50090595/830b1647-31da-41d0-b93a-052590982f0d)

## Example
```js
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
```
## JSON output
```json
{
  "code": "CtjoC2BNsB2",
  "created_at": 1686930107,
  "username": "fatfatpankocat",
  "full_name": "Panko A. Cat",
  "profile_picture": "https://scontent.cdninstagram.com/v/t51.2885-19/351028002_1390928218140357_6492853570855484928_n.jpg?.............",
  "is_verified": false,
  "is_paid_partnership": false,
  "product_type": "clips",
  "caption": "Processing speeds are at an all time low",
  "like_count": 50799,
  "comment_count": 112,
  "view_count": null,
  "location": null,
  "height": 1024,
  "width": 576,
  "image_versions": [
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 1024,
      "width": 576
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 853,
      "width": 480
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 569,
      "width": 320
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 427,
      "width": 240
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 1080,
      "width": 1080
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 750,
      "width": 750
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 640,
      "width": 640
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 480,
      "width": 480
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 320,
      "width": 320
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 240,
      "width": 240
    },
    {
      "url": "https://scontent.cdninstagram.com/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?.............",
      "height": 150,
      "width": 150
    }
  ],
  "video_versions": [
    {
      "width": 576,
      "height": 1024,
      "url": "https://scontent.cdninstagram.com/o1/v/t16/f1/m82/F5462086DC54DD10E6E0AC3C9902A2A3_video_dashinit.mp4?.............",
      "type": 101
    },
    {
      "width": 432,
      "height": 768,
      "url": "https://scontent.cdninstagram.com/o1/v/t16/f1/m82/5542D63645ABB4B44E5B31785E6A6181_video_dashinit.mp4?.............",
      "type": 102
    },
    {
      "width": 432,
      "height": 768,
      "url": "https://scontent.cdninstagram.com/o1/v/t16/f1/m82/5542D63645ABB4B44E5B31785E6A6181_video_dashinit.mp4?.............",
      "type": 103
    }
  ],
  "carousel_media": null
}
```
