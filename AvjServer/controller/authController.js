const User = require('../modals/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken)

//REGISTER A NEW USER
const signUp = async(user) =>{
    try
    {
        const newUser = new User({
            name : user.name,
            email : user.email,
            phno : user.phno,
            password : CryptoJS.AES.encrypt(user.password,process.env.SECRET_KEY).toString(),
            role : user.role
        })
        const savedUser = await newUser.save();
        return true
    }
    catch(error)
    {
        throw error;
    }
}

module.exports.signUp = signUp

//LOGIN USER
const login = async(credentials) =>{
    try
    {
        let user = await User.findOne({name : credentials.name});
        if(!user)throw 'Invalid user'
        const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if(credentials.password!=hashedPassword)throw 'Invalid Password'
        const token = jwt.sign({
            id : user._id,
            name : user.name,
            email : user.email,
            phno : user.phno,
            role : user.role
        },process.env.JWT_KEY,{expiresIn : '1d'})
        user = user.toObject()
        delete user.password
        return {userDetails : user , accessToken : token}
    }
    catch(error)
    {
        throw 'Invalid login credentials'
    }
}

module.exports.login = login

//SEND SMS
const sendSms = async() =>{
    let otp = '';
    for(i=0;i<5;i++)
    {
        otp = otp+JSON.stringify(Math.floor(Math.random() * 10) + 1)[0];
    }
    console.log(otp)
    client.messages.create({
        body : 'Message from vishwa .\n Your OTP for login is '+otp,
        to : '+916380272457',
        from : '+18573670186'
    }).then(()=>{
        return true
    }).catch((err)=>{
        console.log(err)
        throw err
    })
}

module.exports.sendSms = sendSms
