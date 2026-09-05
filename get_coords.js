async function main() {
  const query = `[out:json];(node["name"~"Aditya",i](17.05,82.04,17.15,82.10);way["name"~"Aditya",i](17.05,82.04,17.15,82.10);node["name"~"Technical",i](17.05,82.04,17.15,82.10););out center;`;
  const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data.elements.map(e => ({ name: e.tags && e.tags.name, lat: e.lat || (e.center && e.center.lat), lon: e.lon || (e.center && e.center.lon) })), null, 2));
}
main().catch(console.error);
