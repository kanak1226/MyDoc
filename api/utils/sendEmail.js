import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'asmikanak1234@gmail.com',
        pass: 'ofgb vlew ngtv oqkf', // ✅ App password, for dev only (don’t use like this in production)
      },
    });

    const mailOptions = {
      from: `"Nodemailer App" <asmikanak1234@gmail.com>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

export default sendEmail;
