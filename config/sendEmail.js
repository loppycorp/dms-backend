const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendEmail = async (subject, recipient, data) => {
    try {
        // Create a Nodemailer transporter using your SMTP credentials
        const transporter = nodemailer.createTransport({
            service: "SMTP",
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Read the HTML template file
        const templatePath = path.join(__dirname, "email-template.html");
        const template = fs.readFileSync(templatePath, "utf-8");

        // Replace the placeholders in the template with the corresponding data
        const emailContent = template
            .replace("{{data.requestType}}", data.requestType)
            .replace("{{data.requestedBy}}", data.requestedBy)
            .replace("{{data.createdAt}}", data.createdAt)
            .replace("{{data.destination}}", data.destination)
            .replace("{{data.tripType}}", data.tripType)
            .replace("{{data.passengerType}}", data.passengerType)
            .replace("{{data.priority}}", data.priority)
            .replace("{{data.driver}}", data.driver)
            .replace("{{data.vehiclePlateNo}}", data.vehiclePlateNo)
            .replace("{{data.contactNo}}", data.contactNo)
            .replace("{{data.portalLink}}", data.portalLink)
            .replace("{{data.senderName}}", data.senderName)
            .replace("{{data.senderDivision}}", data.senderDivision);

        // Define the email options
        const mailOptions = {
            from: "your-email@example.com",
            to: recipient,
            subject,
            html: emailContent,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.log("Error sending email:", error);
    }
};

module.exports = sendEmail;
