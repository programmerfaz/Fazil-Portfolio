/**
 * Full-color brand SVGs (not monochrome icon fonts).
 * Primary source: Devicon on jsDelivr — https://devicon.dev — pinned tag for stable URLs.
 * Supplements: Wikimedia Commons, vendor GitHub (Espressif, Eclipse Mosquitto) where Devicon has no match.
 */
export type TechBrandSpec = {
  /** Direct URL to a full-color SVG */
  iconUrl: string;
};

const DEVICON_TAG = 'v2.16.0';
const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@${DEVICON_TAG}/icons/${path}`;

const OPENAI_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg';
const TMDB_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tmdb.new.logo.svg';

export const TECH_BRAND: Partial<Record<string, TechBrandSpec>> = {
  Java: { iconUrl: devicon('java/java-original.svg') },
  Python: { iconUrl: devicon('python/python-original.svg') },
  JavaScript: { iconUrl: devicon('javascript/javascript-original.svg') },
  'C#': { iconUrl: devicon('csharp/csharp-original.svg') },
  PHP: { iconUrl: devicon('php/php-original.svg') },
  MySQL: { iconUrl: devicon('mysql/mysql-original.svg') },
  PostgreSQL: { iconUrl: devicon('postgresql/postgresql-original.svg') },
  Supabase: { iconUrl: devicon('supabase/supabase-original.svg') },
  React: { iconUrl: devicon('react/react-original.svg') },
  'React Native': { iconUrl: devicon('react/react-original.svg') },
  Vite: { iconUrl: devicon('vite/vite-original.svg') },
  'Node.js': { iconUrl: devicon('nodejs/nodejs-original.svg') },
  'HTML / CSS': { iconUrl: devicon('html5/html5-original.svg') },
  Tailwind: { iconUrl: devicon('tailwindcss/tailwindcss-original.svg') },
  'Spring Boot': { iconUrl: devicon('spring/spring-original.svg') },
  'ASP.NET': { iconUrl: devicon('dot-net/dot-net-original.svg') },
  REST: { iconUrl: devicon('swagger/swagger-original.svg') },
  Git: { iconUrl: devicon('git/git-original.svg') },
  GitHub: { iconUrl: devicon('github/github-original.svg') },
  Office: { iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  'Azure Portal': { iconUrl: devicon('azure/azure-original.svg') },
  'Azure DevOps': { iconUrl: devicon('azuredevops/azuredevops-original.svg') },
  Maven: { iconUrl: devicon('maven/maven-original.svg') },
  Arduino: { iconUrl: devicon('arduino/arduino-original.svg') },
  ESP32: {
    iconUrl:
      'https://raw.githubusercontent.com/espressif/esp-idf/master/docs/_static/espressif-logo.svg',
  },
  'OpenAI API': { iconUrl: OPENAI_LOGO },
  OpenAI: { iconUrl: OPENAI_LOGO },
  HTML: { iconUrl: devicon('html5/html5-original.svg') },
  CSS: { iconUrl: devicon('css3/css3-original.svg') },
  'TMDB API': { iconUrl: TMDB_LOGO },
  'scikit-learn': { iconUrl: devicon('scikitlearn/scikitlearn-original.svg') },
  pandas: { iconUrl: devicon('pandas/pandas-original.svg') },
  /** C-family embedded work — same mark as C++ for recognition */
  'Embedded C': { iconUrl: devicon('cplusplus/cplusplus-original.svg') },
  MVC: { iconUrl: devicon('dot-net/dot-net-original.svg') },
  'Client / server': { iconUrl: devicon('socketio/socketio-original.svg') },
  'IoT sensors': {
    iconUrl:
      'https://raw.githubusercontent.com/eclipse-mosquitto/mosquitto/master/logo/mosquitto-logo-only.svg',
  },
};
