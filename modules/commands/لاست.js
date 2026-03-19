module.exports.config = {
  name: "لاست",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Saint",
  description: "قائمة الكروبات والتحكم عن بعد - أدمن البوت فقط",
  commandCategory: "tools",
  usages: "لاست",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, messageID } = event;
  const { ADMINBOT } = global.config;

  if (!ADMINBOT.includes(String(senderID))) {
    return api.sendMessage("⛔ هذا الأمر لأدمن البوت فقط.", threadID, messageID);
  }

  const threadInfo = global.data.threadInfo;

  if (!threadInfo || threadInfo.size === 0) {
    return api.sendMessage("❌ لا توجد كروبات مسجلة.", threadID, messageID);
  }

  const groups = [];
  for (const [id, info] of threadInfo.entries()) {
    if (info.isGroup) {
      groups.push({ id, name: info.threadName || "بدون اسم" });
    }
  }

  if (groups.length === 0) {
    return api.sendMessage("❌ البوت ليس في أي كروب حالياً.", threadID, messageID);
  }

  let msg = "📋 قائمة الكروبات:\n";
  msg += "━━━━━━━━━━━━━━━━\n";
  groups.forEach((g, i) => {
    msg += `${i + 1}. ${g.name}\n`;
  });
  msg += "━━━━━━━━━━━━━━━━\n";
  msg += `المجموع: ${groups.length} كروب\n\n`;
  msg += "↩️ رد برقم الكروب للتحكم فيه عن بعد.";

  api.sendMessage(msg, threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: "لاست",
      messageID: info.messageID,
      author: senderID,
      type: "select_group",
      groups
    });
  }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, senderID, body, messageID } = event;
  const { ADMINBOT } = global.config;

  if (!ADMINBOT.includes(String(senderID))) return;
  if (handleReply.author !== String(senderID)) return;

  const removeCurrentReply = () => {
    const idx = global.client.handleReply.findIndex(e => e.messageID === handleReply.messageID);
    if (idx !== -1) global.client.handleReply.splice(idx, 1);
  };

  if (handleReply.type === "select_group") {
    const choice = parseInt(body.trim());
    const { groups } = handleReply;

    if (isNaN(choice) || choice < 1 || choice > groups.length) {
      return api.sendMessage(
        `❌ رقم غير صحيح. اختر بين 1 و ${groups.length}.`,
        threadID, messageID
      );
    }

    const selectedGroup = groups[choice - 1];
    removeCurrentReply();

    api.sendMessage(
      `✅ تم اختيار الكروب:\n📌 ${selectedGroup.name}\n\n` +
      `↩️ رد بأي أمر لتنفيذه في هذا الكروب عن بعد.\n` +
      `مثال: بلو | ريد | قفل\n\n` +
      `🔴 اكتب "إيقاف" لإنهاء الجلسة.`,
      threadID,
      (err, info) => {
        if (err) return;
        global.client.handleReply.push({
          name: "لاست",
          messageID: info.messageID,
          author: String(senderID),
          type: "execute_command",
          targetThreadID: selectedGroup.id,
          targetName: selectedGroup.name
        });
      },
      messageID
    );

  } else if (handleReply.type === "execute_command") {
    const { targetThreadID, targetName } = handleReply;
    const input = body.trim();

    if (input === "إيقاف" || input === "ايقاف") {
      removeCurrentReply();
      return api.sendMessage(`🔴 تم إنهاء جلسة التحكم في:\n📌 ${targetName}`, threadID, messageID);
    }

    const rawCmd = input.replace(/^[./]/, "");
    const parts = rawCmd.split(/ +/);
    const commandName = parts[0]?.toLowerCase();
    const cmdArgs = parts.slice(1);

    const command = global.client.commands.get(commandName);
    if (!command) {
      return api.sendMessage(
        `❌ الأمر "${commandName}" غير موجود.\n↩️ حاول مرة أخرى أو اكتب "إيقاف" للخروج.`,
        threadID, messageID
      );
    }

    const fakeEvent = {
      ...event,
      threadID: targetThreadID,
      isGroup: true
    };

    try {
      await command.run({
        api,
        event: fakeEvent,
        args: cmdArgs,
        models: global.models,
        Users: global.Users,
        Threads: global.Threads,
        Currencies: global.Currencies,
        permssion: 2,
        getText: () => {}
      });

      removeCurrentReply();

      api.sendMessage(
        `✅ تم تنفيذ: "${commandName}"\n📌 في كروب: ${targetName}\n\n` +
        `↩️ رد بأمر آخر أو اكتب "إيقاف" للخروج.`,
        threadID,
        (err, info) => {
          if (err) return;
          global.client.handleReply.push({
            name: "لاست",
            messageID: info.messageID,
            author: String(senderID),
            type: "execute_command",
            targetThreadID,
            targetName
          });
        },
        messageID
      );

    } catch (e) {
      api.sendMessage(
        `❌ فشل تنفيذ الأمر: ${e.message}\n↩️ حاول مرة أخرى أو اكتب "إيقاف".`,
        threadID, messageID
      );
    }
  }
};
