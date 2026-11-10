const P = (number, name, short, position, country, age, since, contract, academy = false, role = '') =>
  ({ number, name, short, position, country, age, since, contract, academy, role });

const PLAYERS = [
  P(1, 'Joan García', 'Joan García', 'Goalkeeper', 'Spain', 25, 2025, 2031),
  P(13, 'Wojciech Szczęsny', 'Szczęsny', 'Goalkeeper', 'Poland', 36, 2024, 2027),
  P(25, 'Dominik Livaković', 'Livaković', 'Goalkeeper', 'Croatia', 31, 2026, 2030),
  P(2, 'João Cancelo', 'Cancelo', 'Defender', 'Portugal', 32, 2026, 2029),
  P(3, 'Alejandro Balde', 'Balde', 'Defender', 'Spain', 22, 2022, 2028, true),
  P(5, 'Pau Cubarsí', 'Cubarsí', 'Defender', 'Spain', 19, 2024, 2029, true),
  P(12, 'Xavi Espart', 'Espart', 'Defender', 'Spain', 19, 2025, 2028, true),
  P(15, 'Andreas Christensen', 'Christensen', 'Defender', 'Denmark', 30, 2022, 2028),
  P(18, 'Gerard Martín', 'G. Martín', 'Defender', 'Spain', 24, 2023, 2028, true),
  P(23, 'Jules Koundé', 'Koundé', 'Defender', 'France', 27, 2022, 2030),
  P(24, 'Eric García', 'E. García', 'Defender', 'Spain', 25, 2021, 2031, true, 'Third captain'),
  P(4, 'Brian Fariñas', 'Fariñas', 'Midfielder', 'Spain', 20, 2026, 2028, true),
  P(6, 'Gavi', 'Gavi', 'Midfielder', 'Spain', 22, 2021, 2030, true),
  P(7, 'Fermín López', 'Fermín', 'Midfielder', 'Spain', 23, 2023, 2031, true),
  P(8, 'Pedri', 'Pedri', 'Midfielder', 'Spain', 23, 2020, 2030, false, 'Vice-captain'),
  P(16, 'Rodri', 'Rodri', 'Midfielder', 'Spain', 30, 2026, 2030),
  P(20, 'Dani Olmo', 'Olmo', 'Midfielder', 'Spain', 28, 2024, 2030, true),
  P(21, 'Frenkie de Jong', 'De Jong', 'Midfielder', 'Netherlands', 29, 2019, 2029, false, 'Fourth captain'),
  P(22, 'Marc Bernal', 'Bernal', 'Midfielder', 'Spain', 19, 2023, 2029, true),
  P(9, 'Gabriel Jesus', 'G. Jesus', 'Forward', 'Brazil', 29, 2026, 2029),
  P(10, 'Lamine Yamal', 'Yamal', 'Forward', 'Spain', 19, 2023, 2031, true, 'Fifth captain'),
  P(11, 'Raphinha', 'Raphinha', 'Forward', 'Brazil', 29, 2022, 2028, false, 'Captain'),
  P(14, 'Karim Adeyemi', 'Adeyemi', 'Forward', 'Germany', 24, 2026, 2031),
  P(17, 'Anthony Gordon', 'Gordon', 'Forward', 'England', 25, 2026, 2031),
  P(19, 'Roony Bardghji', 'Bardghji', 'Forward', 'Sweden', 20, 2025, 2029)
];

const LINEUP = {
  match: 'the 2-1 win at Atlético Madrid (8 Nov 2026)',
  rows: [[11, 17, 10], [8, 7, 22], [2, 5, 18, 4], [1]],
  raised: 7 
};

const M = (date, competition, venue, opponent, gf = null, ga = null) =>
  ({ date, competition, venue, opponent, gf, ga, status: gf === null ? 'upcoming' : 'played' });

const MATCHES = [
  M('2026-08-23T19:00:00Z', 'La Liga', 'Away', 'Elche', 5, 0),
  M('2026-08-27T19:00:00Z', 'La Liga', 'Home', 'Athletic Club', 2, 0),
  M('2026-08-31T19:00:00Z', 'La Liga', 'Home', 'Rayo Vallecano', 5, 2),
  M('2026-09-06T19:00:00Z', 'La Liga', 'Away', 'Valencia', 5, 0),
  M('2026-09-09T16:45:00Z', 'Champions League', 'Home', 'Feyenoord', 5, 1),
  M('2026-09-13T19:00:00Z', 'La Liga', 'Away', 'Levante', 4, 2),
  M('2026-09-16T19:00:00Z', 'La Liga', 'Home', 'Racing Santander', 7, 2),
  M('2026-09-19T19:00:00Z', 'La Liga', 'Away', 'Sevilla', 3, 1),
  M('2026-10-10T16:30:00Z', 'La Liga', 'Home', 'Getafe', 3, 0),
  M('2026-10-13T19:00:00Z', 'Champions League', 'Away', 'Galatasaray', 4, 1),
  M('2026-10-17T16:30:00Z', 'La Liga', 'Away', 'Real Betis', 5, 2),
  M('2026-10-20T19:00:00Z', 'Champions League', 'Away', 'Paris Saint-Germain', 2, 4),
  M('2026-10-25T20:00:00Z', 'La Liga', 'Home', 'Real Madrid', 1, 2),
  M('2026-10-31T20:00:00Z', 'La Liga', 'Home', 'Alavés', 6, 1),
  M('2026-11-03T20:00:00Z', 'Champions League', 'Home', 'Aston Villa', 3, 0),
  M('2026-11-08T20:00:00Z', 'La Liga', 'Away', 'Atlético Madrid', 2, 1),
  M('2026-11-22T13:00:00Z', 'La Liga', 'Home', 'Villarreal'),
  M('2026-11-25T17:45:00Z', 'Champions League', 'Away', 'Sabah'),
  M('2026-11-29T15:15:00Z', 'La Liga', 'Away', 'Deportivo La Coruña'),
  M('2026-12-06T19:00:00Z', 'La Liga', 'Home', 'Celta Vigo'),
  M('2026-12-08T20:00:00Z', 'Champions League', 'Home', 'Manchester City'),
  M('2026-12-13T19:00:00Z', 'La Liga', 'Away', 'Málaga'),
  M('2026-12-20T19:00:00Z', 'La Liga', 'Home', 'Real Sociedad'),
  M('2027-01-20T20:00:00Z', 'Champions League', 'Away', 'Sporting CP'),
  M('2027-01-27T20:00:00Z', 'Champions League', 'Home', 'Como')
];

const WORDS = [
  { term: 'Culer', text: 'A Barça supporter. In Catalan the plural is culers, and every fan on this site is one.' },
  { term: 'Blaugrana', text: 'The club colours: blau (blue) and grana (garnet). They come from the stripes of the shirt.' },
  { term: 'Més que un club', text: 'The club motto, “more than a club”. It says that Barça stands for more than football.' },
  { term: 'La Masia', text: 'The youth academy of the club. Yamal, Cubarsí, Fermín and Balde all came through its system.' },
  { term: 'El Clásico', text: 'The match between Barça and Real Madrid. This season the first one was played on 25 October 2026 at Camp Nou.' },
  { term: 'Camp Nou', text: 'The home stadium. This is the first full season back in the renovated Camp Nou.' }
];