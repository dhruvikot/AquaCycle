import axios from "axios";

// ========================================
// PRODUCTION API - COMMENTED OUT FOR DEMO
// ========================================
// This file was connecting to production Google Cloud API
// Now using local database instead (see services/localDatabase.js)

// COMMENTED OUT - Production API
// export default axios.create({
//   baseURL: 'https://express-auv3rzs3sa-uw.a.run.app',
//   headers: {
//     "Content-type": "application/json",
//     'Access-Control-Allow-Origin': '*'
//   }
// });

// Placeholder export (this file is no longer used)
export default {
  get: () => Promise.reject('Use local database instead'),
  post: () => Promise.reject('Use local database instead'),
  put: () => Promise.reject('Use local database instead'),
  delete: () => Promise.reject('Use local database instead'),
};
