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
        const templatePath = path.join(__dirname, "approvedEmailTemplate.html");
        const template = fs.readFileSync(templatePath, "utf-8");

        // Replace the placeholders in the template with the corresponding data
        const emailContent = template
            .replace("{{data.recipient}}", data.requested_by)
            .replace("{{data.destination}}", data.destination)
            .replace("{{data.tripDates}}", `${data.date_of_trip_to} - ${data.date_of_trip_from}`)
            .replace("{{data.driverName}}", (data.name) ? data.name : 'NOT YET ASSIGNED')
            .replace("{{data.vehiclePlateNo}}", (data.plate_number) ? `${data.plate_number} ${data.model}` : 'NOT YET ASSIGNED')
            .replace("{{data.driverContactNo}}", (data.name) ? data.contact_number : 'NOT YET ASSIGNED')


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
