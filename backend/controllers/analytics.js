import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import Customer from '../models/Customer.js';
import Return from '../models/Return.js';
import ReturnRisk from '../models/ReturnRisk.js';

/**
 * @function getAnalyticsData
 * @description Retrieves analytics data for the dashboard from database
 * @route GET /api/analytics
 * @access Protected (Admin only)
 */
const getAnalyticsData = asyncHandler(async (req, res) => {
  console.log("Analytics endpoint called with period:", req.query.period);
  
  // Get time period from query (default to 12months)
  const period = req.query.period || '12months';
  
  try {
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '12months':
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    // Fetch data from database
    const [customers, returns, totalCustomers, totalReturns, riskAnalyses] = await Promise.all([
      Customer.find({ createdAt: { $gte: startDate } }),
      Return.find({ createdAt: { $gte: startDate } }),
      Customer.countDocuments(),
      Return.countDocuments(),
      ReturnRisk.find().populate('customer')
    ]);

    // Calculate metrics
    const avgRiskScore = riskAnalyses.length > 0 
      ? (riskAnalyses.reduce((sum, risk) => sum + risk.riskScore, 0) / riskAnalyses.length).toFixed(1)
      : "0.0";

    // Calculate previous period for trend comparison
    const prevPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const prevCustomers = await Customer.find({ 
      createdAt: { $gte: prevPeriodStart, $lt: startDate } 
    });
    const prevReturns = await Return.find({ 
      createdAt: { $gte: prevPeriodStart, $lt: startDate } 
    });

    const returnRate = totalCustomers > 0 
      ? ((totalReturns / totalCustomers) * 100).toFixed(1)
      : "0.0";

    const prevReturnRate = prevCustomers.length > 0 
      ? ((prevReturns.length / prevCustomers.length) * 100)
      : 0;

    const returnRateChange = prevReturnRate > 0 
      ? (((parseFloat(returnRate) - prevReturnRate) / prevReturnRate) * 100).toFixed(1)
      : "0.0";

    const highRiskCustomers = riskAnalyses.filter(risk => risk.riskScore >= 70);
    const highRiskPercentage = riskAnalyses.length > 0 
      ? ((highRiskCustomers.length / riskAnalyses.length) * 100).toFixed(1)
      : "0.0";

    // Calculate revenue impact from returns (assuming average order value)
    const avgOrderValue = 100; // You might want to store this in your database
    const revenueImpact = returns.length * avgOrderValue;
    const prevRevenueImpact = prevReturns.length * avgOrderValue;
    const revenueChange = prevRevenueImpact > 0 
      ? (((revenueImpact - prevRevenueImpact) / prevRevenueImpact) * 100).toFixed(1)
      : "0.0";

    // Get monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthReturns = await Return.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthRiskData = await ReturnRisk.find({
        analysisDate: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthAvgRisk = monthRiskData.length > 0
        ? Math.round(monthRiskData.reduce((sum, risk) => sum + risk.riskScore, 0) / monthRiskData.length)
        : 0;

      const monthRevenue = monthReturns * avgOrderValue;

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        returns: monthReturns,
        riskScore: monthAvgRisk,
        revenue: monthRevenue
      });
    }

    // Risk distribution
    const lowRiskCount = riskAnalyses.filter(r => r.riskScore < 40).length;
    const mediumRiskCount = riskAnalyses.filter(r => r.riskScore >= 40 && r.riskScore < 70).length;
    const highRiskCount = riskAnalyses.filter(r => r.riskScore >= 70).length;
    const totalRiskAnalyses = riskAnalyses.length || 1;

    const riskDistribution = [
      { 
        name: "Low Risk", 
        value: lowRiskCount, 
        color: "#10B981", 
        percentage: ((lowRiskCount / totalRiskAnalyses) * 100).toFixed(1)
      },
      { 
        name: "Medium Risk", 
        value: mediumRiskCount, 
        color: "#F59E0B", 
        percentage: ((mediumRiskCount / totalRiskAnalyses) * 100).toFixed(1)
      },
      { 
        name: "High Risk", 
        value: highRiskCount, 
        color: "#EF4444", 
        percentage: ((highRiskCount / totalRiskAnalyses) * 100).toFixed(1)
      }
    ];

    // Top return reasons
    const reasonCounts = await Return.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$reason", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const totalReasonsCount = reasonCounts.reduce((sum, item) => sum + item.count, 0);
    const topReasons = reasonCounts.map(item => ({
      reason: item._id,
      count: item.count,
      percentage: totalReasonsCount > 0 ? ((item.count / totalReasonsCount) * 100).toFixed(1) : "0.0"
    }));

    // Category data (based on product names - simple categorization)
    const categoryData = [
      { category: "Electronics", returns: 0, riskScore: 0, color: "#3B82F6" },
      { category: "Fashion", returns: 0, riskScore: 0, color: "#EF4444" },
      { category: "Beauty", returns: 0, riskScore: 0, color: "#10B981" },
      { category: "Home", returns: 0, riskScore: 0, color: "#F59E0B" },
      { category: "Sports", returns: 0, riskScore: 0, color: "#8B5CF6" }
    ];

    // Simple product categorization based on keywords
    const productCategories = {
      electronics: ['phone', 'laptop', 'tablet', 'computer', 'electronic'],
      fashion: ['shirt', 'pants', 'dress', 'shoes', 'clothes', 'fashion'],
      beauty: ['cosmetic', 'makeup', 'skincare', 'beauty', 'perfume'],
      home: ['furniture', 'kitchen', 'home', 'decoration', 'appliance'],
      sports: ['sport', 'fitness', 'gym', 'exercise', 'athletic']
    };

    for (const returnItem of returns) {
      const productLower = returnItem.product.toLowerCase();
      let categorized = false;
      
      for (const [category, keywords] of Object.entries(productCategories)) {
        if (keywords.some(keyword => productLower.includes(keyword))) {
          const categoryIndex = categoryData.findIndex(c => 
            c.category.toLowerCase() === category || 
            (category === 'electronics' && c.category === 'Electronics')
          );
          if (categoryIndex !== -1) {
            categoryData[categoryIndex].returns++;
            categorized = true;
            break;
          }
        }
      }
      
      if (!categorized) {
        // Default to first category if no match
        categoryData[0].returns++;
      }
    }

    // Calculate average risk scores for categories (simplified)
    categoryData.forEach(category => {
      category.riskScore = Math.floor(Math.random() * 30) + 25; // Placeholder calculation
    });

    const analyticsData = {
      metrics: [
        {
          title: "Avg Risk Score",
          value: avgRiskScore,
          change: "0.0%", // You can calculate this based on previous period
          trend: "neutral"
        },
        {
          title: "Return Rate",
          value: `${returnRate}%`,
          change: `${returnRateChange >= 0 ? '+' : ''}${returnRateChange}%`,
          trend: returnRateChange >= 0 ? "up" : "down"
        },
        {
          title: "High Risk %",
          value: `${highRiskPercentage}%`,
          change: "0.0%", // You can calculate this based on previous period
          trend: "neutral"
        },
        {
          title: "Revenue Impact",
          value: `$${(revenueImpact / 1000).toFixed(1)}K`,
          change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
          trend: revenueChange >= 0 ? "up" : "down"
        }
      ],
      
      monthlyData,
      riskDistribution,
      categoryData,
      topReasons
    };
    
    console.log("Sending analytics data successfully");
    
    // Return the analytics data
    return res.status(200).json(
      new ApiResponse(200, analyticsData, 'Analytics data fetched successfully')
    );

  } catch (error) {
    console.error("Analytics error:", error);
    throw new ApiError(500, error.message || 'Error fetching analytics data');
  }
});

export { getAnalyticsData };