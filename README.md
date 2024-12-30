# **Instagram Media Scraper Without API (Working December 2024)**
 This is simple Node.js (v18.16+) script to get public **information** and **media** (*images*, *videos*, *carousel*) from a specific instagram post or reel URL without API. Working in 2024.

# Table of Content
- [How to get your Cookie, User-Agent and X-Ig-App-Id headers](#how-to-get-your-cookie-user-agent-and-x-ig-app-id-headers)
- [Method 1: Magic Parameters](#method-1-magic-parameters)
  - [Code example](#code-example)
  - [Output example](#stringified-json-output-example)
- [Method 2: GraphQL (No Cookie Needed)](#method-2-graphql-no-cookie-needed)
  - [Code example](#code-example-1)
  - [Output example](#stringified-json-output-example-1)
- [Method 3: Puppeteer (Slow)](#method-3-puppeteer-slow)

## **How to get your Cookie, User-Agent and X-Ig-App-Id headers**
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

+ rename `.env.example` to `.env`
+ enter the credentials
```bash
# required! Use this one or get your User-Agent from your browser
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36
# only required for magic parameters! get your Cookie values from your browser
COOKIE=
# required!  get your X-Ig-App-Id from your browser
X_IG_APP_ID=
```

# Method 1: Magic Parameters

Using "Magic Parameters" `?__a=1&__d=dis`.

You can get **information**, **image versions**, **video versions**, **carousel media** with their respective image versions and/or video versions of each of them, and more.

## Code example
```js

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
```

## Stringified JSON output example
```json
{
  "code": "CtjoC2BNsB2",
  "created_at": 1686930107,
  "username": "fatfatpankocat",
  "full_name": "Panko A. Cat",
  "profile_picture": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-19/428584192_1431449027454508_4927424727647346838_n.jpg?...",
  "is_verified": false,
  "is_paid_partnership": false,
  "product_type": "clips",
  "caption": "Processing speeds are at an all time low",
  "like_count": 72185,
  "comment_count": 129,
  "view_count": 371210,
  "video_duration": 5.166,
  "height": 1024,
  "width": 576,
  "image_versions": [
    {
      "width": 576,
      "height": 1024,
      "url": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?..."
    },
    ...
  ],
  "video_versions": [
    {
      "height": 1024,
      "id": "1363008590946442v",
      "type": 101,
      "url": "https://scontent.cdninstagram.com/o1/v/t16/f1/m82/F5462086DC54DD10E6E0AC3C9902A2A3_video_dashinit.mp4?...",
      "width": 576
    },
    ...
  ]
}
```

# Method 2: GraphQL (No Cookie Needed)

Using graphql private API.

You can get **information**, **thumbnail src**, **video url**, **carousel media** **sidecar (carousel media)** and more.

## Code example
```js
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
  const data = await getInstagramGraphqlData("https://www.instagram.com/reel/CtjoC2BNsB2");
  console.log(data);
})();
```

## Stringified JSON output example
```json
{
  "__typename": "GraphVideo",
  "shortcode": "CtjoC2BNsB2",
  "dimensions": {
    "height": 1137,
    "width": 640
  },
  "display_url": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?...",
  "display_resources": [
    {
      "src": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?...",
      "config_width": 640,
      "config_height": 1137
    },
    ...
  ],
  "has_audio": true,
  "video_url": "https://instagram.fpac1-2.fna.fbcdn.net/o1/v/t16/f1/m82/F5462086DC54DD10E6E0AC3C9902A2A3_video_dashinit.mp4?...",
  "video_view_count": 127096,
  "video_play_count": 371210,
  "is_video": true,
  "caption": "Processing speeds are at an all time low",
  "is_paid_partnership": false,
  "location": null,
  "owner": {
    "id": "39625136655",
    "is_verified": false,
    "profile_pic_url": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-19/428584192_1431449027454508_4927424727647346838_n.jpg?...",
    "username": "fatfatpankocat",
    "blocked_by_viewer": false,
    "restricted_by_viewer": false,
    "followed_by_viewer": false,
    "full_name": "Panko A. Cat",
    "has_blocked_viewer": false,
    "is_embeds_disabled": false,
    "is_private": false,
    "is_unpublished": false,
    "requested_by_viewer": false,
    "pass_tiering_recommendation": true,
    "edge_owner_to_timeline_media": {
      "count": 1423
    },
    "edge_followed_by": {
      "count": 508145
    }
  },
  "product_type": "clips",
  "video_duration": 5.166,
  "thumbnail_src": "https://instagram.fpac1-4.fna.fbcdn.net/v/t51.2885-15/354801788_1023848012117396_6220977847781610270_n.jpg?...",
  "clips_music_attribution_info": {
    "artist_name": "0lukasaa",
    "song_name": "Original audio",
    "uses_original_audio": true,
    "should_mute_audio": false,
    "should_mute_audio_reason": "",
    "audio_id": "508221254754075"
  }
}
```

# Method 3: Puppeteer (Slow)

This method starts a server for scraping instagram post and reel medias using puppeteer and itty-router. It automatically handles Instagram Login and provide routes for fetching the data.

- Repo: [Instagram Puppeteer Media Scraper](https://github.com/ahmedrangel/instagram-puppeteer-media-scraper)