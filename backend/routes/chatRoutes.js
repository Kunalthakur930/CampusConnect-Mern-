const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Announcement = require("../models/Announcement");
const Reminder = require("../models/Reminder");

const router = express.Router();

// 🔹 CLEAN TEXT
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9 ]/g, "");

// 🔹 MATCH SCORE
const getMatchScore = (text, queryWords) => {
  let score = 0;

  const cleanText = normalize(text);

  queryWords.forEach((word) => {
    const cleanWord = normalize(word);

    if (cleanWord && cleanText.includes(cleanWord)) {
      score++;
    }
  });

  return score;
};

// CHAT API
router.post("/", protect, async (req, res) => {
  try {
    const userMsg = req.body.message.toLowerCase().trim();

    //  Garbage filter
    const uselessWords = ["hi", "hello", "ok", "hey"];
    if (uselessWords.includes(userMsg)) {
      return res.json({
        reply: "Ask something related to announcements or reminders.",
      });
    }

    const words = userMsg.split(" ");

    //  GET DATA (latest first)
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    const reminders = await Reminder.find().sort({ dueDate: 1 });

    let bestAnnouncement = null;
    let bestReminder = null;
    let bestScore = 0;

    //  SEARCH ANNOUNCEMENTS
    announcements.forEach((a) => {
      const text = ` ${a.title} ${a.content}`;
      const score = getMatchScore(text, words);

      if (score > bestScore) {
        bestScore = score;
        bestAnnouncement = a;
        bestReminder = null;
      }
    });

    // SEARCH REMINDERS
    reminders.forEach((r) => {
      const text = `${r.title} ${r.description}`;
      const score = getMatchScore(text, words);

      if (score > bestScore) {
        bestScore = score;
        bestReminder = r;
        bestAnnouncement = null;
      }
    });

    //  RESPONSE (STRICT MATCH)
    if (bestAnnouncement && bestScore >= 2) {
      return res.json({
        reply: `📢 ${bestAnnouncement.title}\n👉 ${bestAnnouncement.content}`,
      });
    }

    if (bestReminder && bestScore >= 2) {
      return res.json({
        reply: `⏰ ${bestReminder.title}\n📅 Due: ${new Date(
          bestReminder.dueDate,
        ).toLocaleString()}`,
      });
    }

    //  NO MATCH
    return res.json({
      reply: "No relevant data found. Try better keywords.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat error" });
  }
});

//  CHAT HISTORY
router.get("/", protect, async (req, res) => {
  res.json({
    messages: [
      {
        sender: "bot",
        text: "Hello! Ask me about announcements or reminders.",
      },
    ],
  });
});

module.exports = router;
