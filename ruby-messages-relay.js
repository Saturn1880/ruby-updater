// RubyOS Messages + Calls Relay - GitHub file spec
// Put BOTH files in your ruby-updater repo, main branch:
//   1) ruby-messages.json - the inbox file (this relay reads/writes it)
//   2) RubyOS-v4.9.16.html - the OS that uses it
//
// How messages go through GitHub:
//   Sender (RubyOS 4.9.16, Messages app):
//     - You type: Name (your name), Number (your Ruby number, auto), Message (text)
//     - You pick a contact: Name + Number (the address)
//     - RubyOS builds: {id, from, fromName, to, toName, text, time, read:false}
//     - If you saved a GitHub token in Messages, RubyOS does:
//         GET https://api.github.com/repos/Saturn1880/ruby-updater/contents/ruby-messages.json  (to get SHA)
//         PUT same URL with new messages array + SHA (to write it back)
//     - If no token, RubyOS shows the JSON to copy into ruby-messages.json with your bot.
//   Receiver (other person's RubyOS):
//     - Every 5 seconds it does: GET https://raw.githubusercontent.com/Saturn1880/ruby-updater/main/ruby-messages.json?t=now
//     - If it finds a message where to == my Ruby number and it has not seen that id yet,
//       it adds it to that chat, shows a notification, and marks it seen.
//     - No fake replies. No BroadcastChannel only.
//
// How calls go through the same file:
//   Caller: Phone app -> Call -> builds {id, from, fromName, to, toName, status:'ringing', time}
//           and PUTs it to ruby-messages.json the same way.
//   Receiver: polling sees status=='ringing' and to == my number -> shows Incoming Call box.
//             Accept -> PUTs status='accepted'. Decline -> PUTs status='declined'.
//   Caller: polling sees status=='accepted' -> shows Connected. Sees 'declined'/'ended' -> shows Declined/Ended.
//   End Call: either side PUTs status='ended'.
//   Voice itself is still mic + speakers on each device. Real voice-over-internet (WebRTC)
//   is the next step - see the calling-system guide in the chat.
//
// Message format (in ruby-messages.json):
//   { "version":1, "updated":"2026-11-15T00:00:00Z", "messages":[ ... ], "calls":[ ... ] }
//   Message: {id, from, fromName, to, toName, text, time, read}
//   Call: {id, from, fromName, to, toName, status, time}
//
// GitHub token: create at github.com/settings/tokens, needs repo access to Saturn1880/ruby-updater.
// Save it in RubyOS Messages -> GitHub token -> Save token. It stays on your device only.
