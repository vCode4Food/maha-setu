/** Centralized image configuration — the ONLY place raw image URLs live. */

const U = (id: string, w = 1200, q = 70) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`

export const images = {
  hero: U('1531497865144-0464ef8fb9a9', 1600, 75),
  heroAlt: 'Indian citizens at a modern public service centre',

  services: {
    certificates: U('1517486808906-6ca8b3f04846'),
    transport: U('1570125909232-eb263c188f7e'),
    business: U('1556740738-b6a63e27c4df'),
    health: U('1519494026892-80bbd2d6fd0d'),
    education: U('1523050854058-8df90110c9f1'),
    agriculture: U('1625246333195-78d9c38ad449'),
    housing: U('1560518883-ce09059eeffa'),
  },

  lifeEvents: {
    business: U('1556740738-b6a63e27c4df'),
    baby: U('1519689680058-324335c77eba'),
    marriage: U('1583939003579-730e3918a45e'),
    job: U('1486312338219-ce68d2c6f44d'),
    student: U('1523050854058-8df90110c9f1'),
    farmer: U('1625246333195-78d9c38ad449'),
    moving: U('1560518883-ce09059eeffa'),
    senior: U('1581579438747-1dc8d17bbce4'),
    healthcare: U('1519494026892-80bbd2d6fd0d'),
    assistance: U('1579621970563-ebec7560ff3e'),
  },

  schemes: {
    farmer: U('1500382017468-9049fed747ef'),
    students: U('1523050854058-8df90110c9f1'),
    startup: U('1522071820081-009f0129c71c'),
    msme: U('1581091226825-a6a2a5aee158'),
    health: U('1584982751601-97dcc096659c'),
    women: U('1573164713988-8665fc963095'),
    housing: U('1560518883-ce09059eeffa'),
    merit: U('1427504494785-3a9ca7044f45'),
    senior: U('1581579438747-1dc8d17bbce4'),
  },

  india: {
    city: U('1529253355930-ddbe4235bd62'),
    rural: U('1477678437962-ce079e27bf5c'),
    monsoon: U('1591129841117-3adfd313e34f'),
    mumbai: U('1529253355930-ddbe4235bd62'),
  },

  trust: U('1550751827-473bdf8db63b'),
  ai: U('1677442136019-21780ecad995'),
}

export type ImageKey = keyof typeof images
