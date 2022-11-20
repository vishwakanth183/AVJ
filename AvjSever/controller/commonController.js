const nodeMailer = require('nodemailer')
const path = require('path')
const fs = require('fs')
const handlebars = require('handlebars')
const sharp = require('sharp')
const Role = require('../modals/role')
const statusCodes = require('../statusCodes')

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vcricket1817@gmail.com',
        pass: ''
    }
})

//SEND EMAIL
const sendEmail = async (req, res) => {
    console.log("Email function called")

    const filePath = path.join(__dirname, './HtmlFiles/testMail.html')
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacement = {
        username: { 'name': "Vishwa" }
    };
    const htmlToSend = template(replacement);
    let options = {
        from: 'vcricket1817@gmail.com',
        to: 'vishwavirat774@gmail.com',
        subject: 'Your order is placed',
        // text : 'Hey you did it man',
        html: htmlToSend
    }

    // Sending mail using transporter
    transporter.sendMail(options).then((response) => {
        // console.log('Mail response',response)
        res.status(statusCodes.success).json('Email send successfully')
    }).catch((error) => {
        console.log('error', error)
        res.status(statusCodes.unprocessableEntity).json('Something wrong happend! Try to send email again')
    })

}
module.exports.sendEmail = sendEmail

//Function used to create role
const createRole = async (req, res) => {
    // console.log('Inside createRole', req.body)
    Role.create({
        roleId: req.body.roleId,
        role: req.body.role
    }).then(() => {
        res.status(statusCodes.success).json('Role Created Successfully')
    }).catch((err) => {
        console.log('error in creating role', err);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happend! Unable to create role')
    })
}

module.exports.createRole = createRole

//Function to check multer with sharp
const imageUpload = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    console.log('inside upload image',buffer);
}

module.exports.imageUpload = imageUpload
