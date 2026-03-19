module.exports.config = {
  name: "تعيين",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Saint",
  description: "تعيين كنية لجميع أعضاء المجموعة",
  commandCategory: "tools",
  usages: "تعيين [النص]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const nickname = args.join(" ").trim();

  if (!nickname) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs || [];

    for (const uid of participants) {
      try {
        await new Promise((resolve) => {
          api.changeNickname(nickname, threadID, uid, () => resolve());
        });
      } catch (e) {}
    }
  } catch (e) {}
};
