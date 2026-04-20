import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'vega@nordex-online.com',
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: a.content.toString('base64'),
    })),
  });

  return response;
}