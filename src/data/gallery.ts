// The /gallery/ page: Elementor Pro "Gallery" widget, justified layout,
// ideal row height 162px (150 on tablet/mobile), 13px gap (10 on
// tablet/mobile), filter tabs, lightbox on click.

export const GALLERY_FILTERS: string[] = [
  "Awning",
  "Banners",
  "Channel Letters",
  "Construction",
  "Custom",
  "Cut Out Letters",
  "Fascia",
  "Hoarding",
  "Interiors",
  "Push thru",
  "Pylon",
  "Wayfinding"
];

export interface GalleryItem {
  /** index into GALLERY_FILTERS */
  tag: number;
  thumb: string;
  full: string;
  title: string;
  w: number;
  h: number;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    "tag": 0,
    "thumb": "2021/04/Upper-Oaks-Awning-Full-Decal-Overlays-300x225.jpg",
    "full": "2021/04/Upper-Oaks-Awning-Full-Decal-Overlays.jpg",
    "title": "Upper Oaks Awning Full Decal Overlays",
    "w": 300,
    "h": 225
  },
  {
    "tag": 0,
    "thumb": "2021/04/riveracanopy-225x300.jpg",
    "full": "2021/04/riveracanopy.jpg",
    "title": "riveracanopy",
    "w": 225,
    "h": 300
  },
  {
    "tag": 0,
    "thumb": "2021/04/Greenpark-Dunwest-Windows-300x225.jpg",
    "full": "2021/04/Greenpark-Dunwest-Windows.jpg",
    "title": "Greenpark Dunwest Windows",
    "w": 300,
    "h": 225
  },
  {
    "tag": 0,
    "thumb": "2021/04/Port-Credit-Mortgage-225x300.jpg",
    "full": "2021/04/Port-Credit-Mortgage.jpg",
    "title": "Port Credit Mortgage",
    "w": 225,
    "h": 300
  },
  {
    "tag": 0,
    "thumb": "2021/04/bamiyancanopy-225x300.jpg",
    "full": "2021/04/bamiyancanopy.jpg",
    "title": "bamiyancanopy",
    "w": 225,
    "h": 300
  },
  {
    "tag": 1,
    "thumb": "2021/04/sport-chek-banner-300x225.jpg",
    "full": "2021/04/sport-chek-banner.jpg",
    "title": "sport chek banner",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Playdium-Banners-Miss.-2-300x225.jpg",
    "full": "2021/04/Playdium-Banners-Miss.-2.jpg",
    "title": "Playdium Banners Miss. 2",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Pemberton-Banner-300x224.jpg",
    "full": "2021/04/Pemberton-Banner.jpg",
    "title": "Pemberton Banner",
    "w": 300,
    "h": 224
  },
  {
    "tag": 1,
    "thumb": "2021/04/Paradise-BNHS-3x9-Banner-Flags-225x300.jpg",
    "full": "2021/04/Paradise-BNHS-3x9-Banner-Flags.jpg",
    "title": "Paradise BNHS 3x9 Banner Flags",
    "w": 225,
    "h": 300
  },
  {
    "tag": 1,
    "thumb": "2021/04/Paradise-Banner-7x28-1-300x225.jpg",
    "full": "2021/04/Paradise-Banner-7x28-1.jpg",
    "title": "Paradise Banner 7x28",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Greenpark-Charisma-SignComp-2104-14x53-b-300x225.jpg",
    "full": "2021/04/Greenpark-Charisma-SignComp-2104-14x53-b.jpg",
    "title": "Greenpark Charisma SignComp 2104 14x53 b",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Green-Park-Large-Banner-300x225.jpg",
    "full": "2021/04/Green-Park-Large-Banner.jpg",
    "title": "GE DIGITAL CAMERA",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Community-Builders-8x20-banner-300x225.jpg",
    "full": "2021/04/Community-Builders-8x20-banner.jpg",
    "title": "Community Builders 8x20 banner",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Coming-Soon-Banner-TRR-Barrie-300x225.jpg",
    "full": "2021/04/Coming-Soon-Banner-TRR-Barrie.jpg",
    "title": "Coming Soon Banner - TRR Barrie",
    "w": 300,
    "h": 225
  },
  {
    "tag": 1,
    "thumb": "2021/04/Banners-Roller-Blinds-1-300x225.jpg",
    "full": "2021/04/Banners-Roller-Blinds-1.jpg",
    "title": "Banners Roller Blinds 1",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/t-booth-300x225.jpg",
    "full": "2021/04/t-booth.jpg",
    "title": "t booth",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/Little-Canada-Hindi-Fix-fulll-wall-300x225.jpg",
    "full": "2021/04/Little-Canada-Hindi-Fix-fulll-wall.jpg",
    "title": "Little Canada Hindi Fix (fulll wall)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/Kim-Smiley-Front-300x225.jpg",
    "full": "2021/04/Kim-Smiley-Front.jpg",
    "title": "Kim Smiley (Front)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/link-2-night-shot-300x225.jpg",
    "full": "2021/04/link-2-night-shot.jpg",
    "title": "link 2 night shot",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/IMG_20161203_165039-300x225.jpg",
    "full": "2021/04/IMG_20161203_165039.jpg",
    "title": "IMG_20161203_165039",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/Entrance-3-Sherway-Gardens-South-East-300x225.jpg",
    "full": "2021/04/Entrance-3-Sherway-Gardens-South-East.jpg",
    "title": "Entrance 3 - Sherway Gardens (South East)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/cf-limeridge-entrance-4-300x225.jpg",
    "full": "2021/04/cf-limeridge-entrance-4.jpg",
    "title": "cf limeridge entrance 4",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/CAA-Exterior-SIDE-300x225.jpg",
    "full": "2021/04/CAA-Exterior-SIDE.jpg",
    "title": "CAA - Exterior (SIDE)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/bluridge-dental-night-300x225.jpg",
    "full": "2021/04/bluridge-dental-night.jpg",
    "title": "bluridge dental night",
    "w": 300,
    "h": 225
  },
  {
    "tag": 2,
    "thumb": "2021/04/Baylis-Building-Sign-Mississauga-300x225.jpg",
    "full": "2021/04/Baylis-Building-Sign-Mississauga.jpg",
    "title": "Baylis - Building Sign - Mississauga",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Solmar-ORO-Interior-Framed-300x225.jpg",
    "full": "2021/04/Solmar-ORO-Interior-Framed.jpg",
    "title": "Solmar ORO Interior Framed",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/ROC-10-300x201.jpg",
    "full": "2021/04/ROC-10.jpg",
    "title": "ROC 10",
    "w": 300,
    "h": 201
  },
  {
    "tag": 3,
    "thumb": "2021/04/richlands--300x225.jpg",
    "full": "2021/04/richlands-.jpg",
    "title": "richlands",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Paradise-Beechwood-225x300.jpg",
    "full": "2021/04/Paradise-Beechwood.jpg",
    "title": "Paradise Beechwood",
    "w": 225,
    "h": 300
  },
  {
    "tag": 3,
    "thumb": "2021/04/MAXX-Reception-Wall-300x225.jpg",
    "full": "2021/04/MAXX-Reception-Wall.jpg",
    "title": "MAXX Reception Wall",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Mattamy-Homes-front-300x225.jpg",
    "full": "2021/04/Mattamy-Homes-front.jpg",
    "title": "Mattamy Homes (front)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/liberty-interior-300x225.jpg",
    "full": "2021/04/liberty-interior.jpg",
    "title": "liberty interior",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/IMG00282-20120828-1525-300x225.jpg",
    "full": "2021/04/IMG00282-20120828-1525.jpg",
    "title": "IMG00282-20120828-1525",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Greenpark-Mountainview-Heights-Lifestyle-Pics-Waterfall-300x225.jpg",
    "full": "2021/04/Greenpark-Mountainview-Heights-Lifestyle-Pics-Waterfall.jpg",
    "title": "Greenpark Mountainview Heights Lifestyle Pics & Waterfall",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Greenpark-Charisma-GS-300x225.jpg",
    "full": "2021/04/Greenpark-Charisma-GS.jpg",
    "title": "Greenpark Charisma GS",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Berkshire-LED-Boxes-300x225.jpg",
    "full": "2021/04/Berkshire-LED-Boxes.jpg",
    "title": "Berkshire LED Boxes",
    "w": 300,
    "h": 225
  },
  {
    "tag": 3,
    "thumb": "2021/04/Arista-Homes-300x169.jpg",
    "full": "2021/04/Arista-Homes.jpg",
    "title": "Arista Homes",
    "w": 300,
    "h": 169
  },
  {
    "tag": 4,
    "thumb": "2021/04/water-tower-1-225x300.jpg",
    "full": "2021/04/water-tower-1.jpg",
    "title": "water tower-1",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/Trenton-North-Westbound-Fridge-Front-Freshii-ONroute-300x225.jpg",
    "full": "2021/04/Trenton-North-Westbound-Fridge-Front-Freshii-ONroute.jpg",
    "title": "Trenton North Westbound - Fridge (Front) - Freshii ONroute",
    "w": 300,
    "h": 225
  },
  {
    "tag": 4,
    "thumb": "2021/04/softmoc-fairview-225x300.jpg",
    "full": "2021/04/softmoc-fairview.jpg",
    "title": "softmoc fairview",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/pinnacle-channel-letters-1-300x225.jpg",
    "full": "2021/04/pinnacle-channel-letters-1.jpg",
    "title": "pinnacle channel letters",
    "w": 300,
    "h": 225
  },
  {
    "tag": 4,
    "thumb": "2021/04/perrier-225x300.jpg",
    "full": "2021/04/perrier.jpg",
    "title": "perrier",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/oneyonge1-300x225.jpg",
    "full": "2021/04/oneyonge1.jpg",
    "title": "oneyonge1",
    "w": 300,
    "h": 225
  },
  {
    "tag": 4,
    "thumb": "2021/04/one-yonge-300x216.jpg",
    "full": "2021/04/one-yonge.jpg",
    "title": "one yonge",
    "w": 300,
    "h": 216
  },
  {
    "tag": 4,
    "thumb": "2021/04/curved-led-screen-225x300.jpg",
    "full": "2021/04/curved-led-screen.jpg",
    "title": "curved led screen",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/CF-Valet-Sherway-300x225.jpg",
    "full": "2021/04/CF-Valet-Sherway.jpg",
    "title": "CF Valet Sherway",
    "w": 300,
    "h": 225
  },
  {
    "tag": 4,
    "thumb": "2021/04/cf-fairview-2-300x225.jpg",
    "full": "2021/04/cf-fairview-2.jpg",
    "title": "cf fairview (2)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 4,
    "thumb": "2021/04/allvision-cladding-225x300.jpg",
    "full": "2021/04/allvision-cladding.jpg",
    "title": "allvision cladding",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/10-Prince-Arthur-3D-10-CinderBloc-225x300.jpg",
    "full": "2021/04/10-Prince-Arthur-3D-10-CinderBloc.jpg",
    "title": "10 Prince Arthur 3D 10 CinderBloc",
    "w": 225,
    "h": 300
  },
  {
    "tag": 4,
    "thumb": "2021/04/3D-Fork-Billboard-269x300.jpg",
    "full": "2021/04/3D-Fork-Billboard.jpg",
    "title": "3D-Fork-Billboard",
    "w": 269,
    "h": 300
  },
  {
    "tag": 5,
    "thumb": "2021/04/Wholistic-300x169.jpg",
    "full": "2021/04/Wholistic.jpg",
    "title": "Wholistic",
    "w": 300,
    "h": 169
  },
  {
    "tag": 5,
    "thumb": "2021/04/Royal-LePage-Interior-2-225x300.jpg",
    "full": "2021/04/Royal-LePage-Interior-2.jpg",
    "title": "Royal LePage Interior 2",
    "w": 225,
    "h": 300
  },
  {
    "tag": 5,
    "thumb": "2021/04/Freshii-McLaughlin-Interior-300x225.jpg",
    "full": "2021/04/Freshii-McLaughlin-Interior.jpg",
    "title": "Freshii McLaughlin (Interior)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 5,
    "thumb": "2021/04/cf-hotc-calgary-225x300.jpg",
    "full": "2021/04/cf-hotc-calgary.jpg",
    "title": "cf hotc calgary",
    "w": 225,
    "h": 300
  },
  {
    "tag": 5,
    "thumb": "2021/04/CPX-4DX-Hamilton-Left-300x225.jpg",
    "full": "2021/04/CPX-4DX-Hamilton-Left.jpg",
    "title": "CPX 4DX Hamilton (Left)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 5,
    "thumb": "2021/04/Caledon-Trails-White-300x225.jpg",
    "full": "2021/04/Caledon-Trails-White.jpg",
    "title": "Caledon Trails White",
    "w": 300,
    "h": 225
  },
  {
    "tag": 5,
    "thumb": "2021/04/Berkshire-Reception-Area-300x225.jpg",
    "full": "2021/04/Berkshire-Reception-Area.jpg",
    "title": "Berkshire Reception Area",
    "w": 300,
    "h": 225
  },
  {
    "tag": 5,
    "thumb": "2021/04/arista-logo-225x300.jpg",
    "full": "2021/04/arista-logo.jpg",
    "title": "arista logo",
    "w": 225,
    "h": 300
  },
  {
    "tag": 5,
    "thumb": "2021/04/4DX-Ottawa-300x225.jpg",
    "full": "2021/04/4DX-Ottawa.jpg",
    "title": "4DX Ottawa",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/weston-go-station-1-300x225.jpg",
    "full": "2021/04/weston-go-station-1.jpg",
    "title": "weston go station",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/v-2-300x225.jpg",
    "full": "2021/04/v-2.jpg",
    "title": "v",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/Lindvest-Windows-1-300x225.jpg",
    "full": "2021/04/Lindvest-Windows-1.jpg",
    "title": "Lindvest Windows",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/Karahi-Storefront-Sign-Scarborough-1-300x225.jpg",
    "full": "2021/04/Karahi-Storefront-Sign-Scarborough-1.jpg",
    "title": "Karahi Storefront Sign (Scarborough)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/IMG_1972-2-300x225.jpg",
    "full": "2021/04/IMG_1972-2.jpg",
    "title": "IMG_1972",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/HillHurst-Towns-FOXX-1-300x225.jpg",
    "full": "2021/04/HillHurst-Towns-FOXX-1.jpg",
    "title": "HillHurst Towns - FOXX",
    "w": 300,
    "h": 225
  },
  {
    "tag": 6,
    "thumb": "2021/04/Freshii-Pembina-MB-1-225x300.jpg",
    "full": "2021/04/Freshii-Pembina-MB-1.jpg",
    "title": "Freshii - Pembina , MB",
    "w": 225,
    "h": 300
  },
  {
    "tag": 6,
    "thumb": "2021/04/DocBraces-Markham-Storefront-1-300x225.jpg",
    "full": "2021/04/DocBraces-Markham-Storefront-1.jpg",
    "title": "DocBraces Markham (Storefront)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/JP_7672-copy-300x200.jpg",
    "full": "2021/04/JP_7672-copy.jpg",
    "title": "_JP_7672 copy",
    "w": 300,
    "h": 200
  },
  {
    "tag": 7,
    "thumb": "2021/04/The-Butler-Hoarding-1-300x225.jpg",
    "full": "2021/04/The-Butler-Hoarding-1.jpg",
    "title": "The Butler Hoarding 1",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/tec-hbc-hoarding-300x225.jpg",
    "full": "2021/04/tec-hbc-hoarding.jpg",
    "title": "tec hbc hoarding",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/photo-3-300x225.jpg",
    "full": "2021/04/photo-3.jpg",
    "title": "photo -3",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/North-Drive-CinderBloc-300x225.jpg",
    "full": "2021/04/North-Drive-CinderBloc.jpg",
    "title": "North Drive - CinderBloc",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/Joshua-Creek-Hoarding-300x225.jpg",
    "full": "2021/04/Joshua-Creek-Hoarding.jpg",
    "title": "Joshua Creek Hoarding",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/Joshua-Creek-Hoarding-pt-2-300x225.jpg",
    "full": "2021/04/Joshua-Creek-Hoarding-pt-2.jpg",
    "title": "Joshua Creek Hoarding pt 2",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/greenpark-hoarding23-300x225.jpg",
    "full": "2021/04/greenpark-hoarding23.jpg",
    "title": "greenpark hoarding23",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/ADI-Nautique-Hoarding-300x150.jpg",
    "full": "2021/04/ADI-Nautique-Hoarding.jpg",
    "title": "ADI Nautique Hoarding",
    "w": 300,
    "h": 150
  },
  {
    "tag": 7,
    "thumb": "2021/04/cresford--300x225.jpg",
    "full": "2021/04/cresford-.jpg",
    "title": "GEDSC DIGITAL CAMERA",
    "w": 300,
    "h": 225
  },
  {
    "tag": 7,
    "thumb": "2021/04/10-Prince-Arthur-Hoarding-300x225.jpg",
    "full": "2021/04/10-Prince-Arthur-Hoarding.jpg",
    "title": "10 Prince Arthur Hoarding",
    "w": 300,
    "h": 225
  },
  {
    "tag": 8,
    "thumb": "2021/04/stanlet-interior-display-225x300.jpg",
    "full": "2021/04/stanlet-interior-display.jpg",
    "title": "stanlet interior display",
    "w": 225,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/Solmar-ORO-Interior-Reception-2-225x300.jpg",
    "full": "2021/04/Solmar-ORO-Interior-Reception-2.jpg",
    "title": "Solmar ORO Interior Reception 2",
    "w": 225,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/skodt-barrett-300x300.jpg",
    "full": "2021/04/skodt-barrett.jpg",
    "title": "skodt barrett",
    "w": 300,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/Playdium-Brampton-Party-at-our-Place-225x300.jpg",
    "full": "2021/04/Playdium-Brampton-Party-at-our-Place.jpg",
    "title": "Playdium Brampton - 'Party at our Place'",
    "w": 225,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/Little-Canada-Graphics-Glazing-of-food-and-Quote-SGH.1.1.0-1.1.1.-225x300.jpg",
    "full": "2021/04/Little-Canada-Graphics-Glazing-of-food-and-Quote-SGH.1.1.0-1.1.1..jpg",
    "title": "Little Canada Graphics- Glazing of food and Quote SGH.1.1.0 & 1.1.1.",
    "w": 225,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/sherway-wall-graphic-300x225.jpg",
    "full": "2021/04/sherway-wall-graphic.jpg",
    "title": "sherway wall graphic",
    "w": 300,
    "h": 225
  },
  {
    "tag": 8,
    "thumb": "2021/04/Little-Canada-east-coast-300x225.jpg",
    "full": "2021/04/Little-Canada-east-coast.jpg",
    "title": "Little Canada - east coast",
    "w": 300,
    "h": 225
  },
  {
    "tag": 8,
    "thumb": "2021/04/Kruger-Timeline-Wall-7-225x300.jpg",
    "full": "2021/04/Kruger-Timeline-Wall-7.jpg",
    "title": "Kruger Timeline Wall 7",
    "w": 225,
    "h": 300
  },
  {
    "tag": 8,
    "thumb": "2021/04/gladiator-dixie-logos-300x225.jpg",
    "full": "2021/04/gladiator-dixie-logos.jpg",
    "title": "gladiator dixie logos",
    "w": 300,
    "h": 225
  },
  {
    "tag": 8,
    "thumb": "2021/04/custom-wall-300x225.jpg",
    "full": "2021/04/custom-wall.jpg",
    "title": "custom wall",
    "w": 300,
    "h": 225
  },
  {
    "tag": 8,
    "thumb": "2021/04/City-Pointe-Builders-Story-1-225x300.jpg",
    "full": "2021/04/City-Pointe-Builders-Story-1.jpg",
    "title": "City Pointe Builders Story 1",
    "w": 225,
    "h": 300
  },
  {
    "tag": 9,
    "thumb": "2021/04/IMG_1972-1-300x225.jpg",
    "full": "2021/04/IMG_1972-1.jpg",
    "title": "IMG_1972",
    "w": 300,
    "h": 225
  },
  {
    "tag": 9,
    "thumb": "2021/04/Di-Blasio-Halo-225x300.jpg",
    "full": "2021/04/Di-Blasio-Halo.jpg",
    "title": "Di Blasio Halo",
    "w": 225,
    "h": 300
  },
  {
    "tag": 9,
    "thumb": "2021/04/CPX-Yorkdale-Melt-300x225.jpg",
    "full": "2021/04/CPX-Yorkdale-Melt.jpg",
    "title": "CPX Yorkdale Melt",
    "w": 300,
    "h": 225
  },
  {
    "tag": 9,
    "thumb": "2021/04/Baylis-300x225.jpg",
    "full": "2021/04/Baylis.jpg",
    "title": "Baylis",
    "w": 300,
    "h": 225
  },
  {
    "tag": 10,
    "thumb": "2021/04/westlake-pylon-2-225x300.jpg",
    "full": "2021/04/westlake-pylon-2.jpg",
    "title": "westlake pylon (2)",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/west-adi1-300x225.jpg",
    "full": "2021/04/west-adi1.jpg",
    "title": "west adi1",
    "w": 300,
    "h": 225
  },
  {
    "tag": 10,
    "thumb": "2021/04/sixteen-mile-pylon-2-225x300.jpg",
    "full": "2021/04/sixteen-mile-pylon-2.jpg",
    "title": "sixteen mile pylon (2)",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/sherway-pylon-front-lit-225x300.jpg",
    "full": "2021/04/sherway-pylon-front-lit.jpg",
    "title": "sherway pylon front lit",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/rgc-pylon-225x300.jpg",
    "full": "2021/04/rgc-pylon.jpg",
    "title": "rgc pylon",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/MDA-Ground-Sign-2-300x225.jpg",
    "full": "2021/04/MDA-Ground-Sign-2.jpg",
    "title": "MDA Ground Sign -2",
    "w": 300,
    "h": 225
  },
  {
    "tag": 10,
    "thumb": "2021/04/MARZPYLON-224x300.jpg",
    "full": "2021/04/MARZPYLON.jpg",
    "title": "MARZPYLON",
    "w": 224,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/IMG_8950-225x300.jpg",
    "full": "2021/04/IMG_8950.jpg",
    "title": "IMG_8950",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/IMG_6267-208x300.jpg",
    "full": "2021/04/IMG_6267.jpg",
    "title": "IMG_6267",
    "w": 208,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/file3-6-225x300.jpg",
    "full": "2021/04/file3-6.jpg",
    "title": "file3-6",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/fairview-mall-225x300.jpg",
    "full": "2021/04/fairview-mall.jpg",
    "title": "fairview mall",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/cf-limeridge-pylon-1-225x300.jpg",
    "full": "2021/04/cf-limeridge-pylon-1.jpg",
    "title": "cf limeridge pylon-1",
    "w": 225,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/beiruti-pylon-169x300.jpg",
    "full": "2021/04/beiruti-pylon.jpg",
    "title": "beiruti pylon",
    "w": 169,
    "h": 300
  },
  {
    "tag": 10,
    "thumb": "2021/04/Alterra-b-300x225.jpg",
    "full": "2021/04/Alterra-b.jpg",
    "title": "Alterra (b)",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/Wayfinding-2-TRR-Barrie-2-300x225.jpg",
    "full": "2021/04/Wayfinding-2-TRR-Barrie-2.jpg",
    "title": "Wayfinding 2 - TRR Barrie 2",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/tec-queen-entrance-300x225.jpg",
    "full": "2021/04/tec-queen-entrance.jpg",
    "title": "tec queen entrance",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/sherway-directional-pole-2-225x300.jpg",
    "full": "2021/04/sherway-directional-pole-2.jpg",
    "title": "sherway directional pole (2)",
    "w": 225,
    "h": 300
  },
  {
    "tag": 11,
    "thumb": "2021/04/sherway-directional-225x300.jpg",
    "full": "2021/04/sherway-directional.jpg",
    "title": "sherway directional",
    "w": 225,
    "h": 300
  },
  {
    "tag": 11,
    "thumb": "2021/04/rbc-centre-300x225.jpg",
    "full": "2021/04/rbc-centre.jpg",
    "title": "rbc centre",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/Little-Canada-Led-Map-SG.2.1.7-300x225.jpg",
    "full": "2021/04/Little-Canada-Led-Map-SG.2.1.7.jpg",
    "title": "Little Canada - Led Map - SG.2.1.7",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/Little-Canada-LED-Escalator-B3-SG.2.6.2-300x225.jpg",
    "full": "2021/04/Little-Canada-LED-Escalator-B3-SG.2.6.2.jpg",
    "title": "Little Canada - LED Escalator B3 - SG.2.6.2",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/Fairview-Washroom-Signs-8-300x225.jpg",
    "full": "2021/04/Fairview-Washroom-Signs-8.jpg",
    "title": "Fairview Washroom Signs 8",
    "w": 300,
    "h": 225
  },
  {
    "tag": 11,
    "thumb": "2021/04/cf-sherway-parking-signage-300x225.jpg",
    "full": "2021/04/cf-sherway-parking-signage.jpg",
    "title": "cf sherway parking signage",
    "w": 300,
    "h": 225
  }
];
