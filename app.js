
async function loadPrices(){const url='https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,pax-gold&vs_currencies=usd&include_24hr_change=true';const r=await fetch(url);const d=await r.json();document.getElementById('prices').innerHTML=`BTC: $${d.bitcoin.usd}<br>ETH: $${d.ethereum.usd}<br>ADA: $${d.cardano.usd}<br>PAXG: $${d['pax-gold'].usd}`;}
loadPrices(); setInterval(loadPrices,20000);

function showChart(){document.getElementById('chartContainer').style.display='block';const coin=document.getElementById('cryptoSelect').value.toUpperCase();new TradingView.widget({width:'100%',height:500,symbol:`BINANCE:${coin}USDT`,interval:'60',theme:'dark',style:'1',locale:'es',container_id:'chart'});} 

function showSignals(){document.getElementById('signals').style.display='block';document.getElementById('signals').innerHTML='Calculá las señales abajo.';}

async function getHistory(c){const url=`https://api.coingecko.com/api/v3/coins/${c}/market_chart?vs_currency=usd&days=7`;const r=await fetch(url);const d=await r.json();return d.prices.map(p=>p[1]);}

function calcEMA(v,p){let k=2/(p+1),e=v[0];for(let i=1;i<v.length;i++)e=v[i]*k+e*(1-k);return e;}
function calcTrend(v){let sum=0;for(let i=1;i<v.length;i++)sum+=v[i]-v[i-1];return sum>0?'Alcista ✅':'Bajista ❌';}

async function calculateCustomSignal(){const c=document.getElementById('cryptoSelect').value;const fast=parseInt(document.getElementById('emaFast').value);const slow=parseInt(document.getElementById('emaSlow').value);const closes=await getHistory(c);const emaF=calcEMA(closes,fast);const emaS=calcEMA(closes,slow);let emaSignal='Neutral';if(emaF>emaS) emaSignal='Compra ✅';if(emaF<emaS) emaSignal='Venta ❌';const trend=calcTrend(closes.slice(-10));let final='Neutral';if(emaSignal.includes('Compra')&&trend.includes('Alcista')) final='COMPRA ✅✅'; else if(emaSignal.includes('Venta')&&trend.includes('Bajista')) final='VENTA ❌❌';const box=document.getElementById('customResult');box.style.display='block';box.innerHTML=`<h3>Resultado</h3>EMA: ${emaSignal}<br>Tendencia: ${trend}<br><h2>${final}</h2>`;}