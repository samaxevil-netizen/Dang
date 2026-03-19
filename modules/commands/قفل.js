module.exports.config = {
  name: "قفل",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Saint",
  description: "يقفل البوت ويمنع إرسال أي رسائل عدا ريد وبلو",
  commandCategory: "tools",
  usages: "قفل | قفل ايقاف",
  cooldowns: 0
};

if (!global.lockMode) global.lockMode = {};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;

  if (args[0] === "ايقاف") {
    global.lockMode[threadID] = false;
    return api.sendMessage("🔓 تم فتح القفل، البوت يعمل بشكل طبيعي الآن.", threadID);
  }

  global.lockMode[threadID] = true;
  return api.sendMessage("🔒 تم تفعيل القفل، البوت لن يرسل أي رسائل عدا ريد وبلو.", threadID);
};
