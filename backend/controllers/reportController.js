import Customer from '../models/Customer.js';
import Return from '../models/Return.js';
import ReturnRisk from '../models/ReturnRisk.js';
import { Parser } from 'json2csv';

const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : '');

export const generateReport = async (req, res) => {
  const { reportId } = req.query;

  try {
    let data, fields, csv;

    switch (reportId) {
      case 'risk-summary':
        data = await Customer.find({})
          .populate('riskAnalysis')
          .select('customerId name email totalOrders totalReturns totalSpent returnRate lastReturnDate address riskAnalysis')
          .lean();
        data = data.map(c => ({
          customerId: c.customerId,
          name: c.name,
          email: c.email,
          totalOrders: c.totalOrders,
          totalReturns: c.totalReturns,
          totalSpent: c.totalSpent,
          returnRate: c.returnRate,
          lastReturnDate: formatDate(c.lastReturnDate),
          address: c.address || '',
          riskScore: c.riskAnalysis?.riskScore ?? '',
          riskLevel: c.riskAnalysis?.riskLevel ?? '',
          riskFactors: c.riskAnalysis?.factors ? JSON.stringify(Object.fromEntries(c.riskAnalysis.factors)) : '',
          riskRecommendations: (c.riskAnalysis?.recommendations || []).join('; '),
          riskAnalysisDate: formatDate(c.riskAnalysis?.analysisDate),
        }));
        fields = [
          'customerId', 'name', 'email', 'totalOrders', 'totalReturns', 'totalSpent',
          'returnRate', 'lastReturnDate', 'address',
          'riskScore', 'riskLevel', 'riskFactors', 'riskRecommendations', 'riskAnalysisDate',
        ];
        break;

      case 'return-analysis':
        data = await Return.find({})
          .select('returnId customerId customerName product reason returnDate')
          .lean();
        data = data.map(r => ({
          returnId: r.returnId,
          customerId: r.customerId,
          customerName: r.customerName,
          product: r.product,
          reason: r.reason,
          returnDate: formatDate(r.returnDate),
        }));
        fields = ['returnId', 'customerId', 'customerName', 'product', 'reason', 'returnDate'];
        break;

      case 'high-risk-alerts':
        const risks = await ReturnRisk.find({ riskLevel: { $in: ['High', 'Critical'] } })
          .populate('customer')
          .lean();
        data = risks.map(r => ({
          customerId: r.customer?.customerId || '',
          name: r.customer?.name || '',
          email: r.customer?.email || '',
          totalReturns: r.customer?.totalReturns || 0,
          returnRate: r.customer?.returnRate || 0,
          lastReturnDate: formatDate(r.customer?.lastReturnDate),
          riskScore: r.riskScore,
          riskLevel: r.riskLevel,
          recommendations: (r.recommendations || []).join('; '),
          analysisDate: formatDate(r.analysisDate),
        }));
        fields = ['customerId', 'name', 'email', 'totalReturns', 'returnRate', 'lastReturnDate', 'riskScore', 'riskLevel', 'recommendations', 'analysisDate'];
        break;

      case 'financial-impact':
        data = await Customer.find({})
          .select('customerId name email totalSpent totalOrders totalReturns')
          .lean();
        data = data.map(c => ({
          customerId: c.customerId,
          name: c.name,
          email: c.email,
          totalSpent: c.totalSpent.toFixed(2),
          totalReturns: c.totalReturns,
          estimatedLoss: c.totalOrders > 0 ? ((c.totalSpent / c.totalOrders) * c.totalReturns).toFixed(2) : '0.00',
        }));
        fields = ['customerId', 'name', 'email', 'totalSpent', 'totalReturns', 'estimatedLoss'];
        break;

      case 'category-insights':
        const returns = await Return.find({})
          .select('product reason returnDate')
          .lean();
        data = returns.map(r => {
          const split = r.product.split(':');
          return {
            category: split[0] || 'Unknown',
            productName: split[1] ? split[1].trim() : r.product,
            reason: r.reason,
            returnDate: formatDate(r.returnDate),
          };
        });
        fields = ['category', 'productName', 'reason', 'returnDate'];
        break;

      case 'trend-forecast':
        const agg = await Return.aggregate([
          { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$returnDate' } }, returnsCount: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        data = agg.map(d => ({
          month: d._id,
          returnsCount: d.returnsCount
        }));
        fields = ['month', 'returnsCount'];
        break;

      default:
        return res.status(400).json({ error: 'Invalid reportId' });
    }

    csv = new Parser({ fields }).parse(data);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="${reportId}-report.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
