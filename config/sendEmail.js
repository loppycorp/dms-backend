const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const ccEmails = [
    "kimberlene_reymatias@luenthai.com",
    "markangelo_elegado@pi.luenthai.com",
    "dionela_caintic@luenthai.com",
    "sheila_aguilan@pi.luenthai.com",
    "johncorbine_santos@pi.luenthai.com",
    "marco_flores@pi.luenthai.com",
    "daryll_casaje@pi.luenthai.com",
    "joshua_mercado@pi.luenthai.com",
    "marvin_zapanta@pi.luenthai.com",
    "ace_santos@pi.luenthai.com"
];

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
        const templatePath = path.join(__dirname, "emailTemplate.html");
        const template = fs.readFileSync(templatePath, "utf-8");

        // Replace the placeholders in the template with the corresponding data
        const emailContent = template
            .replace("{{data.requestType}}", data.type)
            .replace("{{data.requestedBy}}", data.requested_by)
            .replace("{{data.createdAt}}", data.date_created)
            .replace("{{data.destination}}", data.destination)
            .replace("{{data.tripType}}", data.trip_type)
            .replace("{{data.passengerType}}", data.passenger_type)
            .replace("{{data.priority}}", data.priority)
            .replace("{{data.driver}}", data.name)
            .replace("{{data.vehiclePlateNo}}", `${data.plate_number} ${data.model}`)
            .replace("{{data.contactNo}}", data.contact_number)
            .replace("{{data.portalLink}}", data.portalLink)
            .replace("{{data.senderName}}", data.requested_by)
            .replace("{{data.senderDivision}}", data.department);

        // Define the email options
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: recipient,
            cc: ccEmails,
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
