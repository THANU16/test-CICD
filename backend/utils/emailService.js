const { SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = require("../config/awsSESConfig");

const sendOtpEmail = async (toEmail, otp) => {
  const params = {
    Source: process.env.AWS_SES_EMAIL, // Verified email in AWS SES
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: { Data: "Your OTP Code" },
      Body: {
        Text: { Data: `Your OTP is ${otp}` },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    return res.status(500).res.json({ message: "Failed to send OTP" });
  }
};

// Send email to user
// toEmail: Email address of the recipient
// subject: Subject of the email
// message: Body of the email
const sendEmail = async (toEmail, subject, message) => {
  const params = {
    Source: process.env.AWS_SES_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: message },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

const sendTemplateEmail = async (toEmail, templateName, data) => {
  const params = {
    Source: process.env.AWS_SES_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Template: templateName,
    TemplateData: JSON.stringify(data),
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOtpEmail, sendEmail, sendTemplateEmail };
