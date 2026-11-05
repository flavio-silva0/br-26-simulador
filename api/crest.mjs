/**
 * Tiny whitelist-only image relay. Official club trademarks belong to their owners.
 * The relay serves transparent assets under the same origin as the site, enabling
 * standards-compliant canvas PNG exports without CORS tainting. No API key needed.
 */
const SLUGS = new Set([
  'flamengo','palmeiras','cruzeiro','fluminense','bahia',
  'athletico-paranaense','atletico-mineiro','santos-fc','rb-bragantino',
  'sao-paulo','botafogo','coritiba','vasco-da-gama','mirassol-fc',
  'vitoria','sc-internacional','corinthians','gremio','club-de-remo','chapecoense','league'
]);
const LEAGUE_URL = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Campeonato_Brasileiro_S%C3%A9rie_A_logo_%282026%29.svg';
const PNG_URL = id => `https://www.footylogos.com/dls/logo/rgba-v1/${id}.png`;
const SVG_URL = id => `https://assets.footylogos.com/logos/${id}/${id}-logo-footylogos.svg`;
export async function GET(request) {
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!SLUGS.has(id)) return new Response('Escudo indisponível', {status:404});
  const urls = id === 'league'
    ? [LEAGUE_URL,'https://assets.footylogos.com/logos/brasileirao-serie-a/brasileirao-serie-a-logo-footylogos.svg']
    : [PNG_URL(id), SVG_URL(id)];
  for (const url of urls) {
    try {
      const res = await fetch(url,{headers:{'Accept':'image/png,image/svg+xml,image/*;q=0.8','User-Agent':'BR26ImageRelay/1.0 (sports dashboard)'}});
      if (!res.ok) continue;
      const type = res.headers.get('content-type') || '';
      if (!/^image\/(png|svg\+xml|webp|jpeg)/i.test(type))continue;
      const ab = await res.arrayBuffer();
      if (ab.byteLength < 300 || ab.byteLength > 1200000) continue;
      return new Response(ab,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400','Access-Control-Allow-Origin':'*','X-Content-Type-Options':'nosniff'}});
    } catch (_) { /* try the known fallback */ }
  }
  return new Response('Imagem temporariamente indisponível',{status:502,headers:{'Cache-Control':'no-store'}});
}
