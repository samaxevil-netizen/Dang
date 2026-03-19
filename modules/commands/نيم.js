module.exports.config = {
  name: "نيم",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Saint",
  description: "تعيين اسم محمي للكروب",
  commandCategory: "tools",
  usages: "نيم [الاسم] | نيم ايقاف",
  cooldowns: 0
};

if (!global.protectedNames) global.protectedNames = {};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;

  if (args[0] === "ايقاف") {
    delete global.protectedNames[threadID];
    return;
  }

  const name = args.join(" ").trim();
  if (!name) return;

  global.protectedNames[threadID] = name;
  api.setTitle(name, threadID);
};
