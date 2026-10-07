-- The "Our Work" entries: the grid on /services/ and one /portfolio/<slug>/
-- page each, edited at /admin/work/. They were src/data/portfolio.ts, which
-- stays in the repo as the seed below and as the fallback when Postgres is
-- unreachable (src/lib/portfolio-source.ts).
--
-- Seeded verbatim from portfolio.ts by a one-off script, in site order.
-- updated_at is seeded with WordPress's own post_modified dates from
-- src/data/lastmod.ts, because the portfolio sitemap now reads its <lastmod>
-- from this column: a seed stamped with the migration date would tell Google
-- all twelve pages changed today.

CREATE TABLE IF NOT EXISTS portfolio_items (
  id           BIGINT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- The address, /portfolio/<slug>/. Fixed once created: the admin does not
  -- offer to change it, so an edit never breaks a link someone saved.
  slug         TEXT    NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        TEXT    NOT NULL,
  body         TEXT    NOT NULL DEFAULT '',
  categories   TEXT[]  NOT NULL DEFAULT '{}',
  -- Either uploads-relative ("2021/04/x.jpg", served from /media) for the
  -- seeded entries, or "/work-media/<name>" for images uploaded in the admin,
  -- which live in the uploads bucket. `grid` is the flip box background,
  -- `image` the detail page hero; an upload sets both to the same file.
  grid         TEXT    NOT NULL,
  image        TEXT    NOT NULL,
  image_width  INTEGER NOT NULL,
  image_height INTEGER NOT NULL,
  position     INTEGER NOT NULL,
  -- Content changes only. Reordering does not touch it.
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO portfolio_items
  (slug, title, body, categories, grid, image, image_width, image_height, position, updated_at)
VALUES
  ('wayfinding', 'Wayfinding', 'When it comes to large locations, such as malls, warehouses or event grounds, wayfinding signs are some of the most important components. Wayfinding signs help orient your employees, visitors and patrons so that they can reach their desired location safely and easily.', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/IMG_20151105_131919_hdr.jpg', '2021/04/IMG_20151105_131919_hdr.jpg', 791, 791, 1, '2021-04-22T14:36:29+00:00'),
  ('pylon-signs', 'Pylon Signs', 'Aside from a storefront or fascia sign, one of the most important components of a large retail location, such as a mall or stripmall, is the streetside pylon sign. This is the best way to let passersby and motorists know what kinds of establishments are featured at your location.', ARRAY['Exterior']::text[],
   '2021/04/Pylon_Featured.jpg', '2021/04/Pylon_Featured-1024x746.jpg', 1024, 746, 2, '2021-04-22T14:37:51+00:00'),
  ('push-thru-signs', 'Push Thru Signs', '', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/IMG_20141128_123815.jpg', '2021/04/IMG_20141128_123815.jpg', 791, 791, 3, '2021-04-22T14:39:03+00:00'),
  ('interiors', 'Interiors', 'Not only do we specialize in fabricating and installing interior signage, we work with you to ensure that you have a completed space that looks beautiful as a whole. Interior designers we are not, but when it comes to creative solutions and expert installations, we can make your vision a reality.', ARRAY['Interior']::text[],
   '2021/04/arbors2.jpg', '2021/04/arbors2-1024x576.jpg', 1024, 576, 4, '2021-04-22T14:40:23+00:00'),
  ('hoarding-signs', 'Hoarding Signs', 'Construction hoarding isn’t just a great spot for first-party advertising, it’s also legally necessary for most construction sites. We work directly with the municipality, engineers, and you to ensure your hoarding is safe and to code. Construction hoarding surrounding a site also provides many opportunities for you to get creative and get your new development noticed!', ARRAY['Exterior']::text[],
   '2021/04/IMG_1767.jpg', '2021/04/IMG_1767-1024x768.jpg', 1024, 768, 5, '2021-04-22T14:41:57+00:00'),
  ('cut-out-letters', 'Cut Out letters', 'Our cut-out letters can be fabricated out of a number of materials, including acrylic, plastic, glass, and more. This is a great option for storefronts, interior displays and window displays. Any design or font is possible.', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/ROC-9.jpg', '2021/04/ROC-9-1024x685.jpg', 1024, 685, 6, '2021-04-22T14:43:14+00:00'),
  ('construction-development-sales-offices', 'Construction, Development & Sales Offices', 'In addition to construction hoarding, your worksite will need all sorts of other signs, including wayfinding signs, safety warnings, traffic diversions, and other promotional materials.', ARRAY['Exterior']::text[],
   '2021/04/fortune_exteriro.jpg', '2021/04/fortune_exteriro-1024x366.jpg', 1024, 366, 7, '2021-04-22T14:44:28+00:00'),
  ('awnings', 'Awnings', 'Foot traffic is super important to most retail locations, and an awning is a great way to get noticed. Plus, your patrons will be thankful for the shelter from the sun and rain, and you can confidently display products outdoors without fear of damage from natural elements.', ARRAY['Exterior']::text[],
   '2021/04/IMG_20140701_164233.jpg', '2021/04/IMG_20140701_164233-1024x576.jpg', 1024, 576, 8, '2021-04-22T14:45:46+00:00'),
  ('fascia-signs', 'Fascia Signs', 'A fascia sign is signage typically found above a storefront or any other establishment to promote a business or an event. This is where your brand lives. You may have your brand identity down on paper and digitally, but we can make it tangible.', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/v.jpg', '2021/04/v-1024x768.jpg', 1024, 768, 9, '2021-04-22T14:47:07+00:00'),
  ('custom-signage', 'Custom Signage', 'Our professional tradespeople and up-to-date technologies make every imaging project possible. If you have an idea in mind, we can find a way to make it happen.', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/IMG_3193.jpg', '2021/04/IMG_3193-768x1024.jpg', 768, 1024, 10, '2021-04-22T14:48:35+00:00'),
  ('channel-letters', 'Channel Letters', 'Channel lettering is a custom process where 3D letters are fabricated individually out of metal or plastic. There are many ways to further customize channel letters; for example, we can install LED lights in each individual letter. Channel lettering is a handmade process, so we definitely consider it an artform, and we have some of the best artists in the industry.', ARRAY['Exterior', 'Interior']::text[],
   '2021/04/GEDC0426-scaled.jpg', '2021/04/GEDC0426-1024x768.jpg', 1024, 768, 11, '2021-04-22T14:50:12+00:00'),
  ('banners', 'Banners', 'Whether you need a short banner or the longest banner, we have you covered. We print your banner design on very durable materials that easily withstand exterior elements. We can even install your banners on a construction crane.', ARRAY['Exterior']::text[],
   '2021/04/128A2339.jpeg', '2021/04/128A2339-1024x751.jpeg', 1024, 751, 12, '2021-04-22T14:52:44+00:00')
ON CONFLICT (slug) DO NOTHING;
