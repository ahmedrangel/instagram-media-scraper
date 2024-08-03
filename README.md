# **Instagram Media Scraper Without API (Working August 2024)**
 This is simple Node.js (v18.16+) script to get public **information** and **media** (*images*, *videos*, *carousel*) from a specific instagram post or reel URL without API. Working in 2024.

You can get **information**, **image versions**, **video versions** and **carousel media** with their respective image versions and/or video versions of each of them.

## **How to get your Cookie, User-Agent and X-Ig-App-Id**
- Login to Instagram
- Go to your **profile page** or any **instagram page**.
- Right click and **inspect** or press F12 (Chrome).
    1. Select **Network** tab.
    2. Selec **All** filter.
    3. Select `timeline/` or `yourusername/` or `instagram/` or any of the `graphql` files. You can use the filter field to search for it. If it's empty just refresh the page.
    4. Select **Headers** bar.
    5. Scroll down and look for **Request Headers** tab.
    6. Look for `ds_user_id` and `sessionid` and copy its values from your **Cookies**.
    7. Copy your **User-Agent** code.
       > User-Agent is included in the code, but I recommend to get your own.
    8. Copy your **X-Ig-App-Id** code.

    ```diff
    - Your cookie will expire if you log out or switch accounts, you will need to get it again.
    ``` 

![scraper](https://github.com/ahmedrangel/instagram-media-scraper/assets/50090595/4cc339ea-a314-4696-8fc2-eaa756d4018e)

> Don't share your cookie code with anyone!

## Example
```js
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
  const items = json?.items[0]; // You can return the entire items or create your own JSON object from them
  
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
```

## Stringified JSON output example
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
  "view_count": 357385,
  "video_duration": 5.293,
  "location": undefined,
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
