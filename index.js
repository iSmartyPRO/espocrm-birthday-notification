const nodemailer = require('nodemailer')
const moment = require('moment')
const hbs = require('nodemailer-express-handlebars')
const cron = require('node-cron')
const axios = require('axios')
const config = require('./config')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

process.env.TZ = config.timezone
moment.locale('ru')

// Mail Server
let transporter = nodemailer.createTransport(config.mail)
async function sendMail(to, recipientName, data, template = "tomorrow") {
  let hbsOptions = {
    viewEngine: {
      extname: '.hbs',
      viewPath: __dirname + '/view/email/',
      layoutsDir: __dirname + '/view/email',
      defaultLayout: 'layout',
      partialsDir: __dirname + '/view/email/partials/'
    },
    viewPath: __dirname + '/view/email',
    extName: '.hbs'
  }
  transporter.use('compile', hbs(hbsOptions))
  try {
    let mailOptions
    if (config.mode == 'development') {
      mailOptions = {
        from: `${config.mail.auth.fromName} <${config.mail.auth.user}>`,
        to: config.dev.to,
        subject: `✔ ${data.subject}`,
        template,
        context: { data, recipientName }
      }
    } else if (config.mode == 'production') {
      mailOptions = {
        from: `${config.mail.auth.fromName} <${config.mail.auth.user}>`,
        to, // list of receivers,
        subject: `✔ ${data.subject}`,
        template,
        context: { data, recipientName }
      }
    }
    try {
      await transporter.sendMail(mailOptions, function (err, res) {
        if (err) console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
  }

}



// Дни рождения - завтра

function tomorrowDoB() {
  axios.get(`${config.espocrmUri}/api/v1/Report/action/runList?id=${config.reports.tomorrow}`, { headers: { "X-Api-Key": config.espocrmAPIKey } })
    .then(res => {
      let { list } = res.data
      if (list.length) {
        list = list.map(item => {
          return {
            name: item.lastName + " " + item.firstName,
            birthdate: moment(item.birthday).format("Do MMMM"),
            DoB: item.birthday,
            DoBformated: moment(item.birthday).format('LL'),
            company: item.accountName
          }
        })
        let data = {
          list,
          receipients: config.notificationTo,
          tomorrowDate: moment().add(1, 'days').format('Do MMMM (dddd)'),
          subject: `Дни рождения на завтра - ${moment().add(1, 'days').format('Do MMMM')}`
        }
        for (let i = 0; data.receipients.length > i; i++) {
          sendMail(data.receipients[i].email, data.receipients[i].name, data, 'tomorrow')
        }
      } else {
        console.log("No DoB for tomorrow")
      }

    })
    .catch(err => console.log(err))
}


// Дни рождения - следующий месяц
function nextMonthDoB() {
  axios.get(`${config.espocrmUri}/api/v1/Report/action/runList?id=${config.reports.nextMonth}`, { headers: { "X-Api-Key": config.espocrmAPIKey } })
    .then((res) => {
      let { list } = res.data
      if (list.length) {
        list = list.map(item => {
          return {
            name: item.lastName + " " + item.firstName,
            DoB: item.birthday,
            DoBformated: moment(item.birthday).format('LL'),
            company: item.accountName
          }
        })
        let data = {
          nextMonthName: moment().add(1, 'months').format('MMMM, YYYY'),
          subject: `Дни рождения в следующем месяце - ${moment().add(1, 'months').format('MMMM, YYYY')}`,
          receipients: config.notificationTo,
          list
        }
        for (let i = 0; data.receipients.length > i; i++) {
          sendMail(data.receipients[i].email, data.receipients[i].name, data, 'nextMonth')
        }
      } else {
        console.log("No DoB for next month")
      }
    })
    .catch(err => console.log(err))
}



cron.schedule(config.cronJobs.everyday, () => {
  tomorrowDoB()
})

cron.schedule(config.cronJobs.lastDayOfMonth, () => {
  nextMonthDoB()
})