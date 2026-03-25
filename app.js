
async function loadPrices() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd&include_24hr_change=true';
  const res = await fetch(url);
  const data = await res.json();
  document.getElementById('prices').innerHTML = `
    <p>BTC: $${data.bitcoin.usd} (${data.bitcoin.usd_24h_change.toFixed(2)}%)</p>
    <p>ETH: $${data.ethereum.usd} (${data.ethereum.usd_24h_change.toFixed(2)}%)</p>
    <p>ADA: $${data.cardano.usd} (${data.cardano.usd_24h_change.toFixed(2)}%)</p>`;
}
loadPrices();
setInterval(loadPrices, 20000);

function showChart() {
  document.getElementById('chartContainer').style.display = 'block';
  new TradingView.widget({
    width: '100%',
    height: 500,
    symbol: 'BINANCE:BTCUSDT',
    interval: '60',
    theme: 'dark',
    style: '1',
    locale: 'es',
    container_id: 'chart'
  });
}

function showSignals() {
  const closes=[68000,68200,67800,67900,68100,68300];
  const rsi=calcRSI(closes);
  const ema20=calcEMA(closes,20);
  const ema50=calcEMA(closes,50);
  document.getElementById('signals').style.display='block';
  document.getElementById('signals').innerHTML=`RSI: ${rsi.toFixed(2)}<br>EMA20: ${ema20.toFixed(2)}<br>EMA50: ${ema50.toFixed(2)}`;
}

async function getHistory(coin){
  const url=`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`;
  const r=await fetch(url); const d=await r.json(); return d.prices.map(p=>p[1]);
}

async function calculateCustomSignal(){
  const coin=document.getElementById('cryptoSelect').value;
  const fast=parseInt(document.getElementById('emaFast').value);
  const slow=parseInt(document.getElementById('emaSlow').value);
  const closes=await getHistory(coin);
  const emaFast=calcEMA(closes,fast);
  const emaSlow=calcEMA(closes,slow);
  let signal='Neutral';
  if(emaFast>emaSlow) signal='Compra ✅ (EMA rápida > EMA lenta)';
  if(emaFast<emaSlow) signal='Venta ❌ (EMA rápida < EMA lenta)';
  const box=document.getElementById('customResult');
  box.style.display='block';
  box.innerHTML=`<h3>Resultado</h3>
    <p><b>Cripto:</b> ${coin.toUpperCase()}</p>
    <p>EMA Rápida (${fast}): ${emaFast.toFixed(2)}</p>
    <p>EMA Lenta (${slow}): ${emaSlow.toFixed(2)}</p>
    <h2>${signal}</h2>`;
}

function calcEMA(values, period){ let k=2/(period+1), ema=values[0]; for(let i=1;i<values.length;i++) ema=values[i]*k+ema*(1-k); return ema; }
function calcRSI(values){ let g=0,l=0; for(let i=1;i<values.length;i++){ let c=values[i]-values[i-1]; if(c>0) g+=c; else l-=c;} let rs=g/(l||1); return 100-100/(1+rs);} 
