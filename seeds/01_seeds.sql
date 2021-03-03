INSERT INTO users (name, email, password)
  VALUES ('Beth Harmon', 'chessqueen@gmail.com', '$2a$10$FB/  BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Leroy Jenkins', 'allornothing@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Dexter Morgan', 'moralityandmayhem@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ('Seed Lamp', 'description', 'https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697', 'https://www.memphisveterinaryspecialists.com/files/best-breeds-of-house-cats-memphis-vet-1-1.jpeg', 3, 4, 5, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', '83680'), ('Laurel', 'description', 'https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697', 'https://www.memphisveterinaryspecialists.com/files/best-breeds-of-house-cats-memphis-vet-1-1.jpeg', 6, 10, 7, 'Canada', '894 Jimbob Boolevard', 'Leekspin', 'P.E.I.', '56757'), ('Bourgeoisie', 'description', 'https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697', 'https://www.memphisveterinaryspecialists.com/files/best-breeds-of-house-cats-memphis-vet-1-1.jpeg', 5, 6, 8, 'Canada', '651 Namaste Croissant', 'Leedlelee', 'Manitoba', '78978');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES ('2019-06-21', '2019-10-01', 3, 2), ('2029-07-21', '2019-11-01', 2, 1),('2024-05-21', '2024-06-07', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES (2, 3, 1, 5, 'messages'), (1, 2, 2, 4, 'messages'), (2, 3, 1, 4, 'messages');