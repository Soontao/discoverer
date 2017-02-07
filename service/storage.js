// store info in map
const services = {};
const debug = require('debug')('discoverer:store');
const forEach = require('lodash').forEach;



/**
 * remove expired instances from registry
 */
function checkExpired() {
  const currentTime = new Date()
  forEach(services, (instances, serviceName) => {
    forEach(instances, (instanceInfo, instanceId) => {
      if (instanceInfo.expires < currentTime)
        deleteInstance(instanceInfo)
    })
  });
}

/**
 * run check expired instances per seconds
 */
setInterval(checkExpired, process.env.EXPIRE_INT || 1000);


/**
 * Check Service Instance Info and return checked object
 * 
 * Will add a instance id to object
 * 
 * Will add a expires date to object
 * 
 * @param {Object} object with service instance info
 * @returns {Object} instanceInfo 
 */
function ServiceInstanceInfo(object) {
  let result = {};
  if (object && object.serviceName && object.instanceIp && object.instancePort) {
    result.instanceIp = object.instanceIp;
    result.serviceName = object.serviceName;
    result.instancePort = object.instancePort;
    result.expires = getDateAfterSeconds();
  } else
    throw Error("params not complete")
  result.instanceId = object.instanceId || `${object.instanceIp}:${object.instancePort}`
  return result;
}

/**
 * check a instance if it existed before
 * 
 * @param {Object} instanceInfo
 * @returns {Boolean}
 */
function instanceIsExisted(instanceInfo) {
  if (services[instanceInfo.serviceName] && services[instanceInfo.serviceName][instanceInfo.instanceId])
    return true
  else
    return false
}


/**
 * 添加一个服务实例
 * 
 * @param {Object} instanceInfo
 * 
 * @returns {void}
 */
function addInstance(originInfo) {
  let instanceInfo = ServiceInstanceInfo(originInfo);
  // if service node not exist,create the node
  if (!services[instanceInfo.serviceName])
    services[instanceInfo.serviceName] = {};
  if (!services[instanceInfo.serviceName][instanceInfo.instanceId]) {
    services[instanceInfo.serviceName][instanceInfo.instanceId] = instanceInfo;
    return instanceInfo
  } else
    throw new Error(`Instance from ${instanceInfo.instanceId} has been registered before, use other api to refresh`);
}

/**
 * 更新一个实例信息
 * 
 * @param {Object} originInfo
 */
function updateInstance(originInfo) {
  let instanceInfo = ServiceInstanceInfo(originInfo);
  if (instanceIsExisted(instanceInfo)) {
    services[instanceInfo.serviceName][instanceInfo.instanceId] = instanceInfo;
    return instanceInfo
  } else
    throw new Error("No such service ${instanceInfo.serviceName} or The instance not register before");
}

/**
 * delete a instance from the store
 * 
 * @param {Object} originInfo
 */
function deleteInstance(originInfo) {
  let instanceInfo = ServiceInstanceInfo(originInfo);
  if (instanceIsExisted(instanceInfo)) {
    delete(services[instanceInfo.serviceName][instanceInfo.instanceId])
    debug(`remove instance ${instanceInfo.instanceId} from registry`)
    return instanceInfo
  } else
    throw new Error("The instance ${instanceInfo.instanceId} not register before");
}


/**
 * 获取所有实例
 * 
 * @returns {Map<string,Map<string,ServiceInfo>>}
 */
function getInstances() {
  return services;
}

/**
 * get date offset
 * 
 * default with 45 seconds offset
 * 
 * @param {int} secNum seconds number
 * 
 * @returns {Date}
 */
function getDateAfterSeconds(secNum) {
  secNum = secNum || 45;
  return new Date((new Date).getTime() + secNum * 1000);
}

module.exports = {
  addInstance,
  getInstances,
  deleteInstance,
  updateInstance
}