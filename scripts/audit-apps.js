import 'dotenv/config';
import connectDB from '../database/index.js';
import models from '../model/index.js';

const audit = async () => {
  try {
    await connectDB();
    const applications = await models.Application.find({}, { source: 1, company: 1, createdAt: 1 });
    
    const stats = {
      total: applications.length,
      bySource: {},
      recent: applications.slice(-10)
    };

    applications.forEach(app => {
      const src = app.source || 'unknown';
      stats.bySource[src] = (stats.bySource[src] || 0) + 1;
    });

    console.log(JSON.stringify(stats, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};

audit();
