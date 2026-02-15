// Market Rates for Budget Calculator (per sq. ft. in INR)
const marketRates = {
  bangalore: { basic: 1500, mid: 1800, premium: 2200 },
  mumbai: { basic: 1800, mid: 2200, premium: 2700 },
  delhi: { basic: 1600, mid: 2000, premium: 2500 },
  foreign_multiplier: 1.4,
};

// @desc    Calculate budget estimate
// @route   POST /api/budget/estimate
exports.calculateEstimate = (req, res) => {
  try {
    const { city, area, quality, materials } = req.body;

    if (!city || !area || !quality) {
      return res.status(400).json({ message: 'City, area, and quality are required' });
    }

    const cityRates = marketRates[city];
    if (!cityRates) {
      return res.status(400).json({ message: 'City not supported' });
    }

    const baseRate = cityRates[quality] * (materials === 'foreign' ? marketRates.foreign_multiplier : 1);
    const totalCost = area * baseRate;

    const breakdown = {
      foundation: Math.round(totalCost * 0.3),
      finishing: Math.round(totalCost * 0.45),
      plumbing: Math.round(totalCost * 0.25),
    };

    // AI Tip
    let tip = 'A mid-range finish offers the best balance of quality and cost-effectiveness for most residential projects in this area.';
    if (quality === 'premium' && materials === 'indian') {
      tip = "For a premium finish, consider pairing high-quality Indian structural materials with select items from our Foreign Brands section.";
    } else if (city === 'mumbai' && quality !== 'basic') {
      tip = "Construction costs in Mumbai are higher. Ensure your foundation planning is robust to handle local soil conditions.";
    } else if (materials === 'foreign') {
      tip = "Using foreign brands increases quality but also import duties and shipping times. Plan procurement at least 45 days in advance.";
    }

    res.json({
      totalCost,
      breakdown,
      tip,
      ratePerSqFt: baseRate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate contractor quotation
// @route   POST /api/budget/quotation
exports.calculateQuotation = (req, res) => {
  try {
    const { city, area, quality, margin } = req.body;

    if (!city || !area || !quality) {
      return res.status(400).json({ message: 'City, area, and quality are required' });
    }

    const cityRates = marketRates[city];
    if (!cityRates) {
      return res.status(400).json({ message: 'City not supported' });
    }

    const baseCost = area * cityRates[quality];
    const profit = baseCost * ((margin || 15) / 100);
    const totalQuote = baseCost + profit;

    res.json({
      baseCost,
      profit,
      totalQuote,
      margin: margin || 15,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate budget prediction
// @route   POST /api/budget/prediction
exports.calculatePrediction = (req, res) => {
  try {
    const { city, area, quality, contingency } = req.body;

    if (!city || !area || !quality) {
      return res.status(400).json({ message: 'City, area, and quality are required' });
    }

    const cityRates = marketRates[city];
    if (!cityRates) {
      return res.status(400).json({ message: 'City not supported' });
    }

    const baseCost = area * cityRates[quality];
    const contingencyAmount = baseCost * ((contingency || 15) / 100);
    const totalPrediction = baseCost + contingencyAmount;

    res.json({
      baseCost,
      contingencyAmount,
      totalPrediction,
      contingency: contingency || 15,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get market rates
// @route   GET /api/budget/rates
exports.getMarketRates = (req, res) => {
  res.json(marketRates);
};
