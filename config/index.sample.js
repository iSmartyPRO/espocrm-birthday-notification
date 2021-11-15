module.exports = {
  espocrmAPIKey: "api-key-from-crm",
  timezone: "Asia/Bishkek",
  espocrmUri: "https://crm.example.com",
  mode: "production",
  dev: {
    to: "Ilias.Aidar@ismarty.pro"
  },
  reports: {
    tomorrow: "60251df900515daa1",
    nextMonth: "61920c4c511329ece"
  },
  cronJobs: {
    everyday: "0 8 * * *", // everyday at 08:00 morning
    lastDayOfMonth: "0 8 28 * *", // every 28 day of month
    //everyday: "47 13 * * *", // for test purposes
    //lastDayOfMonth: "48 13 * * *", // for test purposes
  },
  notificationTo: [
    {
      name: "Ильяс",
      email: "Ilias.Aidar@ismarty.pro"
    },
    {
      name: "Алия",
      email: "aliya@ismarty.pro"
    }
  ],
  mail: {
    pool: true,
    maxConnections: 1,
    maxMessages: 1,
    rateDelta: 3000,
    rateLimit: 1,
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      fromName: "Mail User CRM",
      user: "espocrm@example.com",
      pass: "superPa$$wordHere"
    }
  },
}