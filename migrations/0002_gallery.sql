-- The /gallery/ page content, moved into D1.
--
-- Seeded verbatim from src/data/gallery.ts, which was scraped from the live
-- Elementor gallery and stays in the repo as the fallback: the build reads
-- these rows when it can reach D1 and the module when it cannot, so a build
-- never depends on the database being reachable. See src/lib/gallery-source.ts.
--
-- `position` is explicit rather than implied by id. The gallery renders in a
-- fixed order matching the original site, and ordering by an autoincrement id
-- would quietly start lying the first time a row is replaced.

CREATE TABLE IF NOT EXISTS gallery_filters (
  id       INTEGER PRIMARY KEY,   -- the tag index items refer to
  name     TEXT    NOT NULL UNIQUE,
  position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  position  INTEGER NOT NULL,
  filter_id INTEGER NOT NULL REFERENCES gallery_filters (id),
  -- uploads-relative, resolved through media() at render time, so these rows
  -- do not care where the images are actually served from.
  thumb     TEXT    NOT NULL,
  full      TEXT    NOT NULL,
  title     TEXT    NOT NULL,
  w         INTEGER NOT NULL,
  h         INTEGER NOT NULL,
  UNIQUE (full)
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_order  ON gallery_items (position);
CREATE INDEX IF NOT EXISTS idx_gallery_items_filter ON gallery_items (filter_id, position);

INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (0, 'Awning', 0);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (1, 'Banners', 1);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (2, 'Channel Letters', 2);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (3, 'Construction', 3);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (4, 'Custom', 4);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (5, 'Cut Out Letters', 5);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (6, 'Fascia', 6);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (7, 'Hoarding', 7);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (8, 'Interiors', 8);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (9, 'Push thru', 9);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (10, 'Pylon', 10);
INSERT OR IGNORE INTO gallery_filters (id, name, position) VALUES (11, 'Wayfinding', 11);

INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (0, 0, '2021/04/Upper-Oaks-Awning-Full-Decal-Overlays-300x225.jpg', '2021/04/Upper-Oaks-Awning-Full-Decal-Overlays.jpg', 'Upper Oaks Awning Full Decal Overlays', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (1, 0, '2021/04/riveracanopy-225x300.jpg', '2021/04/riveracanopy.jpg', 'riveracanopy', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (2, 0, '2021/04/Greenpark-Dunwest-Windows-300x225.jpg', '2021/04/Greenpark-Dunwest-Windows.jpg', 'Greenpark Dunwest Windows', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (3, 0, '2021/04/Port-Credit-Mortgage-225x300.jpg', '2021/04/Port-Credit-Mortgage.jpg', 'Port Credit Mortgage', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (4, 0, '2021/04/bamiyancanopy-225x300.jpg', '2021/04/bamiyancanopy.jpg', 'bamiyancanopy', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (5, 1, '2021/04/sport-chek-banner-300x225.jpg', '2021/04/sport-chek-banner.jpg', 'sport chek banner', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (6, 1, '2021/04/Playdium-Banners-Miss.-2-300x225.jpg', '2021/04/Playdium-Banners-Miss.-2.jpg', 'Playdium Banners Miss. 2', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (7, 1, '2021/04/Pemberton-Banner-300x224.jpg', '2021/04/Pemberton-Banner.jpg', 'Pemberton Banner', 300, 224);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (8, 1, '2021/04/Paradise-BNHS-3x9-Banner-Flags-225x300.jpg', '2021/04/Paradise-BNHS-3x9-Banner-Flags.jpg', 'Paradise BNHS 3x9 Banner Flags', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (9, 1, '2021/04/Paradise-Banner-7x28-1-300x225.jpg', '2021/04/Paradise-Banner-7x28-1.jpg', 'Paradise Banner 7x28', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (10, 1, '2021/04/Greenpark-Charisma-SignComp-2104-14x53-b-300x225.jpg', '2021/04/Greenpark-Charisma-SignComp-2104-14x53-b.jpg', 'Greenpark Charisma SignComp 2104 14x53 b', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (11, 1, '2021/04/Green-Park-Large-Banner-300x225.jpg', '2021/04/Green-Park-Large-Banner.jpg', 'GE DIGITAL CAMERA', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (12, 1, '2021/04/Community-Builders-8x20-banner-300x225.jpg', '2021/04/Community-Builders-8x20-banner.jpg', 'Community Builders 8x20 banner', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (13, 1, '2021/04/Coming-Soon-Banner-TRR-Barrie-300x225.jpg', '2021/04/Coming-Soon-Banner-TRR-Barrie.jpg', 'Coming Soon Banner - TRR Barrie', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (14, 1, '2021/04/Banners-Roller-Blinds-1-300x225.jpg', '2021/04/Banners-Roller-Blinds-1.jpg', 'Banners Roller Blinds 1', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (15, 2, '2021/04/t-booth-300x225.jpg', '2021/04/t-booth.jpg', 't booth', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (16, 2, '2021/04/Little-Canada-Hindi-Fix-fulll-wall-300x225.jpg', '2021/04/Little-Canada-Hindi-Fix-fulll-wall.jpg', 'Little Canada Hindi Fix (fulll wall)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (17, 2, '2021/04/Kim-Smiley-Front-300x225.jpg', '2021/04/Kim-Smiley-Front.jpg', 'Kim Smiley (Front)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (18, 2, '2021/04/link-2-night-shot-300x225.jpg', '2021/04/link-2-night-shot.jpg', 'link 2 night shot', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (19, 2, '2021/04/IMG_20161203_165039-300x225.jpg', '2021/04/IMG_20161203_165039.jpg', 'IMG_20161203_165039', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (20, 2, '2021/04/Entrance-3-Sherway-Gardens-South-East-300x225.jpg', '2021/04/Entrance-3-Sherway-Gardens-South-East.jpg', 'Entrance 3 - Sherway Gardens (South East)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (21, 2, '2021/04/cf-limeridge-entrance-4-300x225.jpg', '2021/04/cf-limeridge-entrance-4.jpg', 'cf limeridge entrance 4', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (22, 2, '2021/04/CAA-Exterior-SIDE-300x225.jpg', '2021/04/CAA-Exterior-SIDE.jpg', 'CAA - Exterior (SIDE)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (23, 2, '2021/04/bluridge-dental-night-300x225.jpg', '2021/04/bluridge-dental-night.jpg', 'bluridge dental night', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (24, 2, '2021/04/Baylis-Building-Sign-Mississauga-300x225.jpg', '2021/04/Baylis-Building-Sign-Mississauga.jpg', 'Baylis - Building Sign - Mississauga', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (25, 3, '2021/04/Solmar-ORO-Interior-Framed-300x225.jpg', '2021/04/Solmar-ORO-Interior-Framed.jpg', 'Solmar ORO Interior Framed', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (26, 3, '2021/04/ROC-10-300x201.jpg', '2021/04/ROC-10.jpg', 'ROC 10', 300, 201);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (27, 3, '2021/04/richlands--300x225.jpg', '2021/04/richlands-.jpg', 'richlands', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (28, 3, '2021/04/Paradise-Beechwood-225x300.jpg', '2021/04/Paradise-Beechwood.jpg', 'Paradise Beechwood', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (29, 3, '2021/04/MAXX-Reception-Wall-300x225.jpg', '2021/04/MAXX-Reception-Wall.jpg', 'MAXX Reception Wall', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (30, 3, '2021/04/Mattamy-Homes-front-300x225.jpg', '2021/04/Mattamy-Homes-front.jpg', 'Mattamy Homes (front)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (31, 3, '2021/04/liberty-interior-300x225.jpg', '2021/04/liberty-interior.jpg', 'liberty interior', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (32, 3, '2021/04/IMG00282-20120828-1525-300x225.jpg', '2021/04/IMG00282-20120828-1525.jpg', 'IMG00282-20120828-1525', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (33, 3, '2021/04/Greenpark-Mountainview-Heights-Lifestyle-Pics-Waterfall-300x225.jpg', '2021/04/Greenpark-Mountainview-Heights-Lifestyle-Pics-Waterfall.jpg', 'Greenpark Mountainview Heights Lifestyle Pics & Waterfall', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (34, 3, '2021/04/Greenpark-Charisma-GS-300x225.jpg', '2021/04/Greenpark-Charisma-GS.jpg', 'Greenpark Charisma GS', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (35, 3, '2021/04/Berkshire-LED-Boxes-300x225.jpg', '2021/04/Berkshire-LED-Boxes.jpg', 'Berkshire LED Boxes', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (36, 3, '2021/04/Arista-Homes-300x169.jpg', '2021/04/Arista-Homes.jpg', 'Arista Homes', 300, 169);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (37, 4, '2021/04/water-tower-1-225x300.jpg', '2021/04/water-tower-1.jpg', 'water tower-1', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (38, 4, '2021/04/Trenton-North-Westbound-Fridge-Front-Freshii-ONroute-300x225.jpg', '2021/04/Trenton-North-Westbound-Fridge-Front-Freshii-ONroute.jpg', 'Trenton North Westbound - Fridge (Front) - Freshii ONroute', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (39, 4, '2021/04/softmoc-fairview-225x300.jpg', '2021/04/softmoc-fairview.jpg', 'softmoc fairview', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (40, 4, '2021/04/pinnacle-channel-letters-1-300x225.jpg', '2021/04/pinnacle-channel-letters-1.jpg', 'pinnacle channel letters', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (41, 4, '2021/04/perrier-225x300.jpg', '2021/04/perrier.jpg', 'perrier', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (42, 4, '2021/04/oneyonge1-300x225.jpg', '2021/04/oneyonge1.jpg', 'oneyonge1', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (43, 4, '2021/04/one-yonge-300x216.jpg', '2021/04/one-yonge.jpg', 'one yonge', 300, 216);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (44, 4, '2021/04/curved-led-screen-225x300.jpg', '2021/04/curved-led-screen.jpg', 'curved led screen', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (45, 4, '2021/04/CF-Valet-Sherway-300x225.jpg', '2021/04/CF-Valet-Sherway.jpg', 'CF Valet Sherway', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (46, 4, '2021/04/cf-fairview-2-300x225.jpg', '2021/04/cf-fairview-2.jpg', 'cf fairview (2)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (47, 4, '2021/04/allvision-cladding-225x300.jpg', '2021/04/allvision-cladding.jpg', 'allvision cladding', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (48, 4, '2021/04/10-Prince-Arthur-3D-10-CinderBloc-225x300.jpg', '2021/04/10-Prince-Arthur-3D-10-CinderBloc.jpg', '10 Prince Arthur 3D 10 CinderBloc', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (49, 4, '2021/04/3D-Fork-Billboard-269x300.jpg', '2021/04/3D-Fork-Billboard.jpg', '3D-Fork-Billboard', 269, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (50, 5, '2021/04/Wholistic-300x169.jpg', '2021/04/Wholistic.jpg', 'Wholistic', 300, 169);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (51, 5, '2021/04/Royal-LePage-Interior-2-225x300.jpg', '2021/04/Royal-LePage-Interior-2.jpg', 'Royal LePage Interior 2', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (52, 5, '2021/04/Freshii-McLaughlin-Interior-300x225.jpg', '2021/04/Freshii-McLaughlin-Interior.jpg', 'Freshii McLaughlin (Interior)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (53, 5, '2021/04/cf-hotc-calgary-225x300.jpg', '2021/04/cf-hotc-calgary.jpg', 'cf hotc calgary', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (54, 5, '2021/04/CPX-4DX-Hamilton-Left-300x225.jpg', '2021/04/CPX-4DX-Hamilton-Left.jpg', 'CPX 4DX Hamilton (Left)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (55, 5, '2021/04/Caledon-Trails-White-300x225.jpg', '2021/04/Caledon-Trails-White.jpg', 'Caledon Trails White', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (56, 5, '2021/04/Berkshire-Reception-Area-300x225.jpg', '2021/04/Berkshire-Reception-Area.jpg', 'Berkshire Reception Area', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (57, 5, '2021/04/arista-logo-225x300.jpg', '2021/04/arista-logo.jpg', 'arista logo', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (58, 5, '2021/04/4DX-Ottawa-300x225.jpg', '2021/04/4DX-Ottawa.jpg', '4DX Ottawa', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (59, 6, '2021/04/weston-go-station-1-300x225.jpg', '2021/04/weston-go-station-1.jpg', 'weston go station', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (60, 6, '2021/04/v-2-300x225.jpg', '2021/04/v-2.jpg', 'v', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (61, 6, '2021/04/Lindvest-Windows-1-300x225.jpg', '2021/04/Lindvest-Windows-1.jpg', 'Lindvest Windows', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (62, 6, '2021/04/Karahi-Storefront-Sign-Scarborough-1-300x225.jpg', '2021/04/Karahi-Storefront-Sign-Scarborough-1.jpg', 'Karahi Storefront Sign (Scarborough)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (63, 6, '2021/04/IMG_1972-2-300x225.jpg', '2021/04/IMG_1972-2.jpg', 'IMG_1972', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (64, 6, '2021/04/HillHurst-Towns-FOXX-1-300x225.jpg', '2021/04/HillHurst-Towns-FOXX-1.jpg', 'HillHurst Towns - FOXX', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (65, 6, '2021/04/Freshii-Pembina-MB-1-225x300.jpg', '2021/04/Freshii-Pembina-MB-1.jpg', 'Freshii - Pembina , MB', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (66, 6, '2021/04/DocBraces-Markham-Storefront-1-300x225.jpg', '2021/04/DocBraces-Markham-Storefront-1.jpg', 'DocBraces Markham (Storefront)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (67, 7, '2021/04/JP_7672-copy-300x200.jpg', '2021/04/JP_7672-copy.jpg', '_JP_7672 copy', 300, 200);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (68, 7, '2021/04/The-Butler-Hoarding-1-300x225.jpg', '2021/04/The-Butler-Hoarding-1.jpg', 'The Butler Hoarding 1', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (69, 7, '2021/04/tec-hbc-hoarding-300x225.jpg', '2021/04/tec-hbc-hoarding.jpg', 'tec hbc hoarding', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (70, 7, '2021/04/photo-3-300x225.jpg', '2021/04/photo-3.jpg', 'photo -3', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (71, 7, '2021/04/North-Drive-CinderBloc-300x225.jpg', '2021/04/North-Drive-CinderBloc.jpg', 'North Drive - CinderBloc', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (72, 7, '2021/04/Joshua-Creek-Hoarding-300x225.jpg', '2021/04/Joshua-Creek-Hoarding.jpg', 'Joshua Creek Hoarding', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (73, 7, '2021/04/Joshua-Creek-Hoarding-pt-2-300x225.jpg', '2021/04/Joshua-Creek-Hoarding-pt-2.jpg', 'Joshua Creek Hoarding pt 2', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (74, 7, '2021/04/greenpark-hoarding23-300x225.jpg', '2021/04/greenpark-hoarding23.jpg', 'greenpark hoarding23', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (75, 7, '2021/04/ADI-Nautique-Hoarding-300x150.jpg', '2021/04/ADI-Nautique-Hoarding.jpg', 'ADI Nautique Hoarding', 300, 150);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (76, 7, '2021/04/cresford--300x225.jpg', '2021/04/cresford-.jpg', 'GEDSC DIGITAL CAMERA', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (77, 7, '2021/04/10-Prince-Arthur-Hoarding-300x225.jpg', '2021/04/10-Prince-Arthur-Hoarding.jpg', '10 Prince Arthur Hoarding', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (78, 8, '2021/04/stanlet-interior-display-225x300.jpg', '2021/04/stanlet-interior-display.jpg', 'stanlet interior display', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (79, 8, '2021/04/Solmar-ORO-Interior-Reception-2-225x300.jpg', '2021/04/Solmar-ORO-Interior-Reception-2.jpg', 'Solmar ORO Interior Reception 2', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (80, 8, '2021/04/skodt-barrett-300x300.jpg', '2021/04/skodt-barrett.jpg', 'skodt barrett', 300, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (81, 8, '2021/04/Playdium-Brampton-Party-at-our-Place-225x300.jpg', '2021/04/Playdium-Brampton-Party-at-our-Place.jpg', 'Playdium Brampton - ''Party at our Place''', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (82, 8, '2021/04/Little-Canada-Graphics-Glazing-of-food-and-Quote-SGH.1.1.0-1.1.1.-225x300.jpg', '2021/04/Little-Canada-Graphics-Glazing-of-food-and-Quote-SGH.1.1.0-1.1.1..jpg', 'Little Canada Graphics- Glazing of food and Quote SGH.1.1.0 & 1.1.1.', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (83, 8, '2021/04/sherway-wall-graphic-300x225.jpg', '2021/04/sherway-wall-graphic.jpg', 'sherway wall graphic', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (84, 8, '2021/04/Little-Canada-east-coast-300x225.jpg', '2021/04/Little-Canada-east-coast.jpg', 'Little Canada - east coast', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (85, 8, '2021/04/Kruger-Timeline-Wall-7-225x300.jpg', '2021/04/Kruger-Timeline-Wall-7.jpg', 'Kruger Timeline Wall 7', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (86, 8, '2021/04/gladiator-dixie-logos-300x225.jpg', '2021/04/gladiator-dixie-logos.jpg', 'gladiator dixie logos', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (87, 8, '2021/04/custom-wall-300x225.jpg', '2021/04/custom-wall.jpg', 'custom wall', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (88, 8, '2021/04/City-Pointe-Builders-Story-1-225x300.jpg', '2021/04/City-Pointe-Builders-Story-1.jpg', 'City Pointe Builders Story 1', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (89, 9, '2021/04/IMG_1972-1-300x225.jpg', '2021/04/IMG_1972-1.jpg', 'IMG_1972', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (90, 9, '2021/04/Di-Blasio-Halo-225x300.jpg', '2021/04/Di-Blasio-Halo.jpg', 'Di Blasio Halo', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (91, 9, '2021/04/CPX-Yorkdale-Melt-300x225.jpg', '2021/04/CPX-Yorkdale-Melt.jpg', 'CPX Yorkdale Melt', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (92, 9, '2021/04/Baylis-300x225.jpg', '2021/04/Baylis.jpg', 'Baylis', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (93, 10, '2021/04/westlake-pylon-2-225x300.jpg', '2021/04/westlake-pylon-2.jpg', 'westlake pylon (2)', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (94, 10, '2021/04/west-adi1-300x225.jpg', '2021/04/west-adi1.jpg', 'west adi1', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (95, 10, '2021/04/sixteen-mile-pylon-2-225x300.jpg', '2021/04/sixteen-mile-pylon-2.jpg', 'sixteen mile pylon (2)', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (96, 10, '2021/04/sherway-pylon-front-lit-225x300.jpg', '2021/04/sherway-pylon-front-lit.jpg', 'sherway pylon front lit', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (97, 10, '2021/04/rgc-pylon-225x300.jpg', '2021/04/rgc-pylon.jpg', 'rgc pylon', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (98, 10, '2021/04/MDA-Ground-Sign-2-300x225.jpg', '2021/04/MDA-Ground-Sign-2.jpg', 'MDA Ground Sign -2', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (99, 10, '2021/04/MARZPYLON-224x300.jpg', '2021/04/MARZPYLON.jpg', 'MARZPYLON', 224, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (100, 10, '2021/04/IMG_8950-225x300.jpg', '2021/04/IMG_8950.jpg', 'IMG_8950', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (101, 10, '2021/04/IMG_6267-208x300.jpg', '2021/04/IMG_6267.jpg', 'IMG_6267', 208, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (102, 10, '2021/04/file3-6-225x300.jpg', '2021/04/file3-6.jpg', 'file3-6', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (103, 10, '2021/04/fairview-mall-225x300.jpg', '2021/04/fairview-mall.jpg', 'fairview mall', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (104, 10, '2021/04/cf-limeridge-pylon-1-225x300.jpg', '2021/04/cf-limeridge-pylon-1.jpg', 'cf limeridge pylon-1', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (105, 10, '2021/04/beiruti-pylon-169x300.jpg', '2021/04/beiruti-pylon.jpg', 'beiruti pylon', 169, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (106, 10, '2021/04/Alterra-b-300x225.jpg', '2021/04/Alterra-b.jpg', 'Alterra (b)', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (107, 11, '2021/04/Wayfinding-2-TRR-Barrie-2-300x225.jpg', '2021/04/Wayfinding-2-TRR-Barrie-2.jpg', 'Wayfinding 2 - TRR Barrie 2', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (108, 11, '2021/04/tec-queen-entrance-300x225.jpg', '2021/04/tec-queen-entrance.jpg', 'tec queen entrance', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (109, 11, '2021/04/sherway-directional-pole-2-225x300.jpg', '2021/04/sherway-directional-pole-2.jpg', 'sherway directional pole (2)', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (110, 11, '2021/04/sherway-directional-225x300.jpg', '2021/04/sherway-directional.jpg', 'sherway directional', 225, 300);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (111, 11, '2021/04/rbc-centre-300x225.jpg', '2021/04/rbc-centre.jpg', 'rbc centre', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (112, 11, '2021/04/Little-Canada-Led-Map-SG.2.1.7-300x225.jpg', '2021/04/Little-Canada-Led-Map-SG.2.1.7.jpg', 'Little Canada - Led Map - SG.2.1.7', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (113, 11, '2021/04/Little-Canada-LED-Escalator-B3-SG.2.6.2-300x225.jpg', '2021/04/Little-Canada-LED-Escalator-B3-SG.2.6.2.jpg', 'Little Canada - LED Escalator B3 - SG.2.6.2', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (114, 11, '2021/04/Fairview-Washroom-Signs-8-300x225.jpg', '2021/04/Fairview-Washroom-Signs-8.jpg', 'Fairview Washroom Signs 8', 300, 225);
INSERT OR IGNORE INTO gallery_items (position, filter_id, thumb, full, title, w, h) VALUES (115, 11, '2021/04/cf-sherway-parking-signage-300x225.jpg', '2021/04/cf-sherway-parking-signage.jpg', 'cf sherway parking signage', 300, 225);
