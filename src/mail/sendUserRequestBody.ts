export const sendUserRequestBody = (data: ISendMailEvent) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Request Notification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #2563eb;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            margin: 10px 0;
        }
        ul {
            list-style-type: none;
            padding-left: 0;
        }
        ul li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        ul li:last-child {
            border-bottom: none;
        }
        a.button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #2563eb;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        a.button:hover {
            background-color: #1d4ed8;
        }
        .button.cancel {
            background-color: #dc2626;
            margin-left: 10px;
        }
        .button.cancel:hover {
            background-color: #b91c1c;
        }
        .footer {
            font-size: 12px;
            color: #6b7280;
            margin-top: 30px;
            text-align: center;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello ${data.name},</h2>
        <p>You have been invited to participate in an event hosted by our platform.</p>

        <p><strong>Event Details:</strong></p>
        <ul>
            <li><strong>Event Name:</strong> ${data.event_name}</li>
            <li><strong>Event Type:</strong> ${data.event_type}</li>
            <li><strong>Location:</strong> ${data.event_location}</li>
            <li><strong>Date:</strong> ${data.event_day_of_event}</li>
            <li><strong>Start Time:</strong> ${data.event_start_of_event}</li>
            <li><strong>End Time:</strong> ${data.event_end_of_event}</li>
        </ul>

        <p><strong>Your Role in the Event:</strong> ${data.type}</p>  

        <p>Please click one of the buttons below to respond to the request:</p>
        <a href="${data.frontend_url}" class="button">Accept Request</a>
        <a href="${data.cancel_url}" class="button cancel">Cancel Request</a>

        <p>If you have any questions, feel free to contact us.</p>

        <p>Best Regards,<br>The Events Team</p>

        <div class="footer">
            <p><small>If you did not expect this email, please ignore it or <a href="mailto:support@example.com">contact support</a> for help.</small></p>
        </div>
    </div>
</body>
</html>
`;
