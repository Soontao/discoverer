
const server_url = process.env.C_SERVER_URL || "http://127.0.0.1:3999";
const service_name = process.env.C_SERVICE_NAME;
const instance_url = process.env.C_INSTANCE_URL;
const instance_id = process.env.C_INSTANCE_ID;
const heart_break_interval = parseInt(process.env.C_HEART_BREAK_INTERVAL) || 15

module.exports = {
  server_url,
  instance_id,
  instance_url,
  service_name, 
  heart_break_interval
}