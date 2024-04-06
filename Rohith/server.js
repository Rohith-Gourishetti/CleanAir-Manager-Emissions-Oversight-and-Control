const ex = require('express');
const app = ex();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');
app.set('view engine', 'ejs');
app.use(ex.static('html/'));
app.use(ex.static('script/'));
app.use(ex.static('style/'));
app.use(ex.static('images/'));
app.use(ex.static('uploads'));
app.use(cookieParser());
const url = "mongodb+srv://aquametrics4all:aquametrics4all@cluster0.87s2ryy.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'rohith',
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rohith.shetti03@gmail.com',
    pass: 'utpmhwjbliijtvjt'
  }
});
const register = new mongoose.Schema({
  token: String,
  register: Number,
  expiry: Date,
  email: String,
  name: String,
  form: Number
});
const emailschema = new mongoose.Schema({
  email: String
});
const employeeschema = new mongoose.Schema({
  name: String,
  email: String,
  number: Number,
  password: String,
  state: String,
  district: String,
  date: Date
});
const companyschema = new mongoose.Schema({
  name: String,
  lan: String,
  lat: String,
  number: Number,
  filpath: String,
  date: Date,
  email: String,
  message: String,
  accept: Number,
  fileName: String
});
const cschema = new mongoose.Schema({
  email: String,
  password: String
});
const otpschema = new mongoose.Schema({
  email: String,
  otp: Number,
  expiry: Date
});
const usersschema = new mongoose.Schema({
  name: String,
  phno: Number,
  email: String,
  Date: Date,
  address: String,
  password: String
});
otpschema.index({ expiry: 1 }, { expireAfterSeconds: 300 });
function calculateMD5(input) {
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(input);
  return md5Hash.digest('hex');
}
register.index({ expiry: 1 }, { expireAfterSeconds: 24 * 60 * 60 });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const absolutePath = path.join(__dirname, 'uploads/');
    cb(null, absolutePath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const registermodel = mongoose.model('tokens', register);
const empmodel = mongoose.model('employees', employeeschema);
const companymodel = mongoose.model('compaines', companyschema);
const cmodel = mongoose.model('compaineslogin', cschema);
const MailModel = mongoose.model('subscribers', emailschema);
const OTPModel = mongoose.model('OTP', otpschema);
const UserModel = mongoose.model('users', usersschema);
//employee  start page
app.get('/emplogin', function (req, res) {
  const userEmail = req.cookies.empid;
  if (userEmail) {
    res.redirect('/edashboard')
  }
  else {
    res.sendFile(__dirname + '/html/login.html');
  }
});
app.get('/', async (req, res) => {
  var x = req.cookies.uid;
  var y = req.cookies.empid;
  var z = req.cookies.cid;
  if (x) {
    res.sendFile(__dirname + '/html/userdashboard.html');
  }
  else if (z) {
    res.sendFile(__dirname + '/html/companydashboard.html');
  }
  else if (y) {
    res.sendFile(__dirname + '/html/empdashboard.html');
  }
  else {
    res.sendFile(__dirname + '/html/userhome.html');
  }
});
app.get('/elogin/:email/:password', async function (req, res) {
  var email = req.params.email;
  var password = req.params.password;
  const user = await empmodel.findOne({ email: email, password: password });
  if (user) {
    res.status(201).json({ success: true, message: 'Login Successful' });
  } else {
    const user1 = await empmodel.findOne({ email: email });
    if (user1) {
      res.status(201).json({ success: false, message: 'Password is incorrect' });
    } else {
      res.status(201).json({ success: false, message: 'User not found' });
    }
  }
});
app.get('/edashboard', async function (req, res) {
  const userEmail = req.cookies.empid;
  if (userEmail) {
    res.sendFile(__dirname + '/html/empdashboard.html');
  }
  else {
    res.sendFile(__dirname + '/html/login.html');
  }
});
app.get('/token/:token', async function (req, res) {
  const token = req.params.token;
  const users = await registermodel.find({ token: token });
  if (users.length > 0) {
    const user = users[0];
    if (user.form == 1) {
      if (user.register === 1) {
        res.render('u.ejs', { user: "Company Already Registered" });
      } else {
        res.render('companylogin.ejs', { name: user.name, email: user.email });
      }
    }
    else if (user.form == 0) {
      if (user.register === 1) {
        res.render('u.ejs', { user: "Employee Already Registered" });
      } else {
        res.render('ok.ejs', { name: user.name, email: user.email });
      }
    }
  } else {
    res.render('u.ejs', { user: "404 Link Not Found" });
  }
});
app.get('/cregister/:email/:password', async function (req, res) {
  var email = req.params.email;
  var password = req.params.password;
  try {
    const user = new cmodel({
      email: email,
      password: password
    });
    await user.save();
    res.status(500).json({ success: true, message: 'saved successfully' });
  }
  catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
  }
});
app.get('/clogin/:email/:password', async function (req, res) {
  var email = req.params.email;
  var password = req.params.password;
  const user = await cmodel.findOne({ email: email, password: password });
  if (user) {
    res.status(201).json({ success: true, message: 'Login Successfull' });
  } else {
    const user1 = await cmodel.findOne({ email: email });
    if (user1) {
      res.status(201).json({ success: false, message: 'Password is incorrect' });
    } else {
      res.status(201).json({ success: false, message: 'User not found' });
    }
  }
});
app.get('/accept/:email', async function (req, res) {
  var email = req.params.email;
  try {
    const user = await companymodel.updateOne({ email: email }, { accept: 1 });
    const user1 = await companymodel.findOne({ email: email });
    const otpExpiry = new Date();
    var token = calculateMD5(email);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 24 * 60 * 60);
    const newOTP = new registermodel({
      email: email,
      token: token,
      expiry: otpExpiry,
      register: 0,
      name: user1.name,
      form: 1
    });
    const data = {
      recipientName: user1.name,
      link: 'airmonitor.onrender.com/token/' + token,
    };
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Aqua Metrics!</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #8ac4dde4;
                    /* Set a background color if needed */
                }
                div {
                    max-width: 600px;
                    padding: 20px;
                    background-color: rgb(163, 250, 245);
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>
        <body>
        <div>
            <p><strong>Hi <em><%= data.recipientName %></em>,</strong></p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We hope this message finds you well. Thank you for registering with Team CC56</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;As we embark on a journey to promote sustainable practices, we want to bring attention to
                the importance of air pollution.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We truly appreciate your commitment to making a positive impact on the environment.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Thank you once again for joining us. You can now log in to your account using the
                following link: <a href="http://<%= data.link %>" target="_blank">Login</a>.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Note:</strong><em>The above link expires in 24 hours.</em></p>
            <p><strong>Best regards,</strong><br>
                &nbsp;&nbsp;Team CC56<br></p>
            <br>
            <p>If you have any questions or need assistance, feel free to contact us at <a
                    href="mailto:rohith.shetti03@gmail.com">rohith.shetti03@gmail.com</a>.</p>
        </div>
        </body>
        </html>
        `;
    const mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'Email for registration',
      html: await ejs.render(htmlTemplate, { data })
    };
    try {
      const response = await transporter.sendMail(mailOptions);
      await newOTP.save();
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending email or saving OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
    }
  }
  catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid input parameters' });
  }
});
app.get('/empregister/:email/:name/:number/:password/:state/:district', async function (req, res) {
  try {
    const email = req.params.email;
    const state = req.params.state;
    const district = req.params.district;
    const password = req.params.password;
    const name = req.params.name;
    const number = Number(req.params.number);
    if (!email || !state || !district || !password || !name || isNaN(number)) {
      return res.status(400).json({ success: false, message: 'Invalid input parameters' });
    }
    const existingUser = await empmodel.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }
    const newUser = new empmodel({
      email: email,
      state: state,
      number: number,
      password: password,
      name: name,
      district: district,
      date: new Date()
    });
    await newUser.save();
    const updatedUser = await registermodel.updateOne({ email: email }, { register: 1 });
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/subscribe/:email', async (req, res) => {
  try {
    var x = req.params.email;
    const new1 = new MailModel({
      email: x
    });
    await new1.save();
    const htmlTemplate = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Aqua Metrics!</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #8ac4dde4;
                    /* Set a background color if needed */
                }
        
                div {
                    max-width: 600px;
                    padding: 20px;
                    background-color: rgb(163, 250, 245);
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>

        <body></body>
        <div>
            <p><strong>Hello</em>,</strong></p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Thank you for subscribing for updates</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We truly appreciate your commitment to making a positive impact on the environment.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<strong>We are glad to enlighten you with the knowledge of air pollution.</strong></p>
            <p><strong>Best regards,</strong><br>
                &nbsp;&nbsp;Team CC56<br></p>
            <br>
            <p>If you have any questions or need assistance, feel free to contact us at <a
                    href="mailto:rohith.shetti03@gmail.com">rohith.shetti03@gmail.com</a>.</p>
        </div>
        </body>
        </html>`
    var mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: x,
      subject: 'Mail Conformation for Updates',
      text: 'Thank you for subscribing',
      html: htmlTemplate
    };
    transporter.sendMail(mailOptions)
      .then(response => {
      })
      .catch(error => {
        console.error('email failed:', error);
      });

    return res.status(200).json({ success: true, message: 'User registered successfully.' });
  }
  catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/reject/:email/:message', async function (req, res) {
  var email = req.params.email;
  var message = req.params.message;
  try {
    const user = await companymodel.updateOne({ email: email }, { accept: 0, message: message });
    const user1 = await companymodel.findOne({ email: email });
    const data = {
      recipientName: user1.name,
      message: message
    };
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Aqua Metrics!</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #8ac4dde4;
                }
                div {
                    max-width: 600px;
                    padding: 20px;
                    background-color: rgb(163, 250, 245);
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>
        <body></body>
        <div>
            <p><strong>Hi <em><%= data.recipientName %></em>,</strong></p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We hope this message finds you well. Thank you for registering with Aqua Metrics</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;As we embark on a journey to promote sustainable practices, we want to bring attention to the importance of air and awareness of air pollution.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We truly appreciate your commitment to making a positive impact on the environment.</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<strong>Your Application has been rejected.</strong></p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;We apologize for the rejection. The reason for rejecting is as follows</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<%= data.message %></p>
            <p><strong>Best regards,</strong><br>&nbsp;&nbsp;Team CC56<br></p>
            <br>
            <p>If you have any questions or need assistance, feel free to contact us at <a
                    href="mailto:rohith.shetti03@gmail.com">rohith.shetti03@gmail.com</a>.</p>
        </div>
        </body>
        </html>
        `;
    const mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'Email for rejection',
      html: await ejs.render(htmlTemplate, { data })
    };
    try {
      const response = await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending email or saving OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
    }
  }
  catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid input parameters' });
  }
});
app.get('/rreject', async (req, res) => {
  try {
    const user = await companymodel.find({ accept: 0 });
    if (user.length > 0) {
      res.json({ success: true, user: user });
    } else {
      res.json({ success: true, user: null });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid input parameters' });
  }
});

app.get('/fetchall', async (req, res) => {
  try {
    const user = await companymodel.find({ accept: 2 });
    res.json({ success: true, user: user });
  }
  catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid input parameters' });
  }
});
app.post('/cform', upload.single('file'), async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const number = Number(req.body.number);
    const lat = req.body.lat;
    const lan = req.body.lan;
    const fileName = req.file.originalname;
    const uploadedFile = req.file;
    const formData = new companymodel({
      email,
      name,
      number,
      lat,
      lan,
      fileName,
      accept: 2,
      date: new Date(),
      filepath: uploadedFile.path,
    });
    await formData.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
// company start page
app.get('/cform', async (req, res) => {
  res.sendFile(__dirname + "/html/form.html");
});
app.get("/uploads/:filename", async (req, res) => {
  var filename = req.params.filename;
  res.sendFile(__dirname + "/uploads/" + filename);
});
app.get("/companylogin", async (req, res) => {
  var email = req.cookies.cid;
  if (email) {
    res.sendFile(__dirname + "/html/companydashboard.html");
  } else {
    res.sendFile(__dirname + "/html/companylogin.html");
  }
});
app.get('/cdashboard', async (req, res) => {
  var email = req.cookies.cid;
  if (email) {
    res.redirect("/companylogin");
  } else {
    res.sendFile(__dirname + "/html/companylogin.html");
  }
});
app.get('/cfetch', async (req, res) => {
  var email = req.cookies.cid;
  if (email) {
    const user = await companymodel.findOne({ email: email });
    res.status(200).json({ success: true, user: user });
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});
app.get('/efetch', async (req, res) => {
  var email = req.cookies.empid;
  if (email) {
    const user = await empmodel.findOne({ email: email });
    res.status(200).json({ success: true, user: user });
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});
app.get("/adddetails/:name/:number", async (req, res) => {
  var email = req.cookies.cid;
  const state = req.params.state;
  const district = req.params.district;
  const address = req.params.address;
  const name = req.params.name;
  const number = Number(req.params.number);
  if (email) {
    try {
      await companymodel.updateOne({ email: email }, { name: name,number: number});
      res.status(200).json({ success: true });
    }
    catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
    }
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});
app.get("/eadddetails/:name/:number/:state/:district", async (req, res) => {
  var email = req.cookies.empid;
  const state = req.params.state;
  const district = req.params.district;
  const name = req.params.name;
  const number = Number(req.params.number);
  if (email) {
    try {
      await empmodel.updateOne({ email: email }, { name: name, state: state, district: district, number: number });
      res.status(200).json({ success: true });
    }
    catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
    }
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});
app.get('/clogout', (req, res) => {
  res.clearCookie("cid");
  res.redirect("/");
});
app.get('/elogout', (req, res) => {
  res.clearCookie("empid");
  res.redirect("/");
});
app.get('/ulogout', (req, res) => {
  res.clearCookie("uid");
  res.redirect("/");
});
app.get('/cuser/:email', async (req, res) => {
  var email = req.params.email;
  const user = await companymodel.findOne({ email: email });
  if (user) {
    res.status(200).json({ success: true, user: user });
  } else {
    res.status(200).json({ success: false, user: null });
  }
});
app.get('/euser/:email', async (req, res) => {
  var email = req.params.email;
  const user = await empmodel.findOne({ email: email });
  if (user) {
    res.status(200).json({ success: true, user: user });
  } else {
    res.status(200).json({ success: false, user: null });
  }
});
app.get('/otp1/:email', async (req, res) => {
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
  const email = req.params.email;
  const exist = await companymodel.findOne({ email })
  if (exist) {
    const newOTP = new OTPModel({
      email: email,
      otp: generatedOTP,
      expiry: otpExpiry,
    });
    var mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'otp for verfication',
      text: 'The otp for password request is:' + String(generatedOTP)
    };
    transporter.sendMail(mailOptions)
      .then(response => {
      })
      .catch(error => {
      });

    newOTP.save()
      .then(savedOTP => {
        res.json({ success: true });
      })
      .catch(error => {
        console.error('Error saving OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
      });
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
  }
});

app.get('/validate1/:email/:otp', async (req, res) => {
  var email = req.params.email;
  const otp = Number(req.params.otp);
  try {
    const existingOTP = await OTPModel.findOne({ email, otp });
    if (!existingOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.' });
    }
    const user = await empmodel.findOne({ email })
    var mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'password',
      text: 'The password as per requested is:' + String(user.password)
    };
    transporter.sendMail(mailOptions)
      .then(response => {
      })
      .catch(error => {
      });

    return res.status(200).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to validate OTP.' });
  }
});
app.get('/validate2/:email/:otp', async (req, res) => {
  var email = req.params.email;
  const otp = Number(req.params.otp);
  try {
    const existingOTP = await OTPModel.findOne({ email, otp });
    if (!existingOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.' });
    }
    const user = await cmodel.findOne({ email })
    var mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'password',
      text: 'The password as per requested is:' + String(user.password)
    };
    transporter.sendMail(mailOptions)
      .then(response => {
      })
      .catch(error => {
      });

    return res.status(200).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to validate OTP.' });
  }
});
app.get("/uadddetails/:name/:number/:address", async (req, res) => {
  var email = req.cookies.uid;
  const address = req.params.address;
  const name = req.params.name;
  const number = Number(req.params.number);
  if (email) {
    try {
      await UserModel.updateOne({ email: email }, { name: name, phno: number, address: address });
      res.status(200).json({ success: true });
    }
    catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
    }
  }
  else {
    res.status(500).json({ success: false, message: 'Failed to fetch product details.' });
  }
});
app.get('/ulogin/:email/:password', async function (req, res) {
  var email = req.params.email;
  var password = req.params.password;
  const user = await UserModel.findOne({ email: email, password: password });
  if (user) {
    res.status(201).json({ success: true, message: 'Login Successfull' });
  } else {
    const user1 = await UserModel.findOne({ email: email });
    if (user1) {
      res.status(201).json({ success: false, message: 'Password is incorrect' });
    } else {
      res.status(201).json({ success: false, message: 'User not found' });
    }
  }
});
app.get('/otp/:email', async (req, res) => {
  const generatedOTP = Math.floor(1000 + Math.random() * 9000);
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
  const email = req.params.email;
  const OTPModel = mongoose.model('OTP', otpschema);
  const exist = await UserModel.findOne({ email:email});
  if (exist) {
    return res.status(400).json({ success: false, message: 'already user exists' });
  }
  const newOTP = new OTPModel({
    email: email,
    otp: generatedOTP,
    expiry: otpExpiry,
  });
  var mailOptions = {
    from: 'rohith.shetti03@gmail.com',
    to: email,
    subject: 'otp for verfication',
    text: 'The otp for password request is:' + String(generatedOTP)
  };
  transporter.sendMail(mailOptions)
    .then(response => {

    })
    .catch(error => {
    });
  newOTP.save()
    .then(savedOTP => {
      res.json({ success: true });
    })
    .catch(error => {
      console.error('Error saving OTP:', error);
      res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
    });
});
app.get('/validate4/:email/:password/:otp', async (req, res) => {
  const email = req.params.email;
  const otp = req.params.otp;
  const password = req.params.password;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }
  try {
    const existingOTP = await OTPModel.findOne({ email, otp });
    if (!existingOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.' });
    }
    const newUser = new UserModel({
      name: '',
      phno: null,
      email,
      Date: new Date(),
      address: '',
      password: password
    });
    await newUser.save();
    return res.status(200).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to validate OTP.' });
  }
});
app.get('/validate5/:email/:otp', async (req, res) => {
  var email = req.params.email;
  const otp = Number(req.params.otp);
  try {
    const existingOTP = await OTPModel.findOne({ email, otp });
    if (!existingOTP) {
      return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired.' });
    }
    const user = await UserModel.findOne({ email: email })
    var mailOptions = {
      from: 'rohith.shetti03@gmail.com',
      to: email,
      subject: 'password',
      text: 'The password as per requested is:' + String(user.password)
    };
    transporter.sendMail(mailOptions)
      .then(response => {
      })
      .catch(error => {
      });

    return res.status(200).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to validate OTP.' });
  }
});
app.get('/userdashboard', async (req, res) => {
  var x = req.cookies.uid;
  if (x) {
    res.sendFile(__dirname + '/html/userdashboard.html');
  } else {
    res.sendFile(__dirname + '/html/ulogin.html');
  }
});
app.get("/userlogin", async (req, res) => {
  res.sendFile(__dirname + '/html/ulogin.html');
});
app.get("/ufetch", async (req, res) => {
  var x = req.cookies.uid;
  const user = await UserModel.findOne({ email: x });
  if (user) {
    return res.status(200).json({ success: true, user: user });
  }
  else {
    return res.status(200).json({ success: true, user: null });
  }
});
app.get("/maps", async (req, res) => {
  try {
    const user = await companymodel.find({ accept: 1 });
    res.json({ success: true, user: user })
  }
  catch (err) {
    res.json({ success: false })
  }
});
app.get("/cdetails/:name", async (req, res) => {
  try {
    var user = await companymodel.findOne({name:req.params.name});
    res.json({ success: true, user: user });
  } catch (err) {
    res.json({ success: false });
  }
});
const port = process.env.PORT || 4000;
app.listen(port, function () {
  console.log('server is running successfully:', port);
});