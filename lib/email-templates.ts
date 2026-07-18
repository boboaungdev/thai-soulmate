import { APP_INFO, BASE_URL,CONTACT } from "@/constants"
import { User } from "@/types"

type AdminNotificationDetails = {
  prefix: string
  name: string
  dob: string
  age: number
  gender: string
  nationality: string
  location: string
  email: string
  phoneCountry: string
  phone: string
  source: string
  otherSource?: string
}

export const getUserConfirmationHtml = ({ ...userDetails }: User): string => {
  const encodedUserData = Buffer.from(JSON.stringify(userDetails)).toString(
    "base64"
  )

  return `
<div style="
font-family:Arial,sans-serif;
line-height:1.6;
color:#333;
max-width:600px;
margin:0 auto;
border:1px solid #ddd;
border-radius:8px;
overflow:hidden;
">


<div style="
background-color:#f4f4f4;
padding:20px;
text-align:center;
">

<h1 style="color:#333;">
Thank You for Registering!
</h1>

</div>



<div style="padding:20px;">


<p>
Dear ${userDetails.prefix} ${userDetails.name},
</p>


<p>
Thank you for registering your interest with us.
We're excited to have you on board!
</p>


<p>
We have successfully received your details.
A member of our matchmaking team will review your information
and contact you as soon as possible to discuss the next steps.
</p>


<p>
In the meantime, you can get started by filling application form. Please click the button below
to complete your profile application process.
</p>



<div style="text-align:center;margin:30px 0;">


<!--[if mso]>
<v:roundrect
xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:w="urn:schemas-microsoft-com:office:word"
href="${BASE_URL}/auth?mode=register&userData=${encodedUserData}"
style="
height:44px;
v-text-anchor:middle;
width:200px;
"
arcsize="10%"
strokecolor="#cfa14f"
fillcolor="#cfa14f">

<w:anchorlock/>

<center style="
color:#ffffff;
font-family:Arial,sans-serif;
font-size:16px;
font-weight:bold;
">
Register Application Form
</center>

</v:roundrect>
<![endif]-->

<!--[if !mso]><!-->

<a
href="${BASE_URL}/auth?mode=register&userData=${encodedUserData}"
style="
background-color:#cfa14f;
background-image:linear-gradient(to right,#cfa14f,#cb5d7a);
color:#ffffff;
padding:15px 25px;
text-decoration:none;
border-radius:5px;
font-weight:bold;
display:inline-block;
">
Register Application Form
</a>

<!--<![endif]-->


</div>



<p>
Best regards,
</p>
<div style="margin-top: 20px;">
  <img src="${BASE_URL}/logo.png" alt="${APP_INFO.name} Logo" style="width: 150px; height: auto;"/>
  <p style="margin-top: 10px; font-weight: bold; color: #333;">
    ${APP_INFO.name}
  </p>
  <p style="margin-top: 10px; font-size: 12px; color: #666;">
    Email: <a href="mailto:${CONTACT.email}" style="text-decoration: none;">${CONTACT.email}</a>
  </p>
  <p style="margin-top: 5px; font-size: 12px; color: #666;">
    Phone: <a href="tel:${CONTACT.primaryPhone}" style="text-decoration: none;">${CONTACT.primaryPhone}</a>
  </p>
</div>

</p>


</div>




<div style="
background-color:#f4f4f4;
color:#666;
padding:15px;
text-align:center;
font-size:12px;
">


<p style="
margin-bottom:10px;
font-style:italic;
">
This is an automated message.
Please do not reply to this email.
</p>


<p>
Copyright &copy; ${new Date().getFullYear()}
<br />
All rights reserved.
</p>


</div>


</div>
`
}

export const getAdminNotificationHtml = (
  details: AdminNotificationDetails
): string => {
  return `

<div style="
font-family:Arial,sans-serif;
line-height:1.6;
color:#333;
max-width:600px;
margin:0 auto;
border:1px solid #ddd;
border-radius:8px;
overflow:hidden;
">


<div style="
background-color:#f4f4f4;
padding:20px;
text-align:center;
">

<h1 style="color:#333;">
New Interest Registration
</h1>

</div>



<div style="padding:20px;">


<p>
A new user has registered their interest on the website.
</p>



<h2 style="
border-bottom:1px solid #ddd;
padding-bottom:10px;
margin-top:20px;
">
User Details
</h2>



<p>
<strong>Name:</strong>
${details.prefix} ${details.name}
</p>


<p>
<strong>Date of Birth:</strong>
${new Date(details.dob).toLocaleDateString()}
(Age: ${details.age})
</p>


<p>
<strong>Gender:</strong>
${details.gender}
</p>


<p>
<strong>Nationality:</strong>
${details.nationality}
</p>


<p>
<strong>Location:</strong>
${details.location}
</p>


<p>
<strong>Email:</strong>
<a href="mailto:${details.email}">
${details.email}
</a>
</p>



<p>
<strong>Phone:</strong>
<a href="tel:${details.phoneCountry}${details.phone}">
${details.phoneCountry} ${details.phone}
</a>
</p>



<p>
<strong>How did you hear about us:</strong>
${details.source}
</p>



${
  details.source === "Other"
    ? `
<p>
<strong>Other source:</strong>
${details.otherSource || "-"}
</p>
`
    : ""
}



</div>



<div style="
background-color:#f4f4f4;
color:#666;
padding:15px;
text-align:center;
font-size:12px;
">

<p>
This is an automated notification from your website.
</p>

</div>


</div>

`
}
