// Image lists for the three home-page galleries, in the order the live
// site renders them.

export interface Img {
  src: string;
  alt: string;
  w: number;
  h: number;
}

/** "Our Great Clients" carousel -- 4 per view, continuous scroll. */
export const CLIENTS: Img[] = [
  {
    "src": "2021/04/Logo-05-768x549.png",
    "alt": "Logo-05",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-04-768x549.png",
    "alt": "Logo-04",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-01-768x549.png",
    "alt": "Logo-01",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-02-768x548.png",
    "alt": "Logo-02",
    "w": 768,
    "h": 548
  },
  {
    "src": "2021/04/Logo-03-768x549.png",
    "alt": "Logo-03",
    "w": 768,
    "h": 549
  },
  {
    "src": "2021/04/Logo-06-768x548.png",
    "alt": "Logo-06",
    "w": 768,
    "h": 548
  },
  {
    "src": "2021/05/pemberton.png",
    "alt": "pemberton",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/peloton.png",
    "alt": "peloton",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/pinnacle.png",
    "alt": "pinnacle",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/playdium.png",
    "alt": "playdium",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/prombank.png",
    "alt": "prombank",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/saks.png",
    "alt": "saks",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/showcase.png",
    "alt": "showcase",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/signarama.png",
    "alt": "signarama",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/starlane.png",
    "alt": "starlane",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/sundial.png",
    "alt": "sundial",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/tbooth.png",
    "alt": "tbooth",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/tesla.png",
    "alt": "tesla",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/unilever.png",
    "alt": "unilever",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/upfield.png",
    "alt": "upfield",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/wirelesswave.png",
    "alt": "wirelesswave",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/adi.png",
    "alt": "adi",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/alterra.png",
    "alt": "alterra",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/biddington.png",
    "alt": "biddington",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/cf.png",
    "alt": "cf",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/cn.png",
    "alt": "cn",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/furnbrook.png",
    "alt": "furnbrook",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/gladiator.png",
    "alt": "gladiator",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/greenpark.png",
    "alt": "greenpark",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/hudson-bay.png",
    "alt": "hudson-bay",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/liberty.png",
    "alt": "liberty",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/mediaresources.png",
    "alt": "mediaresources",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/mondiale.png",
    "alt": "mondiale",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/nordstrom.png",
    "alt": "nordstrom",
    "w": 400,
    "h": 286
  },
  {
    "src": "2021/05/papajohns.png",
    "alt": "papajohns",
    "w": 400,
    "h": 286
  }
];

/** "Associations" -- a plain 3-column WordPress gallery, no links. */
/**
 * "Associations" -- the six membership and certification logos.
 *
 * Their `alt` text is AUTHORED, not scraped: WordPress served all six with an
 * empty alt. Each string is what the logo itself spells out, read off the
 * image, so nothing here claims a membership the client does not display.
 */
export const ASSOCIATIONS: Img[] = [
  {
    "src": "2021/04/bild-2.png",
    "alt": "BILD",
    "w": 125,
    "h": 85
  },
  {
    "src": "2021/04/SA-2.png",
    "alt": "CSA",
    "w": 100,
    "h": 68
  },
  {
    "src": "2021/04/untas-1.png",
    "alt": "International Sign Association",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/sacc-1.png",
    "alt": "Sign Association of Canada",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/contra-1.png",
    "alt": "ContractorCheck",
    "w": 150,
    "h": 102
  },
  {
    "src": "2021/04/osa-1.png",
    "alt": "Ontario Sign Association",
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
    "alt": "Greenpark banner and hoarding on a mid-rise construction site",
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
