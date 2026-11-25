// Image lists for the three home-page galleries, in the order the live
// site renders them.

export interface Img {
  src: string;
  alt: string;
  w: number;
  h: number;
}

/** "Our Great Clients" carousel -- 4 per view, continuous scroll. Alt text is
 * the name printed on each logo (WordPress used the file name, e.g. "Logo-05"). */
export const CLIENTS: Img[] = [
  {
    "src": "2021/04/Logo-05-768x549.png",
    "alt": "Cineplex logo",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-04-768x549.png",
    "alt": "Circle K logo",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-01-768x549.png",
    "alt": "Bamiyan Kabob logo",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-02-768x548.png",
    "alt": "Mattamy Homes logo",
    "w": 768,
    "h": 548
  },
  {
    "src": "2021/04/Logo-03-768x549.png",
    "alt": "Freshii logo",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-06-768x548.png",
    "alt": "The Rec Room logo",
    "w": 768,
    "h": 548
  },
  {
    "src": "2021/05/pemberton.png",
    "alt": "Pemberton logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/peloton.png",
    "alt": "Peloton logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/pinnacle.png",
    "alt": "Pinnacle International logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/playdium.png",
    "alt": "Playdium logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/prombank.png",
    "alt": "Prombank logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/saks.png",
    "alt": "Saks Fifth Avenue logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/showcase.png",
    "alt": "Showcase logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/signarama.png",
    "alt": "Signarama logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/starlane.png",
    "alt": "Starlane Home Corporation logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/sundial.png",
    "alt": "Sundial Homes logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/tbooth.png",
    "alt": "Tbooth wireless logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/tesla.png",
    "alt": "Tesla logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/unilever.png",
    "alt": "Unilever logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/upfield.png",
    "alt": "Upfield logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/wirelesswave.png",
    "alt": "Wirelesswave logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/adi.png",
    "alt": "ADI logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/alterra.png",
    "alt": "Alterra logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/biddington.png",
    "alt": "Biddington logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/cf.png",
    "alt": "CF logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/cn.png",
    "alt": "CN logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/furnbrook.png",
    "alt": "Fernbrook Homes logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/gladiator.png",
    "alt": "Gladiator Burger & Steak logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/greenpark.png",
    "alt": "Greenpark Group logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/hudson-bay.png",
    "alt": "Hudson's Bay logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/liberty.png",
    "alt": "Liberty Development logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/mediaresources.png",
    "alt": "Media Resources logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/mondiale.png",
    "alt": "Mondiale Development logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/nordstrom.png",
    "alt": "Nordstrom logo",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/papajohns.png",
    "alt": "Papa John's logo",
    "w": 400,
    "h": 286
  }
];

/** "Associations" -- a plain 3-column WordPress gallery, no links. Alt text is
 * the name printed on each logo (empty on the WordPress original). */
export const ASSOCIATIONS: Img[] = [
  {
    "src": "2021/04/bild-2.png",
    "alt": "BILD logo",
    "w": 125,
    "h": 85
  },
  {
    "src": "2021/04/SA-2.png",
    "alt": "CSA logo",
    "w": 100,
    "h": 68
  },
  {
    "src": "2021/04/untas-1.png",
    "alt": "International Sign Association logo",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/sacc-1.png",
    "alt": "Sign Association of Canada (SAC-ACE) logo",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/contra-1.png",
    "alt": "ContractorCheck logo",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/osa-1.png",
    "alt": "Ontario Sign Association logo",
    "w": 150,
    "h": 102
  }
];

/** "Project Galleries" carousel -- 3 per view, arrows, 5s autoplay. */
export const PROJECT_GALLERIES: Img[] = [
  {
    "src": "2021/04/DocBraces-Markham-Storefront-1-768x576.jpg",
    "alt": "DocBraces Markham (Storefront)",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/weston-go-station-1-768x576.jpg",
    "alt": "weston go station",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/MDA-Ground-Sign-2-768x576.jpg",
    "alt": "MDA Ground Sign -2",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Karahi-Storefront-Sign-Scarborough-1-768x576.jpg",
    "alt": "Karahi Storefront Sign (Scarborough)",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/tec-queen-entrance-768x576.jpg",
    "alt": "tec queen entrance",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Little-Canada-east-coast-768x576.jpg",
    "alt": "Little Canada - east coast",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/gladiator-dixie-logos-768x576.jpg",
    "alt": "gladiator dixie logos",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Baylis-768x576.jpg",
    "alt": "Baylis",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/HillHurst-Towns-FOXX-768x576.jpg",
    "alt": "HillHurst Towns - FOXX",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/4DX-Ottawa-768x576.jpg",
    "alt": "4DX Ottawa",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Banners-Roller-Blinds-1-768x576.jpg",
    "alt": "Banners Roller Blinds 1",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Green-Park-Large-Banner-768x576.jpg",
    "alt": "Greenpark banner on a building under construction",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/MAXX-Reception-Wall-768x576.jpg",
    "alt": "MAXX Reception Wall",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/liberty-interior-768x576.jpg",
    "alt": "liberty interior",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/oneyonge1-768x576.jpg",
    "alt": "oneyonge1",
    "w": 768,
    "h": 576
  },
  {
    "src": "2021/04/Solmar-ORO-Interior-Framed-768x576.jpg",
    "alt": "Solmar ORO Interior Framed",
    "w": 768,
    "h": 576
  }
];

/**
 * The three full-bleed CSS background images on the home page, in the order
 * the sections appear. Elementor element ids are the same ones the section
 * comments in index.astro carry.
 *
 * These live here rather than inline in the page for one reason: an image
 * sitemap is the only way a crawler learns about a CSS background at all --
 * there is no <img> for it to find -- so they have to be reachable from the
 * sitemap route. Keeping the single source here means adding a background to
 * the page cannot silently drop it out of the sitemap again.
 *
 * `alt` is descriptive rather than empty even though CSS backgrounds carry no
 * alt attribute, because it documents what each file actually shows.
 */
export const HOME_BACKGROUNDS: Img[] = [
  {
    // #faf9b1e — "Be BolDe." section
    src: '2021/04/Slider3_BG2.jpg',
    alt: 'BolDe Imaging signage production facility',
    w: 1920,
    h: 1280,
  },
  {
    // #ed8be87 — full-width image band
    src: '2021/04/tribute14.jpg',
    alt: 'Tribute Communities presentation centre interior signage',
    w: 1920,
    h: 1280,
  },
  {
    // #d8623db — "About Us" section
    src: '2021/04/128A233912.jpeg',
    alt: 'BolDe Imaging fabrication shop floor',
    w: 1920,
    h: 1280,
  },
];

/** The header wordmark, shown on every page; listed once, against the home page. */
export const LOGO: Img = {
  src: '2021/04/Bolde_logo_White.png',
  alt: 'BolDe Imaging',
  w: 300,
  h: 300,
};
