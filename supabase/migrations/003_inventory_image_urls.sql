with image_updates (product_id, image) as (
  values
    (1, 'https://i.ibb.co/Hjh34G5/cristiano1.png'),
    (2, 'https://i.ibb.co/LdPdmVR3/cristiano2.png'),
    (3, 'https://i.ibb.co/Ng00HkZn/cristiano3.png'),
    (4, 'https://i.ibb.co/35p4jmSC/cristiano4.png'),
    (5, 'https://i.ibb.co/dwd0VQBw/messi1.png'),
    (6, 'https://i.ibb.co/8DpxMbfW/ronaldinho1.png'),
    (7, 'https://i.ibb.co/ycY0cprD/neymar1.png'),
    (8, 'https://i.ibb.co/q3fPrwX0/neymar2.png'),
    (9, 'https://i.ibb.co/2YL4qzcn/neymar3.png'),
    (10, 'https://i.ibb.co/5WQ3YbS5/girlfriend1.png'),
    (11, 'https://i.ibb.co/vnfNY4d/girlfriend2.png'),
    (12, 'https://i.ibb.co/ksbJDcJ5/girlfriend3.png'),
    (13, 'https://i.ibb.co/JRg3Wr1n/girlfriend4.png'),
    (14, 'https://i.ibb.co/prxtgndS/girlfriend5.png'),
    (16, 'https://i.ibb.co/jkC9Mytc/gym1.png'),
    (17, 'https://i.ibb.co/RpNYHrYg/gym2.png'),
    (18, 'https://i.ibb.co/FbfxvMGt/gym3.png'),
    (19, 'https://i.ibb.co/wnF88Td/gym4.png'),
    (20, 'https://i.ibb.co/HLssNhcB/gym5.png'),
    (21, 'https://i.ibb.co/CpdNr9Lv/gym6.png'),
    (22, 'https://i.ibb.co/pj7hX6zf/gym7.png'),
    (23, 'https://i.ibb.co/vxkCy2CB/gym8.png'),
    (24, 'https://i.ibb.co/XZzSkmwH/gym9.png'),
    (25, 'https://i.ibb.co/tpgSs3DG/gym10.png'),
    (26, 'https://i.ibb.co/MXKd8HF/messi2.png'),
    (27, 'https://i.ibb.co/xqBXjMgx/messi3.png'),
    (28, 'https://i.ibb.co/9mndN4qp/messi4.png'),
    (29, 'https://i.ibb.co/60R4hCqr/messi5.png'),
    (30, 'https://i.ibb.co/KjHXyr83/gym11.png'),
    (31, 'https://i.ibb.co/prW0VGhd/gym12.png'),
    (32, 'https://i.ibb.co/GQHmzh08/gym13.png'),
    (33, 'https://i.ibb.co/h1KPk8kJ/gym14.png'),
    (34, 'https://i.ibb.co/j9y48GGJ/gym15.png'),
    (35, 'https://i.ibb.co/HTWqcsmY/gym17.png'),
    (36, 'https://i.ibb.co/207qpRwY/gym18.png'),
    (37, 'https://i.ibb.co/JWTJ0v3r/gym19.png'),
    (38, 'https://i.ibb.co/Gv4wvWwv/gym20.png'),
    (39, 'https://i.ibb.co/8gksJw5W/gym21.png'),
    (40, 'https://i.ibb.co/846sf0vj/gym22.png'),
    (41, 'https://i.ibb.co/Cp0Pd6fD/messi6.png'),
    (42, 'https://i.ibb.co/ynLVPSqm/messi7.png'),
    (43, 'https://i.ibb.co/dwN0Fs1N/cristiano5.png'),
    (44, 'https://i.ibb.co/60WkKtvz/cristiano6.png')
)
update public.admin_inventory_items inventory
set image = image_updates.image,
    updated_at = now()
from image_updates
where inventory.product_id = image_updates.product_id;

notify pgrst, 'reload schema';
