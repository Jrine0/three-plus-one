import type { VolatilityStatus } from '@/types';

// CoinGecko API endpoint (free tier)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Price history for volatility calculation
let priceHistory: { price: number; timestamp: number }[] = [];

// Fetch current ETH price
export async function fetchEthPrice(): Promise<number> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd`
    );
    const data = await response.json();
    return data.ethereum?.usd || 0;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Return mock price if API fails
    return 2000 + Math.random() * 200 - 100;
  }
}

// Calculate volatility score
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    const change = ((prices[i] - prices[i - 1]) / prices[i - 1]) * 100;
    changes.push(Math.abs(change));
  }

  const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
  return Number(avgChange.toFixed(2));
}

// Get price change percentage
export function getPriceChange(prices: number[]): number {
  if (prices.length < 2) return 0;
  const first = prices[0];
  const last = prices[prices.length - 1];
  return Number((((last - first) / first) * 100).toFixed(2));
}

// Determine weather status
export function getWeatherStatus(volatilityScore: number, priceChange: number): VolatilityStatus['weather'] {
  if (volatilityScore > 5 || priceChange < -5) {
    return 'stormy';
  } else if (volatilityScore > 3 || Math.abs(priceChange) > 3) {
    return 'cloudy';
  }
  return 'sunny';
}

// Monitor volatility
export async function checkVolatility(): Promise<VolatilityStatus> {
  const currentPrice = await fetchEthPrice();
  const now = Date.now();

  // Add to price history
  priceHistory.push({ price: currentPrice, timestamp: now });

  // Keep only last 5 minutes of data (assuming checks every minute)
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  priceHistory = priceHistory.filter(p => p.timestamp > fiveMinutesAgo);

  // Calculate metrics
  const prices = priceHistory.map(p => p.price);
  const volatilityScore = calculateVolatility(prices);
  const priceChange = getPriceChange(prices);
  const weather = getWeatherStatus(volatilityScore, priceChange);
  const isVolatile = weather === 'stormy';

  return {
    isVolatile,
    currentPrice,
    priceChange,
    volatilityScore,
    weather,
  };
}

// Simulate volatility monitoring (for demo)
export function simulateVolatility(): VolatilityStatus {
  const basePrice = 2000;
  const randomChange = Math.random() * 10 - 5; // -5% to +5%
  const currentPrice = basePrice * (1 + randomChange / 100);
  
  const volatilityScore = Math.abs(randomChange);
  const weather = getWeatherStatus(volatilityScore, randomChange);
  
  return {
    isVolatile: weather === 'stormy',
    currentPrice: Number(currentPrice.toFixed(2)),
    priceChange: Number(randomChange.toFixed(2)),
    volatilityScore: Number(volatilityScore.toFixed(2)),
    weather,
  };
}

// Start monitoring (client-side simulation)
export function startVolatilityMonitoring(
  callback: (status: VolatilityStatus) => void,
  interval = 60000 // 1 minute
): () => void {
  const intervalId = setInterval(async () => {
    const status = await checkVolatility();
    callback(status);
  }, interval);

  // Initial check
  checkVolatility().then(callback);

  return () => clearInterval(intervalId);
}
