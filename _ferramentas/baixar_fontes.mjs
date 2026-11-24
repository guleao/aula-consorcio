// Baixa Clash Display + Satoshi (Fontshare, licença ITF Free Font: uso comercial liberado)
// para fonts/ e gera fonts/fontes.css com caminhos locais. Rodar: node _ferramentas/baixar_fontes.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pasta = join(raiz, "fonts");
// o Fontshare só devolve a primeira família de cada pedido: um pedido por família
const familias = ["clash-display@500,600,700", "satoshi@400,500,700"];

let blocos = [];
for (const f of familias) {
  const css = await (await fetch("https://api.fontshare.com/v2/css?f[]=" + f + "&display=swap")).text();
  blocos = blocos.concat(css.match(/@font-face\s*\{[^}]+\}/g) || []);
}
if (!blocos.length) throw new Error("CSS do Fontshare veio vazio");
await mkdir(pasta, { recursive: true });

let saida = "/* gerado por _ferramentas/baixar_fontes.mjs */\n";
for (const b of blocos) {
  const familia = b.match(/font-family:\s*'([^']+)'/)[1];
  const peso = b.match(/font-weight:\s*(\d+)/)[1];
  const woff2 = b.match(/url\('([^']+?\.woff2)'\)/)[1];
  const nome = familia.toLowerCase().replace(/\s+/g, "-") + "-" + peso + ".woff2";
  const resp = await fetch("https:" + woff2);
  if (!resp.ok) throw new Error("falhou " + nome + " " + resp.status);
  const dados = Buffer.from(await resp.arrayBuffer());
  await writeFile(join(pasta, nome), dados);
  console.log(nome, dados.length, "bytes");
  saida += `@font-face {\n  font-family: "${familia}";\n  src: url("${nome}") format("woff2");\n  font-weight: ${peso};\n  font-style: normal;\n  font-display: swap;\n}\n`;
}
await writeFile(join(pasta, "fontes.css"), saida);
console.log("ok:", blocos.length, "fontes");
