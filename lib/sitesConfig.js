

const sites = [
  {
    id: 'google',
    name: 'Google Search',
    description: 'Main search engine health',
    url: 'https://www.google.com',
    icon: '🔍',
  },
  {
    id: 'github',
    name: 'GitHub API',
    description: 'Developer platform and API status',
    url: 'https://api.github.com',
    icon: '🐙',
  },
  {
    id: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    description: 'Free fake API for testing and prototyping',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    icon: '🧪',
  },
  {
    id: 'binance-api',
    name: 'Binance API',
    description: 'Crypto exchange public API',
    url: 'https://api.binance.com/api/v3/ping',
    icon: '💰',
  },
  {
    id: 'pokeapi',
    name: 'PokeAPI',
    description: 'RESTful Pokémon API',
    url: 'https://pokeapi.co/api/v2/pokemon/ditto',
    icon: '🐉',
  },
  {
    id: 'discord',
    name: 'Discord API',
    description: 'Communication platform API',
    url: 'https://discord.com/api/v9/gateway',
    icon: '💬',
  },
  {
    id: 'npm',
    name: 'NPM Registry',
    description: 'Node Package Manager registry',
    url: 'https://registry.npmjs.org/',
    icon: '📦',
  }
];

export default sites;


export const getSiteStatus = async (site) => {
  
  

  
  
  const statusOptions = ['operational', 'degraded', 'outage'];
  const randomStatus = Math.random() > 0.95
    ? (Math.random() > 0.5 ? 'degraded' : 'outage')
    : 'operational';

  const lastChecked = new Date();

  return {
    id: site.id,
    name: site.name,
    url: site.url,
    status: randomStatus,
    statusText: randomStatus === 'operational'
      ? 'Operational'
      : randomStatus === 'degraded'
        ? 'Degraded Performance'
        : 'Outage',
    lastChecked,
    responseTime: Math.floor(Math.random() * 500) + 100, 
  };
};

export const checkAllSites = async () => {
  const statusPromises = sites.map(site => getSiteStatus(site));
  return Promise.all(statusPromises);
};
