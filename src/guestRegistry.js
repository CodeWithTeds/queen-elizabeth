// Royal Guest Registry for Ninongs & Ninangs of Princess Elizabeth

export const GODPARENTS = [
  // Ninongs (Godfathers)
  {
    slug: 'andrew',
    aliases: ['andrew', 'andrew-brozo', 'andrewbrozo', 'brozo'],
    title: 'Ninong',
    firstName: 'Andrew',
    fullName: 'Andrew Brozo',
    role: 'Ninong'
  },
  {
    slug: 'darille',
    aliases: ['darille', 'darille-pauitan', 'darillepauitan', 'pauitan'],
    title: 'Ninong',
    firstName: 'Darille',
    fullName: 'Darille Pauitan',
    role: 'Ninong'
  },
  {
    slug: 'luis',
    aliases: ['luis', 'luis-tababa', 'luistababa', 'tababa'],
    title: 'Ninong',
    firstName: 'Luis',
    fullName: 'Luis Tababa',
    role: 'Ninong'
  },
  {
    slug: 'kian',
    aliases: ['kian', 'kian-morenencia', 'kianmorenencia', 'morenencia'],
    title: 'Ninong',
    firstName: 'Kian',
    fullName: 'Kian Morenencia',
    role: 'Ninong'
  },
  {
    slug: 'zanjoe',
    aliases: ['zanjoe', 'zanjoe-manuel', 'zanjoemanuel', 'manuel'],
    title: 'Ninong',
    firstName: 'Zanjoe',
    fullName: 'Zanjoe Manuel',
    role: 'Ninong'
  },
  {
    slug: 'julius',
    aliases: ['julius', 'julius-togonon', 'juliustogonon', 'togonon'],
    title: 'Ninong',
    firstName: 'Julius',
    fullName: 'Julius Togonon',
    role: 'Ninong'
  },
  {
    slug: 'joeschar',
    aliases: ['joeschar', 'joeschar-santos', 'joescharsantos', 'santos'],
    title: 'Ninong',
    firstName: 'Joeschar',
    fullName: 'Joeschar Santos',
    role: 'Ninong'
  },
  {
    slug: 'ibarra',
    aliases: ['ibarra', 'ibarra-ordinaryo', 'ibarraordinaryo', 'ordinaryo'],
    title: 'Ninong',
    firstName: 'Ibarra',
    fullName: 'Ibarra Ordinaryo',
    role: 'Ninong'
  },
  {
    slug: 'johnpaul',
    aliases: ['johnpaul', 'john-paul', 'johnpaul-cagalitan', 'johnpaulcagalitan', 'cagalitan'],
    title: 'Ninong',
    firstName: 'Johnpaul',
    fullName: 'Johnpaul Cagalitan',
    role: 'Ninong'
  },
  {
    slug: 'shertone',
    aliases: ['shertone'],
    title: 'Ninong',
    firstName: 'Shertone',
    fullName: 'Shertone',
    role: 'Ninong'
  },
  {
    slug: 'ariel',
    aliases: ['ariel', 'tito-ariel', 'titoariel', 'tito-ariel'],
    title: 'Ninong',
    firstName: 'Tito Ariel',
    fullName: 'Tito Ariel',
    role: 'Ninong'
  },

  // Ninangs (Godmothers)
  {
    slug: 'sitti',
    aliases: ['sitti', 'sitti-alpad', 'sittialpad', 'alpad'],
    title: 'Ninang',
    firstName: 'Sitti',
    fullName: 'Sitti Alpad',
    role: 'Ninang'
  },
  {
    slug: 'alyssa',
    aliases: ['alyssa', 'alyssa-maranan', 'alyssamaranan', 'maranan'],
    title: 'Ninang',
    firstName: 'Alyssa',
    fullName: 'Alyssa Maranan',
    role: 'Ninang'
  },
  {
    slug: 'nicole',
    aliases: ['nicole', 'nicole-olimba', 'nicoleolimba', 'olimba'],
    title: 'Ninang',
    firstName: 'Nicole',
    fullName: 'Nicole Olimba',
    role: 'Ninang'
  },
  {
    slug: 'andjhelyka',
    aliases: ['andjhelyka', 'andjhelyka-nieto', 'andjhelykanieto', 'nieto'],
    title: 'Ninang',
    firstName: 'Andjhelyka',
    fullName: 'Andjhelyka Nieto',
    role: 'Ninang'
  },
  {
    slug: 'analyn',
    aliases: ['analyn'],
    title: 'Ninang',
    firstName: 'Analyn',
    fullName: 'Analyn',
    role: 'Ninang'
  },
  {
    slug: 'marie-charlotte',
    aliases: ['marie-charlotte', 'mariecharlotte', 'marie', 'charlotte', 'marie-charlotte-pangan', 'pangan'],
    title: 'Ninang',
    firstName: 'Marie Charlotte',
    fullName: 'Marie Charlotte Pangan',
    role: 'Ninang'
  },
  {
    slug: 'maria-fe',
    aliases: ['maria-fe', 'mariafe', 'maria', 'maria-fe-ferarriz', 'ferarriz'],
    title: 'Ninang',
    firstName: 'Maria Fe',
    fullName: 'Maria Fe Ferarriz',
    role: 'Ninang'
  }
];

// Helper to resolve guest information from current URL (Pathname, Hash, or Search Query)
export function resolveGuestFromUrl() {
  if (typeof window === 'undefined') {
    return {
      title: '',
      firstName: 'Special Guest',
      displayName: 'Special Guest',
      isGodparent: false,
      role: 'Guest'
    };
  }

  // 1. Check Pathname (e.g. /andrew, /darille, /sitti)
  let rawSlug = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

  // 2. Check Hash (e.g. #/andrew or #andrew)
  if (!rawSlug && window.location.hash) {
    rawSlug = window.location.hash.replace(/^[#\/]+|[#\/]+$/g, '').toLowerCase();
  }

  // 3. Check Query parameter (?name=andrew or ?to=sitti)
  if (!rawSlug && window.location.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      rawSlug = (params.get('to') || params.get('guest') || params.get('name') || '').trim().toLowerCase();
    } catch (_) {}
  }

  if (!rawSlug) {
    return {
      title: '',
      firstName: 'Special Guest',
      displayName: 'Special Guest',
      isGodparent: false,
      role: 'Guest'
    };
  }

  // Match against known Ninongs and Ninangs
  const matched = GODPARENTS.find(g => 
    g.slug === rawSlug || 
    g.aliases.includes(rawSlug) || 
    rawSlug.includes(g.slug)
  );

  if (matched) {
    return {
      title: matched.title,
      firstName: matched.firstName,
      displayName: `${matched.title} ${matched.firstName}`,
      fullName: matched.fullName,
      isGodparent: true,
      role: matched.role
    };
  }

  // Fallback for custom names in the URL: format slug into readable first name
  const formattedCustomName = rawSlug
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: '',
    firstName: formattedCustomName,
    displayName: formattedCustomName,
    isGodparent: false,
    role: 'Guest'
  };
}
