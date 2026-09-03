// The twelve portfolio entries, in the order the live site lists them
// (sitemap order = "Our Work" grid order = the Prev/Next chain).
// Scraped from boldeimaging.com; regenerate with scripts/ if the copy changes.

export interface PortfolioItem {
  slug: string;
  title: string;
  /** uploads-relative image behind the Our Work flip box */
  grid: string;
  categories: string[];
  /** uploads-relative hero image on the detail page */
  image: string;
  imageWidth: number;
  imageHeight: number;
  body: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    "slug": "wayfinding",
    "title": "Wayfinding",
    "grid": "2021/04/IMG_20151105_131919_hdr.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/IMG_20151105_131919_hdr.jpg",
    "imageWidth": 791,
    "imageHeight": 791,
    "body": "When it comes to large locations, such as malls, warehouses or event grounds, wayfinding signs are some of the most important components. Wayfinding signs help orient your employees, visitors and patrons so that they can reach their desired location safely and easily."
  },
  {
    "slug": "pylon-signs",
    "title": "Pylon Signs",
    "grid": "2021/04/Pylon_Featured.jpg",
    "categories": [
      "Exterior"
    ],
    "image": "2021/04/Pylon_Featured-1024x746.jpg",
    "imageWidth": 1024,
    "imageHeight": 746,
    "body": "Aside from a storefront or fascia sign, one of the most important components of a large retail location, such as a mall or stripmall, is the streetside pylon sign. This is the best way to let passersby and motorists know what kinds of establishments are featured at your location."
  },
  {
    "slug": "push-thru-signs",
    "title": "Push Thru Signs",
    "grid": "2021/04/IMG_20141128_123815.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/IMG_20141128_123815.jpg",
    "imageWidth": 791,
    "imageHeight": 791,
    "body": ""
  },
  {
    "slug": "interiors",
    "title": "Interiors",
    "grid": "2021/04/arbors2.jpg",
    "categories": [
      "Interior"
    ],
    "image": "2021/04/arbors2-1024x576.jpg",
    "imageWidth": 1024,
    "imageHeight": 576,
    "body": "Not only do we specialize in fabricating and installing interior signage, we work with you to ensure that you have a completed space that looks beautiful as a whole. Interior designers we are not, but when it comes to creative solutions and expert installations, we can make your vision a reality."
  },
  {
    "slug": "hoarding-signs",
    "title": "Hoarding Signs",
    "grid": "2021/04/IMG_1767.jpg",
    "categories": [
      "Exterior"
    ],
    "image": "2021/04/IMG_1767-1024x768.jpg",
    "imageWidth": 1024,
    "imageHeight": 768,
    "body": "Construction hoarding isn’t just a great spot for first-party advertising, it’s also legally necessary for most construction sites. We work directly with the municipality, engineers, and you to ensure your hoarding is safe and to code. Construction hoarding surrounding a site also provides many opportunities for you to get creative and get your new development noticed!"
  },
  {
    "slug": "cut-out-letters",
    "title": "Cut Out letters",
    "grid": "2021/04/ROC-9.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/ROC-9-1024x685.jpg",
    "imageWidth": 1024,
    "imageHeight": 685,
    "body": "Our cut-out letters can be fabricated out of a number of materials, including acrylic, plastic, glass, and more. This is a great option for storefronts, interior displays and window displays. Any design or font is possible."
  },
  {
    "slug": "construction-development-sales-offices",
    "title": "Construction, Development & Sales Offices",
    "grid": "2021/04/fortune_exteriro.jpg",
    "categories": [
      "Exterior"
    ],
    "image": "2021/04/fortune_exteriro-1024x366.jpg",
    "imageWidth": 1024,
    "imageHeight": 366,
    "body": "In addition to construction hoarding, your worksite will need all sorts of other signs, including wayfinding signs, safety warnings, traffic diversions, and other promotional materials."
  },
  {
    "slug": "awnings",
    "title": "Awnings",
    "grid": "2021/04/IMG_20140701_164233.jpg",
    "categories": [
      "Exterior"
    ],
    "image": "2021/04/IMG_20140701_164233-1024x576.jpg",
    "imageWidth": 1024,
    "imageHeight": 576,
    "body": "Foot traffic is super important to most retail locations, and an awning is a great way to get noticed. Plus, your patrons will be thankful for the shelter from the sun and rain, and you can confidently display products outdoors without fear of damage from natural elements."
  },
  {
    "slug": "fascia-signs",
    "title": "Fascia Signs",
    "grid": "2021/04/v.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/v-1024x768.jpg",
    "imageWidth": 1024,
    "imageHeight": 768,
    "body": "A fascia sign is signage typically found above a storefront or any other establishment to promote a business or an event. This is where your brand lives. You may have your brand identity down on paper and digitally, but we can make it tangible."
  },
  {
    "slug": "custom-signage",
    "title": "Custom Signage",
    "grid": "2021/04/IMG_3193.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/IMG_3193-768x1024.jpg",
    "imageWidth": 768,
    "imageHeight": 1024,
    "body": "Our professional tradespeople and up-to-date technologies make every imaging project possible. If you have an idea in mind, we can find a way to make it happen."
  },
  {
    "slug": "channel-letters",
    "title": "Channel Letters",
    "grid": "2021/04/GEDC0426-scaled.jpg",
    "categories": [
      "Exterior",
      "Interior"
    ],
    "image": "2021/04/GEDC0426-1024x768.jpg",
    "imageWidth": 1024,
    "imageHeight": 768,
    "body": "Channel lettering is a custom process where 3D letters are fabricated individually out of metal or plastic. There are many ways to further customize channel letters; for example, we can install LED lights in each individual letter. Channel lettering is a handmade process, so we definitely consider it an artform, and we have some of the best artists in the industry."
  },
  {
    "slug": "banners",
    "title": "Banners",
    "grid": "2021/04/128A2339.jpeg",
    "categories": [
      "Exterior"
    ],
    "image": "2021/04/128A2339-1024x751.jpeg",
    "imageWidth": 1024,
    "imageHeight": 751,
    "body": "Whether you need a short banner or the longest banner, we have you covered. We print your banner design on very durable materials that easily withstand exterior elements. We can even install your banners on a construction crane."
  }
];
