"use client";

import toast from "react-hot-toast";

export const successMessages = [
  "Poof 💸 There goes your money again! 💨",
  "Another one bites the wallet 😮‍💨💳",
  "Ouch… your balance felt that. 😵",
  "Cha-ching! (But in reverse.) 🔄💰",
  "Money successfully vanished 🫠✨",
  "Expense recorded. Regret pending. 🧾😬",
  "Boom. Budget crying softly. 💥😭",
  "Transaction saved. Wallet downgraded. 📉👛",
  "There it goes~ 💨💸",
  "Well… that wasn’t free. 😶‍🌫️💵",
];

export const validationMessages = [
  "Hold up ✋ You forgot something. 🤔",
  "Nice try… but fill everything first. 📝😏",
  "Title and amount, please 😏📌",
  "You can’t spend ‘nothing’… yet. 🫥💰",
  "Missing info detected 🚨🧐",
  "Incomplete spell. Try again 🧙✨",
  "Almost there… finish it! 🏁😤",
  "Your expense needs more details. 📋🔍",
];

export const errorMessages = [
  "Uh oh… something broke. 💥😵",
  "The money escaped but we didn’t catch it. 🏃‍♂️💸",
  "Server said nope 😬🖥️",
  "That didn’t go as planned. 😕📉",
  "Mission failed. Try again. 🎮❌",
  "Something went sideways. 🔄😶",
  "Budget chaos detected 💥📊",
  "Error 404: Money not recorded. 🚫💾",
];
export const successEmojis = [
  "💸",
  "💨",
  "😮‍💨",
  "🫠",
  "📉",
  "👛",
  "💳",
  "🧾",
  "✨",
  "😵",
  "💰➡️🫥",
  "💥💸",
  "🥲",
  "😬",
  "📊",
];
export const validationEmojis = [
  "✋",
  "🤔",
  "🧐",
  "📋",
  "📝",
  "🚨",
  "⚠️",
  "😏",
  "🙃",
  "🧠",
  "📌",
  "🛑",
  "👀",
  "😅",
  "🫥",
];

export const errorEmojis = [
  "💥",
  "😵",
  "🤯",
  "🚫",
  "🖥️",
  "📛",
  "🔥",
  "🧨",
  "😬",
  "🙈",
  "⚡",
  "🔧",
  "🆘",
  "💀",
  "😱",
];

export const getRandomEmoji = (emojis: string[]) => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export const getRandomMessage = (messages: string[]) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const blankToast = (title: string, condition: string) => {
  return toast(title, {
    duration: 4000,
    position: "top-center",
    style: {
      width: "auto",
    },

    icon:
      condition === "SUCCESS"
        ? getRandomEmoji(successEmojis)
        : condition === "INVALID"
          ? getRandomEmoji(validationEmojis)
          : getRandomEmoji(errorEmojis),

    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },

    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },

    removeDelay: 1000,

    toasterId: "default",
  });
};

export const saveToast = async (condition: string) => {
  switch (condition) {
    case "SUCCESS":
      return blankToast(getRandomMessage(successMessages), condition);
    case "INVALID":
      return blankToast(getRandomMessage(validationMessages), condition);
    case "FAIL":
      return blankToast(getRandomMessage(errorMessages), condition);
  }
};
