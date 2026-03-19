module.exports.config = {
  name: "protectname",
  eventType: ["log:thread-name"],
  version: "1.0.0",
  credits: "Saint",
  description: "حماية اسم الكروب من التغيير"
};

if (!global.protectedNames) global.protectedNames = {};

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const protectedName = global.protectedNames[threadID];

  if (!protectedName) return;

  const changerID = event.author;
  const botID = api.getCurrentUserID();

  if (changerID == botID) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(a => a.uid || a);
    if (adminIDs.includes(changerID)) return;
  } catch (e) {}

  setTimeout(() => {
    api.setTitle(protectedName, threadID);
  }, 10 * 1000);
};
