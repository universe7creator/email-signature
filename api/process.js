module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-License-Key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, jobTitle, email, phone, company, website, template = 'modern', accentColor = '#667eea' } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const data = {
    fullName: escapeHtml(fullName),
    jobTitle: escapeHtml(jobTitle || ''),
    email: escapeHtml(email),
    phone: escapeHtml(phone || ''),
    company: escapeHtml(company || ''),
    website: escapeHtml(website || ''),
    accentColor: escapeHtml(accentColor)
  };

  const templates = {
    modern: () => `
      <table cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.5; color: #333;">
        <tr>
          <td style="padding-right: 16px; border-right: 3px solid ${data.accentColor};">
            <div style="font-size: 18px; font-weight: 600; color: #1a1a1a;">${data.fullName}</div>
            ${data.jobTitle ? `<div style="color: ${data.accentColor}; font-weight: 500;">${data.jobTitle}</div>` : ''}
          </td>
          <td style="padding-left: 16px;">
            ${data.company ? `<div style="font-weight: 500; color: #1a1a1a;">${data.company}</div>` : ''}
            <div><a href="mailto:${data.email}" style="color: #666; text-decoration: none;">${data.email}</a></div>
            ${data.phone ? `<div><a href="tel:${data.phone.replace(/\s/g, '')}" style="color: #666; text-decoration: none;">${data.phone}</a></div>` : ''}
            ${data.website ? `<div><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${data.accentColor}; text-decoration: none;">${data.website}</a></div>` : ''}
          </td>
        </tr>
      </table>
    `,

    minimal: () => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
        <div style="font-weight: 600; color: #1a1a1a;">${data.fullName}</div>
        ${data.jobTitle ? `<div style="color: #666;">${data.jobTitle}${data.company ? ` · ${data.company}` : ''}</div>` : data.company ? `<div style="color: #666;">${data.company}</div>` : ''}
        <div style="margin-top: 4px;">
          <a href="mailto:${data.email}" style="color: ${data.accentColor}; text-decoration: none;">${data.email}</a>
          ${data.phone ? ` · <a href="tel:${data.phone.replace(/\s/g, '')}" style="color: #666; text-decoration: none;">${data.phone}</a>` : ''}
        </div>
      </div>
    `,

    corporate: () => `
      <table cellpadding="0" cellspacing="0" style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.6; color: #2c3e50;">
        <tr>
          <td style="padding: 12px 16px; background: #f8f9fa; border-left: 4px solid ${data.accentColor};">
            <div style="font-size: 16px; font-weight: bold; color: #2c3e50; text-transform: uppercase; letter-spacing: 0.5px;">${data.fullName}</div>
            ${data.jobTitle ? `<div style="color: #666; font-style: italic;">${data.jobTitle}</div>` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #dee2e6;">
              ${data.company ? `<div style="font-weight: 600; color: ${data.accentColor};">${data.company}</div>` : ''}
              <div><a href="mailto:${data.email}" style="color: #495057; text-decoration: none;">${data.email}</a></div>
              ${data.phone ? `<div><a href="tel:${data.phone.replace(/\s/g, '')}" style="color: #495057; text-decoration: none;">${data.phone}</a></div>` : ''}
              ${data.website ? `<div><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${data.accentColor}; text-decoration: none;">${data.website}</a></div>` : ''}
            </div>
          </td>
        </tr>
      </table>
    `,

    creative: () => `
      <table cellpadding="0" cellspacing="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #333;">
        <tr>
          <td style="background: linear-gradient(135deg, ${data.accentColor}, #764ba2); padding: 20px; border-radius: 12px;">
            <div style="color: white;">
              <div style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">${data.fullName}</div>
              ${data.jobTitle ? `<div style="opacity: 0.9; font-weight: 500;">${data.jobTitle}</div>` : ''}
              ${data.company ? `<div style="opacity: 0.8; margin-top: 8px; font-size: 13px;">${data.company}</div>` : ''}
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.3);">
                <div><a href="mailto:${data.email}" style="color: white; text-decoration: none; font-size: 13px;">✉ ${data.email}</a></div>
                ${data.phone ? `<div><a href="tel:${data.phone.replace(/\s/g, '')}" style="color: white; text-decoration: none; font-size: 13px;">📞 ${data.phone}</a></div>` : ''}
                ${data.website ? `<div><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: white; text-decoration: none; font-size: 13px;">🌐 ${data.website}</a></div>` : ''}
              </div>
            </div>
          </td>
        </tr>
      </table>
    `
  };

  const plainText = () => {
    const lines = [
      data.fullName,
      data.jobTitle,
      data.company,
      '',
      data.email,
      data.phone,
      data.website
    ].filter(Boolean);
    return lines.join('\n');
  };

  const generateTemplate = templates[template] || templates.modern;
  const html = generateTemplate();
  const text = plainText();

  return res.status(200).json({
    success: true,
    html: html.trim(),
    text: text,
    template: template
  });
};
